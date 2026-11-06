# Implementation checklist

Status as of 2026-10-25. "Done" means implemented and covered by an automated test or a browser smoke run. "Partial" says what is missing.

## Vertical slice (priority order from the brief)

| # | Item | Status | Notes |
|---|---|---|---|
| 1 | Placement assessment | Done | 9-item screen, then adaptive branching by ability; resumable; "I don't know"; confidence on every answer; self-reported slip vs gap; report with strengths, test-out modules, gaps, needs-more-assessment, recommended start. |
| 2 | Personalized curriculum map | Done | Prerequisite graph (topological) shown as a course outline: units in path order, per-module progress rings and stars, placement verdicts, remediation first, planned modules grouped under "Coming soon". |
| 3 | Several complete lessons | Done | See "Module build-out" below for current counts. Progressive disclosure with four explanation layers per concept and optional AI tutor. |
| 4 | At least three animations | Done | Six: neuraxis lesion explorer, NMJ comparator, conduction explorer, vascular territory map with penumbra, eye movement simulator, seizure spread with schematic EEG and status timeline. Pause, replay, speed, captions, step mode for reduced motion, schematic label. |
| 5 | Working patient encounter | Done | History (free text and topic chips), exam maneuvers, orders with realistic turnaround, actions, ranked differential, submission, interpretation step, debrief, AI tutor after submission. |
| 6 | Two-question speed mode | Done | Counter, request cost shown before use, bundles count once, skip reveals explanation, limit enforced server-side. |
| 7 | Persistent stars and spaced review | Done | Three evidence-based stars, permanent once earned; retention shown separately; Leitner scheduling with "why is this due"; controlled clock. |
| 8 | Source-linked reference entries | Done | 39 antibody entries with coverage date and 26 listed gaps; 66 investigations; 59 verified sources. |
| 9 | API settings and no-key demo mode | Done | Provider adapter (Anthropic SDK, OpenAI-compatible), server-side keys, masked display, connection test, model selection, streaming, cancel, timeouts, retries, usage and cost, per-session and daily limits, rate limiting. |

## Acceptance criteria

| Criterion | Status | Where verified |
|---|---|---|
| Placement performance changes the recommended path | Done | `tests/learning.test.ts` |
| Demonstrated knowledge can bypass introductory instruction | Done | Placement "Skip it", module challenge; `tests/learning.test.ts` |
| Weaknesses trigger remediation | Done | Path status "remediate", missed items scheduled sooner; `tests/learning.test.ts` |
| Progress survives reloads | Done | localStorage plus server copy; round-trip test |
| Delayed review testable with a controlled clock | Done | Settings > Simulated clock; `tests/learning.test.ts` |
| Stars reflect demonstrated achievement | Done | Star rules in `shared/stars.ts`; opening a lesson earns nothing |
| Two-question limit works consistently | Done | Enforced on the server; `tests/api.test.ts` |
| Cases remain internally coherent | Done | `shared/caseValidate.ts` on all 26 cases |
| Patient dialogue does not reveal hidden answers | Done | Leak checks on authored dialogue and on AI replies; `tests/content.test.ts`, `tests/api.test.ts` |
| Equivalent clinical answers receive credit | Done | Typos, abbreviations, synonyms, word order, negation; `tests/grading.test.ts` |
| Necessary urgent actions are recognized | Done | Deadlines, deteriorations, debrief timeline |
| Unnecessary tests do not improve the score | Done | Items and encounters; tests in both suites |
| API secrets stay out of client code and logs | Done | Keys only on server, masked status, log redaction, mode 0600 file; tests |
| Missing or failed API connections have fallbacks | Done | Rule-based patient, prewritten layers, rule-based grading; clear UI states |
| Medical claims expose sources and review status | Done | Provenance line on lessons, items, reference entries, modules; coverage tab |
| Mobile and keyboard | Done | `npm run smoke` at 375 px; keyboard reachability; number keys for MCQ |

## Module build-out (started 2026-11-06)

