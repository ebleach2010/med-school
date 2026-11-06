import type { EncounterMode, SkillId } from "../../shared/types";
import type { AttemptInput } from "../../shared/learner";
import type { EncounterGrade } from "./encounterTypes";

const DIM_SKILL: Record<string, SkillId> = {
  diagnosis: "differential",
  reasoning: "history-exam",
  actions: "emergency",
  investigations: "investigation-selection",
  interpretation: "interpretation",
  localization: "localization",
};

/** Turn a graded encounter into learner evidence: one attempt per scored dimension. */
export function gradeToAttempts(caseId: string, g: EncounterGrade, mode: EncounterMode): AttemptInput[] {
  const out: AttemptInput[] = [];
  for (const [dim, r] of Object.entries(g.dimensions)) {
    if (r.weight <= 0) continue;
    out.push({
      item: { id: `${caseId}:${dim}`, version: 1, skill: DIM_SKILL[dim], modules: g.debrief.modules, presentation: caseId, family: `${caseId}:${dim}`, difficulty: 2, usage: [] },
      grade: { score: r.score, answerSummary: r.summary, keySummary: dim === "diagnosis" ? g.debrief.diagnosisLabel : r.summary },
      context: mode === "speed" ? "speed" : "case",
      confidence: "think",
      durationMs: 0,
      transfer: true,
    });
  }
  return out;
}
