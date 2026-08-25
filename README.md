# Portfolio — Belal Alfutayh

Personal portfolio site built with React, Vite, Tailwind CSS v4, and Framer Motion.

Content lives in [`src/data/profile.js`](src/data/profile.js) — edit that file to update experience, skills, certifications, or projects; no need to touch the components.

## Design system

Tokens live in [`src/index.css`](src/index.css) under `@theme` — palette, type stacks, and the shared component classes (`.display`, `.meta`, `.card`, `.cellgrid`/`.cell`, `.rule-fade`).

A few conventions worth keeping:

- **One accent.** `--color-accent` is the only decorative colour; `--color-signal` (green) is reserved strictly for live/status indicators.
- **Numbered sections.** Every section uses the same `index · label · rule` masthead via [`Section.jsx`](src/components/Section.jsx).
- **Hairlines over gutters.** Grouped items use `.cellgrid`/`.cell` so they share one rule instead of floating as separate cards.
- Component classes sit in `@layer components` so Tailwind utilities can still override them.

## Motion

All timing lives in [`src/lib/motion.js`](src/lib/motion.js) — easing curves, durations, springs, stagger intervals, and the `riseIn` / `slideIn` / `clipUp` / `orchestrate` variant factories. Components import from there rather than inlining numbers.

- **One curve.** `ease` is the house entrance curve; `easeInOut` is for things that open *and* close; `easeOut` adds a small overshoot for tiny elements. Tailwind's default transition is overridden in `index.css` to match, so CSS hovers and JS animations agree.
- **Reduced motion.** `<MotionConfig reducedMotion="user">` in [`App.jsx`](src/App.jsx) is the global safety net. On top of that, every variant factory takes a `reduce` flag and collapses to a plain opacity fade — content still announces itself, it just stops moving.
- **Sequences, not hand-set delays.** Group entrances use `orchestrate()` on a parent so children cascade in DOM order; avoid per-element `delay` values that need re-tuning whenever copy changes.

Assertions for the factories live in the motion token test (variants must always end at `opacity: 1`, and `hidden` must never strand a transform offset when reduced motion is on).

## Résumé

The PDF lives in [`public/`](public) and is described once in [`src/data/resume.js`](src/data/resume.js) — filename, byte count, page count, modified date. Every other representation (the JSON and Markdown bodies the console serves) is *derived* from `profile.js`, so the résumé the site hands out can never describe a different career than the page above it.

Three ways in, all pointed at the same file:

