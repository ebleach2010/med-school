// Adaptive placement assessment.
//
// Phase 1 (screen): a short fixed block, one item per ability.
// Phase 2 (branch): keep sampling abilities whose estimate is uncertain, preferring a
// presentation the learner has not seen yet for that ability (transfer) and adjusting
// difficulty to the last answer. Stops when every ability is classified, the item bank
// runs out, or the length cap is hit. The learner can stop at any time and resume later.

import type { AssessmentItem, Attempt, Module, PlacementState, SkillId } from "./types";
import { SKILLS } from "./types";
import { bySkill, estimate, type MasteryEstimate } from "./mastery";

export const PLACEMENT_MAX_ITEMS = 30;

export interface NextPick {
  itemId: string;
  phase: "screen" | "branch";
  reason: string;
}

export function nextPlacementItem(
  state: PlacementState,
  placementAttempts: Attempt[],
  bank: AssessmentItem[],
  screenIds: string[],
  nowTs: number,
  maxItems = PLACEMENT_MAX_ITEMS,
): NextPick | null {
  const answered = new Set(state.answered);
  if (answered.size >= maxItems) return null;

  const screenNext = screenIds.find((id) => !answered.has(id));
  if (screenNext) return { itemId: screenNext, phase: "screen", reason: "Screening block: one question per ability." };

  const skills = bySkill(placementAttempts, nowTs);
  const pool = bank.filter((i) => i.usage.includes("placement") && !answered.has(i.id));
  const candidates = SKILLS.filter((s) => {
    const st = skills[s].status;
    return (st === "uncertain" || st === "developing" || st === "unassessed") && pool.some((i) => i.skill === s);
  });
  if (!candidates.length) return null;

  // Ability with the least evidence first.
  candidates.sort((a, b) => skills[a].weight - skills[b].weight);
  const skill = candidates[0];
  const mine = placementAttempts.filter((a) => a.skill === skill).sort((a, b) => a.ts - b.ts);
  const seenPres = new Set(mine.map((a) => a.presentation));
  const seenFam = new Set(mine.map((a) => a.family ?? a.itemId));
  const last = mine[mine.length - 1];
  const lastItem = last ? bank.find((i) => i.id === last.itemId) : undefined;
  const target = !lastItem ? 2 : last.score >= 0.8 ? Math.min(3, lastItem.difficulty + 1) : Math.max(1, lastItem.difficulty - 1);

  const options = pool.filter((i) => i.skill === skill && !seenFam.has(i.family ?? i.id));
  const ranked = (options.length ? options : pool.filter((i) => i.skill === skill)).sort((a, b) => {
    const pa = seenPres.has(a.presentation) ? 1 : 0;
    const pb = seenPres.has(b.presentation) ? 1 : 0;
    if (pa !== pb) return pa - pb;
    const da = Math.abs(a.difficulty - target);
    const db = Math.abs(b.difficulty - target);
    if (da !== db) return da - db;
    return a.id.localeCompare(b.id);
  });
  const pick = ranked[0];
  if (!pick) return null;
  const transfer = !seenPres.has(pick.presentation) && mine.length > 0;
  return {
    itemId: pick.id,
    phase: "branch",
    reason: transfer
      ? "Checking whether this ability transfers to a different presentation."
      : "Gathering more evidence where your estimate is still uncertain.",
  };
}

export type ModuleVerdict = "test-out" | "gap" | "needs-assessment" | "unassessed";

export interface PlacementReport {
  skills: Record<SkillId, MasteryEstimate>;
  strengths: SkillId[];
  gaps: SkillId[];
  needsMore: SkillId[];
  modules: { moduleId: string; verdict: ModuleVerdict; estimate: MasteryEstimate; why: string }[];
  itemsAnswered: number;
  idkCount: number;
}

export function moduleVerdict(moduleAttempts: Attempt[], nowTs: number): { verdict: ModuleVerdict; estimate: MasteryEstimate; why: string } {
  const est = estimate(moduleAttempts, nowTs);
  if (!moduleAttempts.length) return { verdict: "unassessed", estimate: est, why: "Not sampled during placement." };
  const firsts = new Map<string, Attempt>();
  for (const a of [...moduleAttempts].sort((x, y) => x.ts - y.ts)) if (!firsts.has(a.itemId)) firsts.set(a.itemId, a);
  const list = [...firsts.values()];
  const families = new Set(list.map((a) => a.family ?? a.itemId));
  const allSolid = list.every((a) => a.score >= 0.8 && a.confidence !== "guess" && a.confidence !== "idk");
  const hasTransfer = list.some((a) => a.transfer && a.score >= 0.8);
  if (families.size >= 2 && allSolid && hasTransfer) {
    return { verdict: "test-out", estimate: est, why: `All ${families.size} independent items correct, including an application question.` };
  }
  if (est.mean <= 0.45 && est.weight >= 1) {
    return { verdict: "gap", estimate: est, why: "Missed or unknown on the items sampled." };
  }
  return { verdict: "needs-assessment", estimate: est, why: families.size < 2 ? "Only one item sampled." : "Mixed or low-confidence answers." };
}

export function placementReport(placementAttempts: Attempt[], modules: Module[], nowTs: number): PlacementReport {
  const skills = bySkill(placementAttempts, nowTs);
  const strengths = SKILLS.filter((s) => skills[s].status === "demonstrated");
  const gaps = SKILLS.filter((s) => skills[s].status === "gap");
  const needsMore = SKILLS.filter((s) => ["uncertain", "developing", "unassessed"].includes(skills[s].status));
  const mods = modules
    .filter((m) => m.status !== "planned")
    .map((m) => ({ moduleId: m.id, ...moduleVerdict(placementAttempts.filter((a) => a.modules.includes(m.id)), nowTs) }));
  return {
    skills,
    strengths,
    gaps,
    needsMore,
    modules: mods,
    itemsAnswered: new Set(placementAttempts.map((a) => a.itemId)).size,
    idkCount: placementAttempts.filter((a) => a.confidence === "idk").length,
  };
}
