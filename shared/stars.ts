// Three meaningful stars per module. Earned stars are permanent achievements; current
// retention is tracked separately (scheduler.moduleRetention).
//
// Star 1: Understand and recognize. Two independent first-attempt correct answers on the
//         module's questions, not marked as guesses. Opening a lesson earns nothing.
// Star 2: Apply to a new case. After star 1, a correct first attempt on an application
//         item or patient case with a presentation not used for star 1.
// Star 3: Delayed retention and transfer. After star 2, a correct answer at least
//         STAR3_DELAY_DAYS later, on an item other than the one that earned star 2.

import type { Attempt, StarAward } from "./types";
import { DAY_MS } from "./clock";

export const STAR3_DELAY_DAYS = 3;

function firstAttempts(attempts: Attempt[]): Attempt[] {
  const seen = new Set<string>();
  const out: Attempt[] = [];
  for (const a of [...attempts].sort((x, y) => x.ts - y.ts)) {
    if (seen.has(a.itemId)) continue;
    seen.add(a.itemId);
    out.push(a);
  }
  return out;
}

export function evaluateStars(moduleId: string, attempts: Attempt[], existing: StarAward[]): StarAward[] {
  const mine = attempts.filter((a) => a.modules.includes(moduleId)).sort((a, b) => a.ts - b.ts);
  const have = new Map(existing.filter((s) => s.moduleId === moduleId).map((s) => [s.star, s]));
  const awards: StarAward[] = [];
  const firsts = firstAttempts(mine);

  // Star 1
  let star1 = have.get(1);
  if (!star1) {
    const families = new Set<string>();
    const ev: Attempt[] = [];
    for (const a of firsts) {
      if (a.score < 0.8 || a.confidence === "guess" || a.confidence === "idk" || a.hintsUsed > 1) continue;
      const fam = a.family ?? a.itemId;
      if (families.has(fam)) continue;
      families.add(fam);
      ev.push(a);
      if (ev.length >= 2) break;
    }
    if (ev.length >= 2) {
      star1 = {
        star: 1,
        moduleId,
        earnedAt: ev[1].ts,
        evidence: ev.map((a) => a.id),
        how: "Recognized core concepts on two independent questions at first attempt.",
      };
      awards.push(star1);
    }
  }

  // Star 2
  let star2 = have.get(2);
  if (star1 && !star2) {
    const star1Items = new Set(star1.evidence);
    const star1Pres = new Set(mine.filter((a) => star1Items.has(a.id)).map((a) => a.presentation));
    const app = firsts.find(
      (a) =>
        a.ts >= star1!.earnedAt &&
        !star1Items.has(a.id) &&
        a.score >= 0.7 &&
        a.confidence !== "guess" &&
        (a.context === "case" || (a.transfer && !star1Pres.has(a.presentation))),
    );
    if (app) {
      star2 = {
        star: 2,
        moduleId,
        earnedAt: app.ts,
        evidence: [app.id],
        how: app.context === "case" ? "Applied the concept in a patient encounter." : "Applied the concept to a new presentation.",
      };
      awards.push(star2);
    }
  }

  // Star 3
  if (star2 && !have.get(3)) {
    const star2Attempt = mine.find((a) => a.id === star2!.evidence[0]);
    const later = mine.find(
      (a) =>
        a.ts >= star2!.earnedAt + STAR3_DELAY_DAYS * DAY_MS &&
        a.score >= 0.8 &&
        a.confidence !== "guess" &&
        a.itemId !== star2Attempt?.itemId &&
        (a.context === "review" || a.context === "case" || a.context === "challenge" || a.context === "speed"),
    );
    if (later) {
      awards.push({
        star: 3,
        moduleId,
        earnedAt: later.ts,
        evidence: [later.id],
        how: `Recalled and applied it correctly at least ${STAR3_DELAY_DAYS} days later.`,
      });
    }
  }

  return awards;
}

export function starsFor(moduleId: string, stars: StarAward[]): StarAward[] {
  return stars.filter((s) => s.moduleId === moduleId).sort((a, b) => a.star - b.star);
}
