// Procedural practice: prompts for AI-generated questions and cases, and the checks every
// generated item must pass before a learner sees it. Used by the server (API key) and by the
// hosted page (the viewer's Claude account). Generated content is synthetic, labeled as not
// reviewed, and never counts toward stars or mastery.

import { z } from "zod";
import type { AssessmentItem, CaseDef, Lesson, McqItem, Module, SkillId } from "./types";
import { SKILLS, SKILL_LABELS } from "./types";
import { caseSchema } from "./schemas";
import { validateCase, type ValidationIssue } from "./caseValidate";
import { INTENTS, answerQuestion, containsLeak } from "./dialogue";
import { MANEUVERS } from "./exam";
import { ACTIONS } from "./actions";

const RULES = `Rules:
- Everything is a synthetic teaching example. No real patients, names, or institutions.
- Stay consistent with mainstream clinical teaching and the material provided. If unsure of a fact, leave it out.
- Never cite sources, guidelines by year, or studies. Never invent statistics.
- Write in plain, clear English. Do not use em dashes.
- Reply with only the JSON value requested, no other text.`;

function strip(s: string, max = 600): string {
  const t = s.replace(/\[\[[^|\]]+\|([^\]]+)\]\]/g, "$1").replace(/\s+/g, " ").trim();
  return t.length > max ? `${t.slice(0, max)}...` : t;
}

/** What the model may draw on: the module's scope plus the key points of its lessons. */
export function moduleBrief(m: Module, lessons: Lesson[]): string {
  const parts = [`Module: ${m.title} (${m.level})`, `Scope: ${strip(m.summary)}`, `Objectives:\n${m.objectives.map((o) => `- ${o.text}`).join("\n")}`];
  for (const l of lessons) {
    const pts: string[] = [];
    for (const st of l.steps) {
      if (st.kind === "explain") pts.push(strip(st.body, 500));
      if (st.kind === "summary") pts.push(...st.points.map((p) => strip(p, 200)));
    }
    parts.push(`Lesson "${l.title}":\n${pts.map((p) => `- ${p}`).join("\n")}`);
  }
  if (!lessons.length) parts.push("This module has no written lessons yet: keep to core, uncontroversial teaching.");
  return parts.join("\n\n");
}

// ------------------------------------------------------------------ questions

// Plain types only: constrained decoding does not enforce lengths, so limits are checked per
// question in toGeneratedItems, where a failure drops one question instead of the whole set.
export const generatedQuestionSchema = z.object({
  skill: z.enum(SKILLS as unknown as [SkillId, ...SkillId[]]),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  presentation: z.string(),
  vignette: z.string().optional(),
  stem: z.string(),
  options: z.array(z.object({ text: z.string(), correct: z.boolean(), feedback: z.string().optional() })),
  rationale: z.string(),
});
/** The shape asked for. Parsing is per question, so one bad question does not sink the set. */
export const generatedQuestionsSchema = z.object({ questions: z.array(generatedQuestionSchema) });

function questionProblems(q: z.infer<typeof generatedQuestionSchema>): boolean {
  const texts = new Set(q.options.map((o) => o.text.trim().toLowerCase()));
  return (
    q.stem.trim().length < 8 ||
    q.stem.length > 400 ||
    q.rationale.trim().length < 20 ||
    (q.vignette?.length ?? 0) > 1200 ||
    q.options.length < 3 ||
    q.options.length > 6 ||
    q.options.some((o) => !o.text.trim() || o.text.length > 250) ||
    q.options.filter((o) => o.correct).length !== 1 ||
    texts.size !== q.options.length
  );
}

