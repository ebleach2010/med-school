// Evidence-based mastery estimates.
//
// Each attempt contributes weighted success and failure evidence to a Beta(1,1) prior.
// Weights encode how informative the attempt is: a first attempt counts fully, repeating
// the same item counts little, hints and guesses reduce credit, and a self-reported slip
// counts less against the learner than "I don't know". Mastery requires several
// independent items AND at least two different presentations (transfer).

import type { Attempt, SkillId } from "./types";
import { DAY_MS } from "./clock";

export type MasteryStatus = "unassessed" | "gap" | "developing" | "uncertain" | "demonstrated";

export interface MasteryEstimate {
  mean: number;
  sd: number;
  /** Total effective evidence weight. */
  weight: number;
  independent: number;
  presentations: number;
  status: MasteryStatus;
  /** Attempt ids that contributed, newest first. */
  evidence: string[];
  /** Plain-language reason for the status. */
  why: string;
  /** Share of correct answers given with high confidence that were right. */
  calibration?: number;
}

export interface AttemptWeight {
  success: number;
  failure: number;
}

export function attemptWeight(a: Attempt, priorSameItem: number, priorSameFamily: number, nowTs: number): AttemptWeight {
  let w = 1;
  if (priorSameItem > 0) w = 0.25; // repeating the same question is weak evidence
  else if (priorSameFamily > 0) w = 0.5; // a variant of the same question
  if (a.hintsUsed > 0) w *= 0.6;
  // Gentle decay so old evidence does not dominate (half-life 180 days).
  const ageDays = Math.max(0, (nowTs - a.ts) / DAY_MS);
  w *= Math.pow(0.5, ageDays / 180);

  let success = a.score * w;
  let failure = (1 - a.score) * w;

  if (a.confidence === "guess" && a.score > 0) success *= 0.4;
  if (a.confidence === "think" && a.score > 0) success *= 0.85;
  if (a.confidence === "idk") failure = w;
  if (a.score < 1 && (a.selfReport === "slip" || a.tag === "slip")) failure *= 0.35;
  if (a.score < 1 && (a.selfReport === "mixed-terms" || a.tag === "terminology")) failure *= 0.6;
  return { success, failure };
}

export function estimate(attempts: Attempt[], nowTs: number): MasteryEstimate {
  const sorted = [...attempts].sort((a, b) => a.ts - b.ts);
  let alpha = 1;
  let beta = 1;
  const seenItems = new Map<string, number>();
  const seenFamilies = new Map<string, number>();
  const independentKeys = new Set<string>();
  const presentations = new Set<string>();
  let sureTotal = 0;
  let sureRight = 0;

  for (const a of sorted) {
    const famKey = a.family ?? a.itemId;
    const w = attemptWeight(a, seenItems.get(a.itemId) ?? 0, a.family ? seenFamilies.get(famKey) ?? 0 : 0, nowTs);
    alpha += w.success;
    beta += w.failure;
    if (!independentKeys.has(famKey)) {
      independentKeys.add(famKey);
      if (a.score >= 0.8) presentations.add(a.presentation);
    }
    seenItems.set(a.itemId, (seenItems.get(a.itemId) ?? 0) + 1);
    seenFamilies.set(famKey, (seenFamilies.get(famKey) ?? 0) + 1);
    if (a.confidence === "sure") {
      sureTotal++;
      if (a.score >= 0.8) sureRight++;
    }
  }

  const n = alpha + beta;
  const mean = alpha / n;
  const sd = Math.sqrt((alpha * beta) / (n * n * (n + 1)));
  const weight = n - 2;
  const independent = independentKeys.size;
  const evidence = sorted.map((a) => a.id).reverse();

  let status: MasteryStatus;
  let why: string;
  if (!attempts.length) {
    status = "unassessed";
    why = "No evidence yet.";
  } else if (mean >= 0.75 && mean - sd >= 0.6 && independent >= 3 && presentations.size >= 2) {
    status = "demonstrated";
    why = `Correct on ${independent} independent items across ${presentations.size} different presentations.`;
  } else if (mean <= 0.4 && weight >= 1.5) {
    status = "gap";
    why = `Most of the ${independent} item${independent === 1 ? "" : "s"} seen were missed or marked "I don't know".`;
  } else if (weight < 2 || independent < 2) {
    status = "uncertain";
    why = "Not enough independent evidence to judge. One answer is never treated as mastery.";
  } else if (mean >= 0.7 && presentations.size < 2) {
    status = "uncertain";
    why = "Correct so far, but only on one kind of presentation. A transfer case is needed.";
  } else {
    status = "developing";
    why = `Mixed results across ${independent} items.`;
  }

  return {
    mean,
    sd,
    weight,
    independent,
    presentations: presentations.size,
    status,
    evidence,
    why,
    calibration: sureTotal ? sureRight / sureTotal : undefined,
  };
}

export function bySkill(attempts: Attempt[], nowTs: number, filter?: (a: Attempt) => boolean): Record<SkillId, MasteryEstimate> {
  const out = {} as Record<SkillId, MasteryEstimate>;
  const groups = new Map<SkillId, Attempt[]>();
  for (const a of attempts) {
    if (filter && !filter(a)) continue;
    if (!groups.has(a.skill)) groups.set(a.skill, []);
    groups.get(a.skill)!.push(a);
  }
  for (const skill of [
    "terminology",
    "localization",
    "mechanism",
    "history-exam",
    "differential",
    "investigation-selection",
    "interpretation",
    "emergency",
    "uncertainty",
  ] as SkillId[]) {
    out[skill] = estimate(groups.get(skill) ?? [], nowTs);
  }
  return out;
}

export function byModule(attempts: Attempt[], moduleId: string, nowTs: number): MasteryEstimate {
  return estimate(
    attempts.filter((a) => a.modules.includes(moduleId)),
    nowTs,
  );
}

/** Summaries of error patterns for the Progress view. */
export function errorPatterns(attempts: Attempt[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const a of attempts) {
    if (a.score >= 0.8) continue;
    const tag = a.selfReport === "slip" ? "slip" : a.selfReport === "mixed-terms" ? "terminology" : a.tag ?? "knowledge-gap";
    counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count);
}

/**
 * Heuristic: a wrong answer is a probable slip if the learner was confident, has strong
 * evidence on the same skill otherwise, and the answer was fast. The learner can override.
 */
export function suggestSlip(a: Pick<Attempt, "confidence" | "durationMs" | "score">, skillEstimate: MasteryEstimate): boolean {
  return a.score < 0.8 && a.confidence === "sure" && skillEstimate.mean >= 0.75 && skillEstimate.independent >= 3 && a.durationMs < 12000;
}
