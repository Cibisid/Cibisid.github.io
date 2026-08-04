# cibisid.github.io

Personal site for Cibi Siddarth — AI / Applied AI Engineer.

Live at **https://cibisid.github.io**

## What's interesting here

The two interactive panels on the page are not mockups. They run ported copies
of real logic from [TrialBridge](https://github.com/Cibisid/trialbridge):

| Browser module | Ported from |
|---|---|
| `src/lib/criteria.ts` | `backend/agent/criteria.py` |
| `src/lib/patientStore.ts` | `backend/agent/patient_store.py` |

So typing `asthma` into the lookup panel returns the genuine `NOT_MENTIONED`
response — the note never mentions asthma, and that is not evidence the patient
doesn't have it. Editing the criteria textarea re-runs the real parser.

Ports drift. `scripts/verify-port.ts` asserts these against the same
expectations as the Python test suite (29 checks: bullet markers, wrapped
criteria, header-less text staying `UNSPECIFIED`, lab aliasing, negation
resolved before positives). It runs in CI before every deploy, so if the Python
changes and the ports don't, the build fails rather than the site quietly
misrepresenting the project.

```bash
npm run verify:port
```

## Content

Every claim on the page comes from `src/content/profile.ts`. The rule for the
projects list is that anything without a public repository doesn't appear — a
portfolio entry a reader can't click through to is a claim taken on faith.

## Images

Drop files into `public/media/` and they appear automatically:

| File | Where it shows |
|---|---|
| `unf.jpg` | University of North Florida, education section |
| `vit.jpg` | Vellore Institute of Technology, education section |

Until a file exists, `src/components/Figure.tsx` renders a placeholder naming
it. Nothing points at a missing path, so there is never a broken-image glyph.

## Motion

CSS scroll-driven animations (`animation-timeline: view()` / `scroll()`), not a
smooth-scroll library. Native scrolling is untouched, so momentum, trackpad
feel, find-in-page and keyboard paging all still work.

Dim and hidden starting states live only in `@keyframes`, never as base
declarations — if a timeline fails to advance, or the reader prefers reduced
motion, elements sit in their finished visible state instead of disappearing.

## Local development

```bash
npm install
```

```bash
npm run dev
```

Build the static export the way CI does:

```bash
npm run build
```

## Stack

Next.js 16 (App Router, static export), React 19, Tailwind CSS v4, TypeScript.
Deployed to GitHub Pages by `.github/workflows/deploy.yml`. No webfonts — the
type stack is system fonts, so nothing blocks first paint.