export function questionPrompt(brief: string, opts: { count: number; focusSkills: SkillId[]; avoid: string[] }): string {
  const focus = opts.focusSkills.length ? opts.focusSkills : (["localization", "differential", "mechanisms"] as SkillId[]);
  return `You write multiple-choice practice questions for a clinical neurology course.

${brief}

Write ${opts.count} new questions on this module. Favor these abilities, which the learner is weakest at: ${focus.map((k) => `${k} (${SKILL_LABELS[k]})`).join(", ")}.
Allowed skill values: ${SKILLS.join(", ")}.
Each question:
- A short clinical vignette (2 to 4 sentences) when the question is about a patient, then a one-sentence stem.
- 4 options, exactly one correct. Wrong options are plausible mistakes a student makes, each with one sentence of feedback saying why it is wrong.
- The stem and vignette must not give the answer away.
- "presentation" is a 2 to 5 word tag for the clinical picture, different for each question.
- "rationale" explains the right answer and the mechanism in 2 to 4 sentences.
- Mix difficulty: about half 1, the rest 2 or 3.
${opts.avoid.length ? `Do not repeat these recent stems:\n${opts.avoid.map((s) => `- ${s}`).join("\n")}\n` : ""}
${RULES}

JSON shape: {"questions":[{"skill":"localization","difficulty":1,"presentation":"...","vignette":"...","stem":"...","options":[{"text":"...","correct":true},{"text":"...","correct":false,"feedback":"..."}],"rationale":"..."}]}`;
}

const noEmDash = (s: string) => s.replace(/\s*\u2014\s*/g, ", ");

/** Turn parsed model output into gradeable items, dropping any that break the rules. */
export function toGeneratedItems(raw: unknown, moduleId: string, batchId: string, today: string): { items: McqItem[]; dropped: number } {
  const list = raw && typeof raw === "object" && Array.isArray((raw as { questions?: unknown }).questions) ? ((raw as { questions: unknown[] }).questions.slice(0, 10)) : [];
  const items: McqItem[] = [];
  let dropped = 0;
  list.forEach((rawQ, i) => {
    const parsed = generatedQuestionSchema.safeParse(rawQ);
    if (!parsed.success) {
      dropped++;
      return;
    }
    const q = parsed.data;
    if (questionProblems(q)) {
      dropped++;
      return;
    }
    const id = `gen-${batchId}-${i + 1}`;
    items.push({
      id,
      version: 1,
      format: "mcq",
      skill: q.skill,
      modules: [moduleId],
      difficulty: q.difficulty,
      presentation: `gen:${q.presentation.toLowerCase().slice(0, 60)}`,
      family: id,
      usage: [],
      vignette: q.vignette ? noEmDash(q.vignette) : undefined,
      stem: noEmDash(q.stem),
      rationale: noEmDash(q.rationale),
      options: q.options.map((o, k) => ({ id: `o${k + 1}`, text: noEmDash(o.text), correct: o.correct || undefined, feedback: o.feedback ? noEmDash(o.feedback) : undefined })),
      meta: { id, version: 1, provenance: "synthetic", review: "pending", author: "ai-draft", sources: [], lastVerified: today, generated: true },
    });
  });
  return { items, dropped };
}

export function isGeneratedItem(i: Pick<AssessmentItem, "id">): boolean {
  return i.id.startsWith("gen-");
}

// ---------------------------------------------------------------------- cases

export type GeneratedCaseMode = "full" | "emergency" | "speed";

function catalog(investigationIds: string[]): string {
  return [
    `History intent ids (each history fact lists the intents that reveal it):\n${INTENTS.map((i) => `${i.id} (${i.ask})`).join("; ")}`,
    `Exam maneuver ids:\n${MANEUVERS.map((m) => `${m.id} (${m.label})`).join("; ")}`,
    `Investigation ids (use only these):\n${investigationIds.join(", ")}`,
    `Action ids (for urgentActions.satisfiedBy, harmfulActions, deteriorations.preventedBy; investigation ids are also allowed there):\n${ACTIONS.map((a) => `${a.id} (${a.label})`).join("; ")}`,
  ].join("\n\n");
}