- **Section 06** renders the CV as an API endpoint — pick a content type, send the request, get a `200` with real headers. `pdf` downloads; `json` and `md` render in the response panel.
- **The terminal** (`` ` ``) answers `cv` with the file's metadata and `cv --download` with a transfer bar.
- **⌘K → Download résumé (PDF)**, plus a plain `<a download>` under the console for anyone who just wants the file.

Swapping in a new PDF means dropping it in `public/` and updating `resumeFile` — nothing else reads the filename.

### The endpoint is real

[`plugins/portfolio-data.js`](plugins/portfolio-data.js) imports `src/data/resume.js` in Node and emits the same bodies as static files, so the console describes routes that exist:

| Route | What it is |
| --- | --- |
| `/api/v1/resume?format=json` | the résumé as JSON |
| `/api/v1/resume?format=md` | the résumé as Markdown |
| `/api/v1/resume?format=pdf` | redirect to the PDF |
| `/openapi.json` | the spec for the route above |
| `/llms.txt` | the whole site as plain text, for agents that get pasted a portfolio URL |

Dev and preview serve them from plugin middleware; production routes them through [`vercel.json`](vercel.json). Because the plugin reads the same module the UI does, `content-length` in the console is the byte count of the file actually served.

### The quota is enforced

Section 06 rate-limits itself: `quota` in [`src/data/resume.js`](src/data/resume.js) allows 3 requests per 10s, and the fourth returns a real `429` with `Retry-After` counting down. The rejection comes back in single-digit milliseconds because spent quota is refused before any work happens — the same shape as the policy it imitates.

The static routes above are **unmetered**, and the 429 body says so. A quota that quietly applied to `curl` too would be a lie told in JSON.

## Credentials

Certifications live in `certifications` in [`src/data/profile.js`](src/data/profile.js), newest first, each carrying the issuer's own attestation URL, credential ID, issue date, and expiry (`null` when the credential doesn't lapse).

Subsection `04.1` renders each one as the token it effectively is — an issuer asserting a claim about you. [`src/lib/credentials.js`](src/lib/credentials.js) encodes the header and payload as genuine base64url of the JSON the row shows when it unfolds, so anyone who decodes the string by hand gets exactly what the panel says.

The rules that keep it honest:

- **The third segment is never computed.** This page holds no signing key and must not render anything that looks like one. The signature shows as an opaque placeholder, and "verification" is the outbound link to the issuer — the only thing that can actually settle it.
- **`active` is derived, not asserted.** A credential with an expiry is checked against today; the old green check mark claimed verification that nothing backed.
- **The validity meter renders only where there is something to measure** — credentials that don't expire get `exp: null` instead of a meter at 0%.

Adding a credential is a `profile.js` entry; nothing else needs touching. One without a verification URL should say so rather than borrow the row's language.

## Project catalog

Section 05 joins what I wrote about each project to what GitHub says about it. Copy lives in `projects` in [`src/data/profile.js`](src/data/profile.js) with a `repo` key; the facts live in [`src/data/repos.json`](src/data/repos.json) and are refreshed from the GitHub API at build time by the same plugin.

- **Nothing in a row is asserted by hand.** Language mix, repo size, branch, and commit dates all come from the API. A repo with no cached facts renders without them rather than with placeholders.
- **A failed sync never fails the build.** The plugin warns and falls back to the committed cache, so an offline build or a spent rate limit is a stale row, not a broken deploy. `SKIP_GITHUB_SYNC=1` skips it deliberately.
- **Freshness is on screen.** The footer stamps when the facts were synced, because data that claims to be current should say when it last was.

The language bar uses a mono-hue accent ramp rather than a colour per language — the palette allows one accent, and a stacked bar only needs enough separation to read as segments.

## The one chart

[`StackTimeline.jsx`](src/components/StackTimeline.jsx) renders subsection `03.1` — the only chart on the site, and the only element that isn't type. The changelog above it says what each role shipped; this says what the roles were *made of*, on one time axis, so the handoff from database work to cloud work is a shape rather than a claim in a paragraph.

- **Emphasis, not category.** Eleven technologies, two colours: the current stack in the accent and everything earlier in `--color-chart-mute`. Eleven categorical hues would bury the only point the chart makes. The mute tone is validated to read as gray (chroma 0.03) while holding ΔE 30.5 from the accent for normal vision and 23.9 under protanopia.
- **Nothing is a second copy of the career.** [`lib/stackTimeline.js`](src/lib/stackTimeline.js) parses the same `experience[].period` and `experience[].stack` the changelog renders, so adding a job to `profile.js` puts it on the chart with no dates to keep in sync. Rows are ordered by first appearance, which is why the drawing steps down and to the right.
- **What it is allowed to claim.** The data records the technologies a role's stack *listed*, over that role's period — not when someone stopped using something. The caption says exactly that, and a technology that reappears after a gap gets **two bars rather than one long one**, because the gap happened.
- **`current` is derived, not asserted.** A technology counts as current because it appears in the stack of the role whose period is still open, not because it has the most recent date.
- **A label that won't fit isn't drawn.** The role lane names a span only when the span is at least 18% of the domain; the three-month internship is too narrow to hold its own name, so it stays a block and the table view carries the label. A clipped label would be worse than none.
- **The table is the real data path.** A `<details>` disclosure holds every row as an actual `<table>`, so no value is reachable only by hovering.

## The break in the pattern

Every other section speaks in the vocabulary of the work — changelogs, catalogs, endpoints, tokens, indices, mono labels. Held for seven sections, a conceit stops being a conceit. [`Personal.jsx`](src/components/Personal.jsx) (section `07`) drops all of it: one narrow measure of plain prose at one size, no monospace in the body, no metaphor, no numbers.

It keeps the seam and the plate, because those are the document's binding rather than its costume. Copy lives in `personal` in [`src/data/profile.js`](src/data/profile.js).

## Two ways in, each aware of the other

The `` ` `` console and the ⌘K palette occupy the same slot in a visitor's head, and each used to be invisible from the other. Now the palette's *Open terminal* row carries the `` ` `` key as a `kbd`, and the console's `help` names the palette. Whoever finds one learns the second exists.

The console is also usable with thumbs: below `sm` it renders a scrolling rail of command chips and suppresses autofocus, so opening it on a phone shows output instead of throwing up the soft keyboard. The chips call the same `runLine()` the form does — there is no second execution path to keep in sync.

## Routing

There is no router. [`vercel.json`](vercel.json) rewrites unmatched paths to `index.html` and [`App.jsx`](src/App.jsx) renders [`NotFound.jsx`](src/components/NotFound.jsx) for anything that isn't `/`. Static files resolve before the rewrite, so the PDF and the artifacts above never reach that check.

The 404 lists only routes that genuinely exist — it reads the same `endpoint` and `resumeFile` definitions the console does.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

Deployed on [Vercel](https://vercel.com)'s free tier via Git integration — push to `main` and it redeploys automatically.
