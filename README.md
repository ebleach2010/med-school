# Neuro Tutor

An adaptive web app for learning clinical neurology, from medical school foundations to advanced reasoning. You start with a placement assessment, then work through a personalized path of short interactive lessons, schematic animations, simulated patient encounters, speed rounds, and spaced review.

**Educational use only.** Completing it does not confer a degree, license, or qualification to practice, and its assessments do not establish clinical competence. Every patient is a synthetic simulation. All medical content is currently an AI draft awaiting clinician review, and the app labels it that way.

## Use it on your phone

A hosted copy runs as a web page on claude.ai: https://claude.ai/artifact/NRVkCcRk1ZoQ3XagpCGbRt (private to its owner until shared from the page's Share menu).

- **iPhone or iPad (Safari):** open the link, tap Share, then **Add to Home Screen**.
- **Android (Chrome):** open the link, tap the menu, then **Add to Home screen**.

The hosted copy is the standalone build (`npm run build:standalone`). It runs without the app server:
- The encounter engine runs in the browser, so case answer keys ship with the page instead of staying on a server.
- Progress saves in the browser and to your Claude account, so it follows you across devices when you're signed in.
- The AI tutor and natural patient phrasing use your own Claude account (no API key); the first use asks permission.
- The review workspace and API-key settings need the self-hosted version.

To self-host instead, `npm run build && npm start` serves the full app with a web app manifest and icons, so its URL can be added to a home screen as an app too.

## Quick start

```bash
npm install
npm run dev          # API on :8787, web app on :5173 (proxied)
```

Production-style:

```bash
npm run build && npm start   # serves the built app and API on :8787
```

Requires Node 22.13 or later (it uses the built-in `node:sqlite`).

## What is built

- **Placement:** an adaptive check of nine abilities. It starts with a 9-question screen, then asks more only where your level is unclear. It never treats one correct answer as mastery and needs a different presentation before it calls something demonstrated. It also tracks confidence, "I don't know," and self-reported slips.
- **Curriculum map:** 49 modules across 23 domains. 10 are complete, 1 is partial, and 38 are planned and shown as planned. Placement results decide what you can skip and what needs remediation.
- **Lessons:** 12 lessons, each with a hook, an explanation with four optional deeper layers, an animation or model where useful, a prediction, an application case, and scheduled retrieval. Every glossary term is tappable (125 terms).
- **Animations:** six schematic models, each with play, pause, speed, captions, and a step mode for reduced motion.
- **Encounters:** full workup, emergency (the clock runs and delays have consequences), diagnostic uncertainty, and a longitudinal clinic. Hidden case state stays on the server.
- **Speed rounds:** two requests, then you name the diagnosis.
- **Grading:** scores meaning, not wording. Diagnosis, localization, reasoning, urgent actions, investigation choice, and interpretation are scored separately. Unnecessary tests can only lower your score. Time is shown but never scored.
- **Progress:** three stars per module that are kept once earned, with current retention shown separately. Also mastery with the evidence behind it, first-attempt accuracy, delayed recall, error patterns, an activity calendar, export and import, and a sync code for other devices.
- **Reference:**
  - 39 antibody entries, with a coverage date and a list of known gaps
  - 66 investigations, each covering indications, timing, limitations, and how to read the result
  - 59 verified sources
  - a coverage matrix
- **Review workspace:** approve or flag content by version, preview hidden cases, review update proposals, and draft new content with AI. Drafts are validated and nothing publishes without approval.

`docs/IMPLEMENTATION_CHECKLIST.md` lists what is done, what is partial, and what is missing. `docs/COVERAGE.md` is generated from the content (`npm run coverage`).

## Architecture

| Path | What lives there |
|---|---|
| `shared/` | Typed, pure logic used by both client and server: the content model (`types.ts`), answer matching (`text.ts`), item grading, mastery estimates, placement, recommendations, scheduling, stars, patient dialogue, case validation, Zod schemas |
| `content/` | Curriculum, lessons, items, glossary, investigations, antibodies, the source registry, and cases. Kept separate from presentation code. Cases (`content/cases`) are imported only by the server. |
| `server/` | Hono API on Node with SQLite storage. Covers progress sync, the encounter engine and grading, review records and proposals, AI usage, and the AI layer (`server/ai`: provider interface, Anthropic SDK adapter, OpenAI-compatible adapter, role prompts, limits and cost tracking). |
| `src/` | React client built with Vite. Pages, components, and animations. Learner state lives in localStorage and syncs to the server. |
| `tests/` | Vitest suites for grading, learning logic, content coherence and leak checks, and the API |
| `scripts/` | Content validator, coverage report, browser smoke test |

**Content versioning.** Each content item has a version. Every attempt stores the version it saw, plus a snapshot of your answer and the expected answer, so old attempts stay readable after content changes.

## AI integration (optional)

Without a key, the app runs in demo mode. Patients answer by rules from authored facts, explanation layers are prewritten, and grading is rule-based. With a key you also get:

- natural patient phrasing (still limited to patient-knowable facts and checked for answer leaks)
- a streaming tutor that you can cancel
- an AI check of whether an unrecognized answer is equivalent to an accepted one
- AI-drafted proposals for review

To add a key, use **Settings > AI provider**, or set `ANTHROPIC_API_KEY` in the server environment (see `.env.example`). Keys are stored in `data/secrets.json` with mode 0600. The browser only ever sees a masked form, and log output redacts keys. The default model is `claude-opus-5-5`; a faster model can be set for patient dialogue. Each role has its own prompt and only the information it needs. The patient never sees exam or test results, and the tutor sees the case answer only after you submit. Learner text is wrapped and handled as untrusted data. Hidden reasoning is never stored.

The live provider paths have not yet been run against a real key. They are tested with a mock provider.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | API and web app with reload |
| `npm test` | Vitest suites |
| `npm run typecheck` | TypeScript across client, server, content, and tests |
| `npm run validate:content` | Cross-references, citations, answer-key self-consistency, case coherence, em dash check |
| `npm run coverage` | Regenerate `docs/COVERAGE.md` |
| `npm run build:standalone` | Build the serverless single-page version used for the hosted copy (`dist-standalone/neuro-tutor.html`) |
| `npm run smoke` | Browser smoke test at phone width with keyboard checks (needs the app running on :8787) |

## Configuration

- `PORT`: API port (default 8787)
- `DATA_DIR`: SQLite and secrets location (default `data/`, gitignored)
- `ADMIN_TOKEN`: if set, review actions require this token
- `ANTHROPIC_API_KEY`, or `OPENAI_COMPATIBLE_API_KEY` with `OPENAI_COMPATIBLE_BASE_URL`: optional

The interface font (Figtree) loads from Google Fonts. If that request is blocked or offline, the app falls back to the system font and works the same.

## Content and evidence rules

- Content may cite only sources in `content/sources.ts`. Each was checked on 2026-10-25, and its record says how. A model's own knowledge is never a citation.
- Lessons, items, and reference entries carry provenance, review status, and a last-verified date. Cases are labeled synthetic.
- Proposed but unverified sources go in `docs/proposed-sources.md`, not into content.