export function casePrompt(brief: string, opts: { mode: GeneratedCaseMode; moduleId: string; difficulty: 1 | 2 | 3; investigationIds: string[]; sourceIds: string[]; example: CaseDef; avoid: string[] }): string {
  const modeText =
    opts.mode === "speed"
      ? `a two-request speed-round case: modes ["speed"], with a "speed" object (a 2 to 4 sentence presentation that does not name the diagnosis, 2 to 3 highYield ids of the most useful history intents, exam maneuvers or investigations, and an explanation). Keep history to the facts a speed round needs.`
      : opts.mode === "emergency"
        ? `an emergency case: modes ["emergency"], with time-critical urgentActions that have deadlineMin values, and at least one deterioration that happens if they are missed.`
        : `a full workup case: modes ["full"], with enough history, exam, and results to reason from symptoms to localization to diagnosis.`;
  return `You write synthetic neurology teaching cases for a patient-encounter simulator, as JSON matching the example's structure exactly.

${brief}

Write ${modeText}
Set: id "draft", version 1, difficulty ${opts.difficulty}, modules ["${opts.moduleId}"], provenance "synthetic", review "pending", sources ${JSON.stringify(opts.sourceIds)} (use exactly this list).
The label is "Practice: " plus a short complaint that does not name the diagnosis.

Hard requirements (a checker rejects the case otherwise):
- Patient dialogue ("say") is lay language and never names the diagnosis, exam findings, or test results.
- hidden.leakTerms lists the diagnosis and its synonyms and abbreviations.
- Every keyFindings entry is a history fact id, an exam maneuver id, or an investigation id that has a result.
- Every investigation in necessaryInvestigations or reasonableInvestigations has a result or appears in normalInvestigations. No investigation is in both lists, and none is both a result and in normalInvestigations.
- hidden.diagnosisLabel, read as an answer, matches one of hidden.diagnosis.full patterns. Patterns are short lowercase phrases a learner might type.
- Each interpretationChecks modelAnswer matches its own answer key, and refers to an investigation with a result.
- Use realistic values, units, and reference ranges.
- Make it a different patient and presentation from the example${opts.avoid.length ? ` and from these recent cases: ${opts.avoid.join("; ")}` : ""}.

${catalog(opts.investigationIds)}

${RULES}

Example of the exact structure (a different case):
${JSON.stringify(opts.example)}`;
}

export function caseRepairPrompt(original: string, draft: unknown, problems: string[]): string {
  return `${original}

Your previous draft failed these checks:
${problems.map((p) => `- ${p}`).join("\n")}

Previous draft:
${JSON.stringify(draft)}

Reply with the corrected case as JSON only.`;
}

const PROBES = [...INTENTS.map((i) => i.ask), "What is your diagnosis?", "What did the MRI show?", "What do you think is wrong with you?", "Tell me everything."];

/**
 * Check a generated case: schema, the same coherence checks authored cases pass, and that no
 * patient answer to any standard question leaks the diagnosis. Returns the case with a fresh id.
 */
export function checkGeneratedCase(raw: unknown, ctx: { id: string; moduleId: string; mode: GeneratedCaseMode; investigationIds: Set<string>; sourceIds: string[] }): { ok: true; case: CaseDef } | { ok: false; problems: string[] } {
  const parsed = caseSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, problems: parsed.error.issues.slice(0, 12).map((i) => `${i.path.join(".")}: ${i.message}`) };
  const c = {
    ...(parsed.data as CaseDef),
    // Always marked as practice, whatever prefix the model wrote.
    label: `Practice: ${parsed.data.label.replace(/^\s*(practice|case\s+\w+|speed\s+\w+)\s*:\s*/i, "").trim()}`,
    id: ctx.id,
    version: 1,
    modes: [ctx.mode],
    modules: [ctx.moduleId],
    provenance: "synthetic" as const,
    review: "pending" as const,
    sources: parsed.data.sources.filter((s) => ctx.sourceIds.includes(s)),
    generated: true,
  };
  const problems = validateCase(c, ctx.investigationIds)
    .filter((i: ValidationIssue) => i.severity === "error")
    .map((i) => i.message);
  if (ctx.mode === "speed" && !c.speed) problems.push("A speed case needs a speed object.");
  for (const q of PROBES) {
    const leak = containsLeak(answerQuestion(c, q).text, c.hidden.leakTerms);
    if (leak) {
      problems.push(`The patient's answer to "${q}" leaks "${leak}".`);
      break;
    }
  }
  return problems.length ? { ok: false, problems } : { ok: true, case: c };
}
