# cibisid.github.io

Personal portfolio of Cibi Siddarth, software engineer for AI/ML and data.

Live at https://cibisid.github.io

The whole site is one static page, `site/index.html`, with in-browser demos of Gauntlet, LLM Gateway, TrialBridge, job-watcher and a housing affordability calculator. Pushing to `main` deploys it through GitHub Actions.

The previous Next.js version of the site is kept on the `old-site` branch.

## Live agent desk

The homepage's "My agents, right now" section shows each project's latest GitHub Actions run as an animated robot. `scripts/build_live.py` writes `site/live.json` during every deploy and on an hourly schedule (the hourly run skips the deploy when nothing changed). Visitors' browsers then refresh the public repos straight from the GitHub API.

job-watcher is private. To show its scan totals, add a fine-grained token with read-only **Actions** and **Contents** access to `Cibisid/job-watcher` as the repository secret `JOB_WATCHER_TOKEN`. Only aggregate numbers are published, never company names, titles or links.
