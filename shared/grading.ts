// Grading for assessment items. Pure functions, shared by client and server.

import type { AssessmentItem, ErrorTag, NeuraxisRegion, SelectTestsItem } from "./types";
import { gradeFreeText, stripMarkup } from "./text";

export type ItemResponse =
  | { kind: "idk" }
  | { kind: "mcq"; optionId: string; reasoningOptionId?: string }
  | { kind: "multi-select"; optionIds: string[] }
  | { kind: "free-text"; text: string }
  | { kind: "localization"; region: NeuraxisRegion }
  | { kind: "select-tests"; optionIds: string[] }
  | { kind: "order-priority"; order: string[] };

export interface ItemGrade {
  score: number;
  correct: boolean;
  verdict: "correct" | "partial" | "incorrect" | "idk" | "overly-specific";
  feedback: string;
  tag?: ErrorTag;
  answerSummary: string;
  keySummary: string;
  /** For select-tests: per option outcome, so the UI can explain each choice. */
  breakdown?: { id: string; label: string; outcome: "hit" | "missed" | "penalty" | "neutral"; why: string }[];
}

export const REGION_LABELS: Record<NeuraxisRegion, string> = {
  "cortex-left": "Left cerebral cortex",
  "cortex-right": "Right cerebral cortex",
  "subcortical-left": "Left subcortical (internal capsule, basal ganglia, thalamus)",
  "subcortical-right": "Right subcortical (internal capsule, basal ganglia, thalamus)",
  midbrain: "Midbrain",
  pons: "Pons",
  medulla: "Medulla",
  cerebellum: "Cerebellum",
  "cord-cervical": "Cervical spinal cord",
  "cord-thoracic": "Thoracic spinal cord",
  "cord-lumbosacral": "Lumbosacral cord and conus",
  "anterior-horn": "Anterior horn cell",
  root: "Nerve root",
  plexus: "Plexus",
  "peripheral-nerve": "Peripheral nerve",
  nmj: "Neuromuscular junction",
  muscle: "Muscle",
};

export function correctKeySummary(item: AssessmentItem): string {
  switch (item.format) {
    case "mcq":
      return item.options.filter((o) => o.correct).map((o) => stripMarkup(o.text)).join("; ");
    case "multi-select":
      return item.options.filter((o) => o.correct).map((o) => stripMarkup(o.text)).join("; ");
    case "free-text":
      return item.modelAnswer;
    case "localization":
      return item.correct.map((r) => REGION_LABELS[r]).join(" or ");
    case "select-tests":
      return item.options.filter((o) => o.category === "necessary").map((o) => o.label).join("; ");
    case "order-priority":
      return item.order
        .map((group) => group.map((id) => item.steps.find((s) => s.id === id)?.text ?? id).join(" + "))
        .join(" → ");
  }
}

function gradeSelectTests(item: SelectTestsItem, chosen: string[]) {
  const necessary = item.options.filter((o) => o.category === "necessary");
  const hits = necessary.filter((o) => chosen.includes(o.id)).length;
  const unnecessary = item.options.filter((o) => o.category === "unnecessary" && chosen.includes(o.id)).length;
  const harmful = item.options.filter((o) => o.category === "harmful" && chosen.includes(o.id)).length;
  // Unnecessary tests can only lower the score; they never add credit.
  const raw = (necessary.length ? hits / necessary.length : 1) - 0.15 * unnecessary - 0.35 * harmful;
  const score = Math.max(0, Math.min(1, raw));
  const breakdown = item.options.map((o) => {
    const picked = chosen.includes(o.id);
    let outcome: "hit" | "missed" | "penalty" | "neutral" = "neutral";
    if (o.category === "necessary") outcome = picked ? "hit" : "missed";
    else if ((o.category === "unnecessary" || o.category === "harmful") && picked) outcome = "penalty";
    return { id: o.id, label: o.label, outcome, why: o.why };
  });
  return { score, hits, necessary: necessary.length, unnecessary, harmful, breakdown };
}

/** Compare an ordering with grouped expected order. Returns fraction of pairwise orderings respected. */
export function orderScore(expected: string[][], given: string[]): number {
  const rank = new Map<string, number>();
  expected.forEach((g, i) => g.forEach((id) => rank.set(id, i)));
  let pairs = 0;
  let good = 0;
  for (let i = 0; i < given.length; i++) {
    for (let j = i + 1; j < given.length; j++) {
      const ri = rank.get(given[i]);
      const rj = rank.get(given[j]);
      if (ri === undefined || rj === undefined || ri === rj) continue;
      pairs++;
      if (ri < rj) good++;
    }
  }
  return pairs ? good / pairs : 1;
}

