// Builds generation requests from course content, for the server and the hosted page.
// Lives under content/cases because it embeds a full example case (hidden state included),
// so only the server and the standalone build may import it.

import type { CaseDef, McqItem, SkillId } from "../../shared/types";
import { MODULE_BY_ID } from "../curriculum";
import { LESSON_BY_ID } from "../lessons";
import { INVESTIGATION_IDS } from "../investigationIds";
import { CASE_BY_ID } from "./index";
import { moduleBrief, questionPrompt, casePrompt, caseRepairPrompt, toGeneratedItems, checkGeneratedCase, type GeneratedCaseMode } from "../../shared/generate";

const INVESTIGATIONS = new Set<string>(INVESTIGATION_IDS);
const EXAMPLES: Record<GeneratedCaseMode, string> = { full: "n-cord-1", emergency: "n-cord-1", speed: "s-cts" };

export class GenerationError extends Error {
  constructor(message: string, public problems: string[] = []) {
    super(message);
  }
}

function context(moduleId: string) {
  const m = MODULE_BY_ID.get(moduleId);
  if (!m) throw new GenerationError("Unknown module.");
  const lessons = m.lessons.map((id) => LESSON_BY_ID.get(id)).filter((l) => !!l);
  const sourceIds = [...new Set([...m.meta.sources, ...lessons.flatMap((l) => l.meta.sources)])];
  return { m, brief: moduleBrief(m, lessons), sourceIds };
}

const today = () => new Date().toISOString().slice(0, 10);
const shortId = () => Math.random().toString(36).slice(2, 8);

/** A JSON-producing model call: the server passes its provider, the hosted page the viewer's account. */
export type AskJson = (prompt: string, kind: "questions" | "case") => Promise<unknown>;

export async function generateQuestions(ask: AskJson, req: { moduleId: string; count?: number; focusSkills?: SkillId[]; avoid?: string[] }): Promise<{ items: McqItem[]; dropped: number }> {
  const { brief } = context(req.moduleId);
  const count = Math.max(1, Math.min(8, req.count ?? 5));
  const raw = await ask(questionPrompt(brief, { count, focusSkills: req.focusSkills ?? [], avoid: (req.avoid ?? []).slice(-15) }), "questions");
  const out = toGeneratedItems(raw, req.moduleId, shortId(), today());
  if (!out.items.length) throw new GenerationError("The generated questions did not pass the checks. Try again.");
  return out;
}

/** Generate one case, check it, and allow one repair round with the checker's findings. */
export async function generateCase(ask: AskJson, req: { moduleId: string; mode: GeneratedCaseMode; difficulty?: 1 | 2 | 3; avoid?: string[] }): Promise<CaseDef> {
  const { brief, sourceIds } = context(req.moduleId);
  const example = CASE_BY_ID.get(EXAMPLES[req.mode])!;
  const prompt = casePrompt(brief, { mode: req.mode, moduleId: req.moduleId, difficulty: req.difficulty ?? 2, investigationIds: [...INVESTIGATIONS], sourceIds, example, avoid: (req.avoid ?? []).slice(-8) });
  const ctx = { id: `gen-case-${shortId()}`, moduleId: req.moduleId, mode: req.mode, investigationIds: INVESTIGATIONS, sourceIds };
  const first = await ask(prompt, "case");
  let checked = checkGeneratedCase(first, ctx);
  if (!checked.ok) {
    const second = await ask(caseRepairPrompt(prompt, first, checked.problems), "case");
    checked = checkGeneratedCase(second, ctx);
  }
  if (!checked.ok) throw new GenerationError("The generated case did not pass the consistency checks, so it was not used. Try again.", checked.problems);
  return checked.case;
}
