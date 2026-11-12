"""Build site/live.json: a snapshot of what each project agent is doing.

Runs inside the Pages deploy workflow (on push and hourly). The page reads this file
first so it renders instantly, then refreshes public repos straight from the GitHub API.

Public repos: latest workflow runs (status, commit headline, times, link).
job-watcher (private): only aggregate numbers, and only when the JOB_WATCHER_TOKEN
secret exists. No company names, job titles or links ever leave that repo.

Standard library only, so the workflow needs no install step.
"""

from __future__ import annotations

import datetime as dt
import json
import os
import sys
import urllib.error
import urllib.request

OWNER = "Cibisid"
PUBLIC = {"gauntlet": "gauntlet", "gateway": "llm-gateway", "trial": "trialbridge", "site": "Cibisid.github.io"}
PRIVATE_SCOUT = "job-watcher"
API = "https://api.github.com/"


def gh(path: str, token: str | None, raw: bool = False):
    headers = {
        "Accept": "application/vnd.github.raw+json" if raw else "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "cibisid-site-live",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(API + path, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def slim(run: dict, with_message: bool = True) -> dict:
    """Keep only what the page shows. Commit headline only, never the body."""
    msg = ((run.get("head_commit") or {}).get("message") or "").split("\n")[0][:140]
    out = {
        "workflow": run.get("name"),
        "event": run.get("event"),
        "branch": run.get("head_branch"),
        "status": run.get("status"),
        "conclusion": run.get("conclusion"),
        "created": run.get("created_at"),
        "updated": run.get("updated_at"),
        "started": run.get("run_started_at"),
    }
    if with_message:
        out["message"] = msg
        out["url"] = run.get("html_url")
    return out


def public_runs(repo: str, token: str | None, events: tuple[str, ...] = ("push", "workflow_dispatch")) -> list[dict]:
    data = gh(f"repos/{OWNER}/{repo}/actions/runs?per_page=30", token)
    # Main branch only (side branches can hold unrelated experiments), and only work a person
    # started. Scheduled runs, like this site's own hourly refresh, would otherwise change the
    # snapshot every hour and force a redeploy.
    runs = [r for r in data.get("workflow_runs", []) if r.get("head_branch") == "main" and r.get("event") in events]
    return [slim(r) for r in runs[:8]]


def scout(token: str) -> dict:
    """Aggregate-only view of the private job-watcher repo."""
    runs = gh(f"repos/{OWNER}/{PRIVATE_SCOUT}/actions/runs?per_page=10", token).get("workflow_runs", [])
    scans = [slim(r, with_message=False) for r in runs
             if r.get("name") == "Job Watcher" and r.get("conclusion") not in ("cancelled", "skipped")][:6]
    dash = gh(f"repos/{OWNER}/{PRIVATE_SCOUT}/contents/data/dashboard.json", token, raw=True)
    status = gh(f"repos/{OWNER}/{PRIVATE_SCOUT}/contents/data/status.json", token, raw=True)

    updated = dt.datetime.fromisoformat(dash["updated"])
    jobs = dash.get("jobs", [])

    def is_new(job: dict) -> bool:
        try:
            first = dt.datetime.fromisoformat(str(job.get("f")).replace("Z", "+00:00"))
            return (updated - first).total_seconds() < 86400
        except ValueError:
            return False

    boards = status.get("boards", {})
    return {
        "updated": dash["updated"],
        "boards_ok": dash.get("boards_ok"),
        "boards_total": dash.get("boards_total"),
        "postings_read": sum((b or {}).get("jobs") or 0 for b in boards.values()),
        "open_roles": len(jobs),
        "companies": len({j.get("c") for j in jobs}),
        "new_24h": sum(1 for j in jobs if is_new(j)),
        "screened_out": dash.get("screened_out"),
        "schedule": "every 3 hours",
        "scans": scans,
    }


def main(out_path: str) -> int:
    token = os.environ.get("GH_TOKEN") or None
    scout_token = os.environ.get("JOB_WATCHER_TOKEN") or None
    snap: dict = {"generated": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"), "repos": {}}

    for key, repo in PUBLIC.items():
        try:
            # The site's own manual refreshes are not news; only real pushes count there.
            events = ("push",) if key == "site" else ("push", "workflow_dispatch")
            snap["repos"][key] = {"repo": f"{OWNER}/{repo}", "runs": public_runs(repo, token, events)}
        except (urllib.error.URLError, TimeoutError, ValueError) as exc:
            print(f"warn: {repo}: {exc}", file=sys.stderr)

    if scout_token:
        try:
            snap["scout"] = scout(scout_token)
        except (urllib.error.URLError, TimeoutError, ValueError, KeyError) as exc:
            print(f"warn: job-watcher: {exc}", file=sys.stderr)

    with open(out_path, "w", encoding="utf-8") as fh:
        json.dump(snap, fh, separators=(",", ":"))
    print(f"wrote {out_path}: repos={list(snap['repos'])} scout={'yes' if 'scout' in snap else 'no'}")

    # Hourly runs compare against the deployed copy and skip the deploy when nothing moved.
    prev_url = os.environ.get("PREV_URL")
    gh_output = os.environ.get("GITHUB_OUTPUT")
    if gh_output:
        changed = True
        if prev_url:
            try:
                with urllib.request.urlopen(prev_url, timeout=20) as resp:
                    prev = json.load(resp)
                prev.pop("generated", None)
                cur = dict(snap)
                cur.pop("generated", None)
                changed = prev != cur
            except (urllib.error.URLError, TimeoutError, ValueError):
                changed = True
        with open(gh_output, "a", encoding="utf-8") as fh:
            fh.write(f"changed={'true' if changed else 'false'}\n")
        print(f"changed={changed}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "site/live.json"))
