# Implementation checklist

Status as of 2026-10-25. "Done" means implemented and covered by an automated test or a browser smoke run. "Partial" says what is missing.

## Vertical slice (priority order from the brief)

| # | Item | Status | Notes |
|---|---|---|---|
| 1 | Placement assessment | Done | 9-item screen, then adaptive branching by ability; resumable; "I don't know"; confidence on every answer; self-reported slip vs gap; report with strengths, test-out modules, gaps, needs-more-assessment, recommended start. |
| 2 | Personalized curriculum map | Done | Prerequisite graph (topological), path view and full map, placement verdicts, remediation first, planned modules shown as planned. |
| 3 | Several complete lessons | Done | 12 lessons across 10 complete modules. Progressive disclosure with four explanation layers per concept and optional AI tutor. |
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

## Partial or not done

- **Live AI calls are untested against a real provider.** No key was available while building. The Anthropic adapter compiles against the official SDK types and follows current documentation (streaming, structured output via `messages.parse`, server-side refusal fallback), and all AI paths are tested with a mock provider. Test with a real key before relying on it.
- **Published patient cases: none yet.** The data model, labeling, attribution fields, and validator support adapted published cases, but no case with a verified reuse license has been added. All 26 cases are labeled synthetic.
- **No real images.** All figures are schematic and labeled as such. Licensed image support is not built.
- **Human review: none yet.** Every lesson, item, reference entry, and case is an AI draft awaiting clinician review. The review workspace records approvals per content version.
- **Source verification was done from search-result records**, not by opening each page. Each source says so; open the links once before relying on page numbers. One source (Safdieh 2019) has an open DOI question noted in its record.
- **Examination domain modules are planned only.** Exam technique is taught in context (maneuver descriptions in encounters) but the six exam modules have no lessons.
- **Most clinical domains are planned.** See `docs/COVERAGE.md`; the map shows them as planned.
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
