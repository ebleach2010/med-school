// Encounter grading. Diagnosis, reasoning, actions, investigations, interpretation, and
// localization are scored separately. Speed (simulated or real time) is reported but never
// part of the score. Unnecessary investigations can only lower the investigation score.

import type { AnswerKey, CaseDef } from "../shared/types";
import { gradeFreeText, matchConcept, type FreeTextGrade } from "../shared/text";
import { ACTION_BY_ID } from "../shared/actions";
import { INVESTIGATION_BY_ID } from "../content/investigations";
import type { EncounterState, Submission } from "./encounter";
import { revealedIds } from "./encounter";

export type Dimension = "diagnosis" | "localization" | "reasoning" | "actions" | "investigations" | "interpretation";

export interface DimensionResult {
  score: number;
  weight: number;
  summary: string;
  details: string[];
}

export interface EncounterGrade {
  overall: number;
  dimensions: Record<Dimension, DimensionResult>;
  diagnosisVerdict: FreeTextGrade["verdict"];
  debrief: {
    diagnosisLabel: string;
    endpoint: CaseDef["hidden"]["endpoint"];
    localization: string;
    teachingPoints: string[];
    keyFindings: { id: string; text: string; discovered: boolean; cited: boolean }[];
    mustConsider: { label: string; why: string; considered: boolean }[];
    urgent: { label: string; met: boolean; at?: number; deadline?: number; why: string; consequence: string }[];
    harmful: { label: string; why: string }[];
    investigations: { id: string; name: string; category: "necessary" | "reasonable" | "unnecessary"; ordered: boolean }[];
    interpretation: { question: string; answer: string; modelAnswer: string; score: number; feedback: string }[];
    results: { investigation: string; name: string; interpretation: string }[];
    speedExplanation?: string;
    highYield?: string[];
    provenance: CaseDef["provenance"];
    sources: string[];
    modules: string[];
  };
  simMinutes: number;
  fastForwardMinutes: number;
  /** Notes on how the grade was produced, for transparency. */
  notes: string[];
}

function textFor(c: CaseDef, id: string): string {
  const h = c.history.find((x) => x.id === id);
  if (h) return h.finding;
  const e = c.exam.find((x) => x.maneuver === id);
  if (e) return e.finding;
  const r = c.results.find((x) => x.investigation === id);
  if (r) return `${INVESTIGATION_BY_ID.get(id)?.name ?? id}: ${r.summary}`;
  return id;
}

function anyMatch(texts: string[], concept: { patterns: string[]; id: string; label: string }): boolean {
  return texts.some((t) => matchConcept(t, concept).matched);
}

export function gradeDiagnosis(c: CaseDef, sub: Submission): { result: DimensionResult; verdict: FreeTextGrade["verdict"]; notes: string[] } {
  const h = c.hidden;
  const notes: string[] = [];
  if (sub.skipped) {
    return { result: { score: 0, weight: 0.3, summary: "Skipped.", details: [`The answer: ${h.diagnosisLabel}.`] }, verdict: "blank", notes };
  }
  const g = gradeFreeText(sub.diagnosis, h.diagnosis);
  const details = [g.feedback];
  let score = g.score;

  if (h.endpoint === "further-evaluation") {
    const forced = sub.endpoint === "diagnosis";
    const chose = sub.endpoint === "further-evaluation" || sub.endpoint === "syndrome";
    const next = (h.acceptableNextSteps ?? []).filter((n) => matchConcept(`${sub.nextSteps} ${sub.diagnosis}`, n).matched);
    score = (chose ? 0.5 : 0) + Math.min(0.5, next.length * 0.25) + (g.score >= 0.8 ? 0.25 : 0);
    score = Math.min(1, score);
    if (!chose) details.push("The evidence here does not establish a specific diagnosis. The expected endpoint was further evaluation.");
    if (forced) details.push("Committing to a specific diagnosis is not supported by the available evidence.");
    if (next.length) details.push(`Appropriate next steps named: ${next.map((n) => n.label).join(", ")}.`);
    else details.push(`Expected next steps include: ${(h.acceptableNextSteps ?? []).map((n) => n.label).join(", ")}.`);
  } else if (h.endpoint === "ranked-differential" || h.endpoint === "syndrome") {
    const req = h.rankedRequired ?? [];
    if (req.length) {
      const listed = req.filter((r) => anyMatch(sub.differential.slice(0, 5), r) || matchConcept(sub.diagnosis, r).matched);
      const cover = listed.length / req.length;
      score = 0.6 * g.score + 0.4 * cover;
      details.push(`Your differential included ${listed.length} of ${req.length} required considerations (${req.map((r) => r.label).join(", ")}).`);
    }
    if (g.verdict === "overly-specific") details.push("Naming a specific cause goes beyond what the evidence establishes here.");
  }
  return {
    result: { score, weight: 0.3, summary: g.verdict === "correct" ? "Correct." : g.verdict === "partial" ? "Partly correct." : g.verdict === "overly-specific" ? "More specific than the evidence supports." : "Not correct.", details },
    verdict: g.verdict,
    notes,
  };
}