Planned modules are being written one file per module in `content/modules/` (guide: `docs/MODULE_AUTHORING.md`). The validator enforces at least 6 items, a passable test-out with a transfer item, lessons ending in a summary, and verified new sources.

| Batch | Modules | Status |
|---|---|---|
| 1 | f-terminology, f-cells, f-cranial-nerves-all, f-sensory-visual-vestibular, f-autonomic-pathways, x-symptoms-signs | Done |
| 2 | x-mental-status, x-cn-exam, x-coordination-gait, x-coma | Done |
| 3 | c-ich-sah, c-tia-secondary, c-cvt-dissection, c-headache, c-spinal-emergencies, c-ms, c-nmosd-mogad | Done |
| 4 | c-encephalitis-viral, c-epilepsy-mimics, c-polyneuropathy-radiculopathy, c-myopathy-mnd, c-parkinsonism, c-dementia, c-vertigo-vision | Done |
| 5 | c-toxic-nutritional, c-paraneoplastic, c-rpd, c-autonomic, c-sleep, c-neuro-oncology, c-neurocritical, c-fnd, c-pediatric, c-neuropsychiatry, a-atypical-overlap | Done |
| 6 | x-motor-sensory-exam, a-multiple-dx, a-incidental, a-revise-escalate | In progress (restarted after a container restart) |

Totals so far: 45 complete modules, 4 planned, 99 lessons, 473 items, 613 glossary terms, 187 verified sources. All new content is an AI draft awaiting clinician review; `docs/REVIEW_NOTES.md` lists what each author flagged, and `docs/proposed-sources.md` lists sources that could not be verified and are not cited.

## Generated practice (added 2026-11-05)

| Item | Status | Notes |
|---|---|---|
| Generated questions on any module | Done | `shared/generate.ts`, `content/cases/generation.ts`; per-question checks; targeted at weakest abilities |
| Generated cases (workup, emergency, speed) | Done | Same validator as authored cases plus a dialogue leak probe; one repair round |
| Hosted page via the viewer's Claude account | Done, not run live | Exercised with a stand-in for the `sample` capability; real calls inside claude.ai not yet observed |
| Self-hosted via API key | Done, not run live | Tested with a mock provider |
| Kept out of stars and mastery | Done | `Attempt.generated`; covered by tests |

## Partial or not done

- **Live AI calls are untested against a real provider.** No key was available while building. The Anthropic adapter compiles against the official SDK types and follows current documentation (streaming, structured output via `messages.parse`, server-side refusal fallback), and all AI paths are tested with a mock provider. Test with a real key before relying on it.
- **Published patient cases: none yet.** The data model, labeling, attribution fields, and validator support adapted published cases, but no case with a verified reuse license has been added. All 26 cases are labeled synthetic.
- **No real images.** All figures are schematic and labeled as such. Licensed image support is not built.
- **Human review: none yet.** Every lesson, item, reference entry, and case is an AI draft awaiting clinician review. The review workspace records approvals per content version.
- **Source verification was done from search-result records**, not by opening each page. Each source says so; open the links once before relying on page numbers. One source (Safdieh 2019) has an open DOI question noted in its record.
- **Hints:** attempts track hint use, but no hint feature exists yet, so the count stays at zero.
- **Accounts:** cross-device continuity uses a sync code, not authenticated accounts.
- **Encounter vocabulary gaps reported by case authors:** no venography, lactate, stool culture, PSA, prolactin, or DaT scan investigations; no B12 replacement, oral steroid, IV fluid, analgesia, antipsychotic, or chemoprophylaxis actions; ordering constraints ("antibiotics before CT, CT before LP") can only be expressed as deadlines.
- **Bundle size** is about 1 MB because content ships with the client; route-level code splitting is a next step.

## Next steps (suggested order)

1. Clinician review pass on the 10 complete modules, starting with emergency content (stroke, meningitis, status epilepticus, cord compression).
2. Run the live AI paths with a real key and record the results.
3. Fill the encounter vocabulary gaps above.
4. Write lessons for the examination modules.
5. Expand clinical domains in prerequisite order (demyelinating, headache, movement, cognitive).
6. Add licensed published cases with attribution.