export function gradeItem(item: AssessmentItem, response: ItemResponse): ItemGrade {
  const keySummary = correctKeySummary(item);
  if (response.kind === "idk") {
    return {
      score: 0,
      correct: false,
      verdict: "idk",
      feedback: "No problem. Marked as something to learn.",
      tag: "knowledge-gap",
      answerSummary: "I don't know",
      keySummary,
    };
  }

  switch (item.format) {
    case "mcq": {
      if (response.kind !== "mcq") break;
      const opt = item.options.find((o) => o.id === response.optionId);
      if (!opt) break;
      let score = opt.correct ? 1 : 0;
      let tag: ErrorTag | undefined = opt.correct ? undefined : opt.tag ?? "knowledge-gap";
      let feedback = opt.feedback ?? (opt.correct ? "Correct." : "Not this one.");
      if (item.reasoning && opt.correct) {
        const r = item.reasoning.options.find((o) => o.id === response.reasoningOptionId);
        if (r && !r.correct) {
          // Right answer, weak supporting reason.
          score = 0.6;
          tag = "weak-reasoning";
          feedback += ` Your answer was right, but the supporting finding you chose is not the strongest discriminator. ${r.feedback ?? ""}`;
        }
      }
      return {
        score,
        correct: score >= 0.8,
        verdict: score >= 0.8 ? "correct" : score > 0 ? "partial" : "incorrect",
        feedback,
        tag,
        answerSummary: stripMarkup(opt.text),
        keySummary,
      };
    }
    case "multi-select": {
      if (response.kind !== "multi-select") break;
      const correctIds = item.options.filter((o) => o.correct).map((o) => o.id);
      const hits = response.optionIds.filter((id) => correctIds.includes(id)).length;
      const wrong = response.optionIds.filter((id) => !correctIds.includes(id)).length;
      const score = Math.max(0, (hits - wrong * 0.5) / correctIds.length);
      const wrongOpt = item.options.find((o) => response.optionIds.includes(o.id) && !o.correct);
      return {
        score,
        correct: score >= 0.8,
        verdict: score >= 0.8 ? "correct" : score > 0 ? "partial" : "incorrect",
        feedback:
          score >= 0.8
            ? "Correct selection."
            : `You selected ${hits} of ${correctIds.length} correct options${wrong ? ` and ${wrong} that do not apply` : ""}.${wrongOpt?.feedback ? " " + wrongOpt.feedback : ""}`,
        tag: score >= 0.8 ? undefined : wrongOpt?.tag ?? "incomplete",
        answerSummary: item.options.filter((o) => response.optionIds.includes(o.id)).map((o) => stripMarkup(o.text)).join("; ") || "(none)",
        keySummary,
      };
    }
    case "free-text": {
      if (response.kind !== "free-text") break;
      const g = gradeFreeText(response.text, item.answer);
      return {
        score: g.score,
        correct: g.score >= 0.8,
        verdict: g.verdict === "blank" ? "incorrect" : g.verdict === "overly-specific" ? "overly-specific" : g.verdict,
        feedback: g.feedback,
        tag: g.tag,
        answerSummary: response.text.slice(0, 200),
        keySummary,
      };
    }
    case "localization": {
      if (response.kind !== "localization") break;
      if (item.correct.includes(response.region)) {
        return { score: 1, correct: true, verdict: "correct", feedback: "Correct localization.", answerSummary: REGION_LABELS[response.region], keySummary };
      }
      const p = item.partial?.find((x) => x.region === response.region);
      if (p) {
        return { score: p.credit, correct: p.credit >= 0.8, verdict: "partial", feedback: p.feedback, tag: "incomplete", answerSummary: REGION_LABELS[response.region], keySummary };
      }
      return {
        score: 0,
        correct: false,
        verdict: "incorrect",
        feedback: `The findings point to: ${keySummary}.`,
        tag: "misconception",
        answerSummary: REGION_LABELS[response.region],
        keySummary,
      };
    }
    case "select-tests": {
      if (response.kind !== "select-tests") break;
      const r = gradeSelectTests(item, response.optionIds);
      const parts = [`You chose ${r.hits} of ${r.necessary} necessary investigations.`];
      if (r.unnecessary) parts.push(`${r.unnecessary} unnecessary choice${r.unnecessary > 1 ? "s" : ""} lowered the score.`);
      if (r.harmful) parts.push(`${r.harmful} choice${r.harmful > 1 ? "s were" : " was"} potentially harmful or delaying.`);
      return {
        score: r.score,
        correct: r.score >= 0.8,
        verdict: r.score >= 0.8 ? "correct" : r.score > 0 ? "partial" : "incorrect",
        feedback: parts.join(" "),
        tag: r.harmful ? "unsafe-priority" : r.score >= 0.8 ? undefined : "incomplete",
        answerSummary: item.options.filter((o) => response.optionIds.includes(o.id)).map((o) => o.label).join("; ") || "(none)",
        keySummary,
        breakdown: r.breakdown,
      };
    }
    case "order-priority": {
      if (response.kind !== "order-priority") break;
      const s = orderScore(item.order, response.order);
      const firstExpected = item.order[0];
      const firstOk = firstExpected.includes(response.order[0]);
      const score = firstOk ? s : Math.min(s, 0.5);
      return {
        score,
        correct: score >= 0.8,
        verdict: score >= 0.8 ? "correct" : score > 0.3 ? "partial" : "incorrect",
        feedback: firstOk
          ? score >= 0.8
            ? "Good prioritization."
            : "The first step is right, but later steps are out of order."
          : "The first priority is not right. In time-critical care the first step matters most.",
        tag: score >= 0.8 ? undefined : "unsafe-priority",
        answerSummary: response.order.map((id) => item.steps.find((x) => x.id === id)?.text ?? id).join(" → "),
        keySummary,
      };
    }
  }
  throw new Error(`Response kind ${response.kind} does not fit item format ${item.format}`);
}