export function gradeEncounter(c: CaseDef, s: EncounterState, sub: Submission, interpretAnswers: Record<string, string>): EncounterGrade {
  const h = c.hidden;
  const notes: string[] = ["Graded by the rule-based rubric for this case. Spelling, abbreviations, and synonyms are accepted."];
  const revealed = new Set(revealedIds(s));
  const isSpeed = s.mode === "speed";

  // Diagnosis
  const dx = gradeDiagnosis(c, sub);

  // Localization
  let loc: DimensionResult;
  if (isSpeed || !sub.localization) {
    loc = { score: isSpeed ? 0 : 0, weight: isSpeed ? 0 : 0.05, summary: isSpeed ? "Not assessed in speed rounds." : "No localization given.", details: [h.localization.explanation] };
  } else {
    const ok = h.localization.regions.includes(sub.localization as never);
    loc = { score: ok ? 1 : 0, weight: 0.05, summary: ok ? "Correct localization." : "Localization not correct.", details: [h.localization.explanation] };
  }

  // Reasoning: discovery of key findings, citing them, and considering must-not-miss alternatives.
  const keyList = h.keyFindings.map((id) => ({ id, text: textFor(c, id), discovered: revealed.has(id), cited: sub.keyFindings.includes(id) }));
  const discovered = keyList.length ? keyList.filter((k) => k.discovered).length / keyList.length : 1;
  const cited = keyList.length ? keyList.filter((k) => k.cited).length / keyList.length : 1;
  const ddxTexts = [...sub.differential, ...s.ddx.map((d) => d.label), sub.diagnosis];
  const mc = h.mustConsider.map((m) => ({ label: m.concept.label, why: m.why, considered: anyMatch(ddxTexts, m.concept) }));
  const mcScore = mc.length ? mc.filter((m) => m.considered).length / mc.length : 1;
  const reasoningScore = isSpeed ? 0 : 0.4 * discovered + 0.3 * cited + 0.3 * mcScore;
  const reasoning: DimensionResult = {
    score: reasoningScore,
    weight: isSpeed ? 0 : 0.2,
    summary: isSpeed ? "Not assessed in speed rounds." : `Found ${Math.round(discovered * 100)}% of key findings, cited ${Math.round(cited * 100)}%, considered ${Math.round(mcScore * 100)}% of must-consider alternatives.`,
    details: [
      ...keyList.filter((k) => !k.discovered).map((k) => `Not elicited: ${k.text}`),
      ...mc.filter((m) => !m.considered).map((m) => `Not considered: ${m.label} (${m.why})`),
    ],
  };

  // Actions: urgent actions on time; harmful actions penalized.
  const urgent = h.urgentActions.map((u) => {
    const times = [...s.actions.filter((a) => u.satisfiedBy.includes(a.id)).map((a) => a.at), ...s.orders.filter((o) => u.satisfiedBy.includes(o.inv)).map((o) => o.at)];
    const at = times.length ? Math.min(...times) : undefined;
    return { label: u.label, met: at !== undefined, at, deadline: u.deadlineMin, why: u.why, consequence: u.consequence, onTime: at !== undefined && (u.deadlineMin === undefined || at <= u.deadlineMin) };
  });
  const harmfulDone = h.harmfulActions.filter((ha) => s.actions.some((a) => a.id === ha.id) || s.orders.some((o) => o.inv === ha.id));
  let actionsScore = urgent.length ? urgent.reduce((t, u) => t + (u.onTime ? 1 : u.met ? 0.5 : 0), 0) / urgent.length : 1;
  actionsScore = Math.max(0, actionsScore - 0.34 * harmfulDone.length);
  const actionsWeight = isSpeed ? 0 : urgent.length || harmfulDone.length ? 0.2 : 0.05;
  const actions: DimensionResult = {
    score: actionsScore,
    weight: actionsWeight,
    summary: urgent.length ? `${urgent.filter((u) => u.onTime).length} of ${urgent.length} urgent actions on time.` : "No time-critical actions in this case.",
    details: [
      ...urgent.filter((u) => !u.onTime).map((u) => (u.met ? `Late: ${u.label} at minute ${u.at} (target by ${u.deadline}). ${u.consequence}` : `Missed: ${u.label}. ${u.consequence}`)),
      ...harmfulDone.map((ha) => `Potentially harmful: ${ACTION_BY_ID.get(ha.id)?.label ?? INVESTIGATION_BY_ID.get(ha.id)?.name ?? ha.id}. ${ha.why}`),
    ],
  };

  // Investigations
  const orderedIds = s.orders.map((o) => o.inv);
  const necessary = h.necessaryInvestigations;
  const reasonable = h.reasonableInvestigations;
  const unnecessary = orderedIds.filter((id) => !necessary.includes(id) && !reasonable.includes(id) && !h.harmfulActions.some((x) => x.id === id));
  const necessaryHit = necessary.filter((id) => orderedIds.includes(id)).length;
  const invScore = isSpeed ? 0 : Math.max(0, Math.min(1, (necessary.length ? necessaryHit / necessary.length : 1) - 0.1 * unnecessary.length));
  const investigations: DimensionResult = {
    score: invScore,
    weight: isSpeed ? 0 : 0.15,
    summary: isSpeed ? "Not assessed in speed rounds." : `${necessaryHit} of ${necessary.length} necessary investigations ordered; ${unnecessary.length} not indicated.`,
    details: [
      ...necessary.filter((id) => !orderedIds.includes(id)).map((id) => `Missed: ${INVESTIGATION_BY_ID.get(id)?.name ?? id}`),
      ...unnecessary.map((id) => `Not indicated here: ${INVESTIGATION_BY_ID.get(id)?.name ?? id}. Extra tests do not raise the score and can lower it.`),
    ],
  };

  // Interpretation
  const interp = h.interpretationChecks.map((ic) => {
    const ans = interpretAnswers[ic.id] ?? "";
    const g = gradeFreeText(ans, ic.answer as AnswerKey);
    return { question: ic.question, answer: ans, modelAnswer: ic.modelAnswer, score: g.score, feedback: g.feedback };
  });
  const interpScore = interp.length ? interp.reduce((t, x) => t + x.score, 0) / interp.length : 0;
  const interpretation: DimensionResult = {
    score: interpScore,
    weight: isSpeed || !interp.length ? 0 : 0.1,
    summary: interp.length ? `${interp.filter((x) => x.score >= 0.8).length} of ${interp.length} interpretation questions correct.` : "No interpretation questions in this case.",
    details: interp.filter((x) => x.score < 0.8).map((x) => `${x.question} Model answer: ${x.modelAnswer}`),
  };

  if (isSpeed) dx.result.weight = 1;
  const dims: Record<Dimension, DimensionResult> = { diagnosis: dx.result, localization: loc, reasoning, actions, investigations, interpretation };
  const totalW = Object.values(dims).reduce((t, d) => t + d.weight, 0);
  const overall = totalW ? Object.values(dims).reduce((t, d) => t + d.score * d.weight, 0) / totalW : 0;

  const allInv = [...new Set([...necessary, ...reasonable, ...orderedIds])];
  return {
    overall,
    dimensions: dims,
    diagnosisVerdict: dx.verdict,
    debrief: {
      diagnosisLabel: h.diagnosisLabel,
      endpoint: h.endpoint,
      localization: h.localization.explanation,
      teachingPoints: h.teachingPoints,
      keyFindings: keyList,
      mustConsider: mc,
      urgent: urgent.map(({ onTime: _onTime, ...u }) => u),
      harmful: harmfulDone.map((ha) => ({ label: ACTION_BY_ID.get(ha.id)?.label ?? INVESTIGATION_BY_ID.get(ha.id)?.name ?? ha.id, why: ha.why })),
      investigations: allInv.map((id) => ({
        id,
        name: INVESTIGATION_BY_ID.get(id)?.name ?? id,
        category: necessary.includes(id) ? "necessary" : reasonable.includes(id) ? "reasonable" : "unnecessary",
        ordered: orderedIds.includes(id),
      })),
      interpretation: interp,
      results: c.results.map((r) => ({ investigation: r.investigation, name: INVESTIGATION_BY_ID.get(r.investigation)?.name ?? r.investigation, interpretation: r.interpretation })),
      speedExplanation: isSpeed ? c.speed?.explanation : undefined,
      highYield: isSpeed ? c.speed?.highYield : undefined,
      provenance: c.provenance,
      sources: c.sources,
      modules: c.modules,
    },
    simMinutes: s.simMinutes,
    fastForwardMinutes: s.fastForwardMinutes,
    notes,
  };
}
