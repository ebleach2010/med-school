# Writing a module

Each planned module has a file `content/modules/<module-id>.ts` that exports `CONTENT`, which is `null` until the module is written. Replace the `null` with a `ModuleContent` (see `content/modules/types.ts`). The curriculum, lessons, items, glossary, and source registry pick it up automatically and the module shows as complete. Edit only your module's file.

Study the finished modules first; match their depth, tone, and structure:

- Lessons: `content/lessons/foundations.ts` (`l-umn-lmn`, `l-lesion-level`) and `content/lessons/clinical.ts` (`l-meningitis`, `l-nmj`, `l-gbs-conduction`)
- Items: `content/items/lessonItems.ts` (all formats), `content/items/placement.ts`
- Glossary: `content/glossary.ts` (the `t(...)` entries); use `term(...)` from `content/modules/types.ts`, same arguments
- Sources: `content/sources.ts`
- Item and lesson types: `shared/types.ts`; free-text matcher: `shared/text.ts`

## What a module needs (the validator enforces this)

- `module`: summary, 3 to 5 objectives as `[skill, text]` pairs, lesson ids, at least 3 `challengeItems`, `skills`, `minutes`, and `sources` (registry ids).
- 1 to 3 lessons. Each lesson: `hook`, at least one `explain` with `layers` (simpler, mechanism, compare, deeper), an `animation` step only where an existing animation genuinely fits, `predict` and `apply` question steps, and a final `summary` whose `reviewItemIds` list the lesson's retrieval items.
- At least 6 items tagged with the module (existing placement items tagged with it count, but write at least 5 of your own). Use a mix of formats: `mcq` (with `reasoning` follow-up where useful), `multi-select`, `free-text`, `localization`, `select-tests`, `order-priority`.
- At least one item with difficulty 2 or 3 on a different `presentation`, and it must be among the `challengeItems`: the test-out needs a transfer question to be passable.
- Glossary terms for the jargon the lessons use.

## Ids

- Lessons: `l-<slug>` (for example `l-sah-thunderclap`). Items: `m-<module-slug>-<short>` (for example `m-ichsah-ct`). Terms: lowercase hyphenated, like the existing ones.
- Before adding a term, search `content/glossary.ts` and the other files in `content/modules/`. If the id exists, use it; do not redefine it.
- Mark glossary terms in text as `[[term-id|shown text]]`. Every id you use must exist in the main glossary or in your module's `terms`.

## Items

- `usage`: lesson question steps and retrieval items `["lesson", "review"]`; add `"challenge"` to challenge items.
- `presentation`: a short tag for the clinical picture. Different tags count as transfer evidence. `family`: shared by variants of one question, so they are not counted as independent.
- MCQ: exactly one `correct: true`. Every wrong option gets a `tag` (misconception, terminology, knowledge-gap, weak-reasoning, unsafe-priority, ...) and one sentence of `feedback`.
- Free-text: the answer key is matched by meaning (see `shared/text.ts`): abbreviation expansion, light stemming, typo tolerance, phrase proximity. Patterns are short lowercase phrases a learner would type; `" + "` joins concepts that must all appear. The `modelAnswer` must earn full credit against its own key (validator checks). Add `partial` and `wrong` concepts for the predictable near-misses. Test a few realistic answers: `npx tsx -e 'import {gradeFreeText} from "./shared/text"; ...'`.
- `select-tests`: categories `necessary`, `reasonable`, `unnecessary`, `harmful`, each with a one-line `why`. At least one necessary.
- `order-priority`: `order` is an array of groups; steps in one group may come in any order.
- `rationale` explains the mechanism, not just the answer.
- Give every item's `meta` the registry sources that support it (at least the module's anchor source), not an empty list.

## Evidence and copy rules

- Cite only ids in `content/sources.ts`, or new sources you add in your file's `sources`.
- A new source must be verified on the web before you add it: confirm title, authors, journal, year, and DOI or PMID from search results that index PubMed, the publisher, or the issuing organization. Use `https://doi.org/<doi>` as the URL when there is a DOI. Set `lastVerified: "2026-11-06"`, `verified: true`, and a `verificationNote` that says how it was checked. PubMed itself cannot be opened from this environment; say so in the note, as the existing entries do. If you cannot confirm it, do not add it: list it in your report as a proposed source instead.
- Never fabricate a citation. A model's own knowledge is not a citation. Keep claims to mainstream teaching that the cited sources support; leave out specific numbers (doses, cutoffs, percentages) you cannot tie to a source.
- All patients are synthetic: no real names, institutions, or identifiable cases.
- No em dashes anywhere (the character U+2014). Use commas, colons, or parentheses.
- Plain, direct English. Do not claim the module establishes clinical competence.

## Animations available

`motor-pathway` (presets `umn-vs-lmn` or `level`), `nmj`, `conduction`, `vascular-territories`, `eye-movements`, `seizure-eeg`. Others take no preset. Skip the animation step if none fits.

## Checks before you finish

```
npm run typecheck
npm run validate:content
npx vitest run
```

All three must pass with no errors from your module.
