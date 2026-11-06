// Internal consistency checks for case definitions. Run on every authored case at test
// time and on every AI-generated case before it can even be stored as a draft.

import type { CaseDef } from "./types";
import { INTENT_BY_ID, containsLeak } from "./dialogue";
import { MANEUVER_BY_ID } from "./exam";
import { ACTION_BY_ID } from "./actions";
import { gradeFreeText } from "./text";

export interface ValidationIssue {
  caseId: string;
  severity: "error" | "warning";
  message: string;
}

export function validateCase(c: CaseDef, investigationIds: Set<string>): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const err = (message: string) => issues.push({ caseId: c.id, severity: "error", message });
  const warn = (message: string) => issues.push({ caseId: c.id, severity: "warning", message });

  const factIds = new Set<string>();
  for (const f of c.history) {
    if (factIds.has(f.id)) err(`Duplicate history fact id ${f.id}`);
    factIds.add(f.id);
    for (const i of f.intents) if (!INTENT_BY_ID.has(i)) err(`History fact ${f.id} uses unknown intent "${i}"`);
    if (!f.intents.length && !f.patterns?.length) err(`History fact ${f.id} is unreachable (no intents or patterns)`);
  }

  const examIds = new Set<string>();
  for (const e of c.exam) {
    if (!MANEUVER_BY_ID.has(e.maneuver)) err(`Unknown exam maneuver "${e.maneuver}"`);
    if (examIds.has(e.maneuver)) err(`Exam maneuver ${e.maneuver} defined twice`);
    examIds.add(e.maneuver);
  }

  const resultIds = new Set<string>();
  for (const r of c.results) {
    if (!investigationIds.has(r.investigation)) err(`Result for unknown investigation "${r.investigation}"`);
    if (resultIds.has(r.investigation)) err(`Investigation ${r.investigation} has two results`);
    resultIds.add(r.investigation);
  }
  for (const n of c.normalInvestigations) {
    if (!investigationIds.has(n)) err(`normalInvestigations lists unknown investigation "${n}"`);
    if (resultIds.has(n)) err(`Investigation ${n} is both a defined result and listed as normal`);
  }

  const h = c.hidden;
  for (const k of h.keyFindings) {
    if (!factIds.has(k) && !examIds.has(k) && !resultIds.has(k)) err(`keyFinding "${k}" does not match a history fact, exam maneuver, or result`);
  }
  for (const id of [...h.necessaryInvestigations, ...h.reasonableInvestigations]) {
    if (!investigationIds.has(id)) err(`Investigation list includes unknown id "${id}"`);
    if (!resultIds.has(id) && !c.normalInvestigations.includes(id)) err(`Investigation "${id}" is expected but has no result and is not listed as normal`);
  }
  const overlap = h.necessaryInvestigations.filter((x) => h.reasonableInvestigations.includes(x));
  if (overlap.length) err(`Investigations both necessary and reasonable: ${overlap.join(", ")}`);

  const actionOrInv = (id: string) => ACTION_BY_ID.has(id) || investigationIds.has(id);
  for (const u of h.urgentActions) for (const s of u.satisfiedBy) if (!actionOrInv(s)) err(`Urgent action ${u.id} references unknown "${s}"`);
  for (const ha of h.harmfulActions) if (!actionOrInv(ha.id)) err(`Harmful action references unknown "${ha.id}"`);
  for (const d of h.deteriorations ?? []) for (const p of d.preventedBy) if (!actionOrInv(p)) err(`Deterioration references unknown "${p}"`);
  for (const ic of h.interpretationChecks) {
    if (!resultIds.has(ic.investigation)) err(`Interpretation check ${ic.id} refers to ${ic.investigation}, which has no defined result`);
    if (gradeFreeText(ic.modelAnswer, ic.answer).score < 1) err(`Interpretation check ${ic.id}: model answer does not earn full credit against its own key`);
  }

  if (!h.diagnosis.full.length) err("Diagnosis answer key has no full-credit concept");
  if (gradeFreeText(h.diagnosisLabel, h.diagnosis).score < 1) err(`diagnosisLabel "${h.diagnosisLabel}" does not earn full credit against the diagnosis key`);
  if (!h.leakTerms.length) err("leakTerms is empty");

  // Leak checks: nothing visible before submission may name the answer.
  const visible = [c.label, c.presentation.chiefComplaint, c.presentation.opening, c.presentation.setting, c.speed?.presentation ?? ""];
  for (const v of visible) {
    const leak = containsLeak(v, h.leakTerms);
    if (leak) err(`Visible text leaks "${leak}": ${v.slice(0, 80)}`);
  }
  for (const f of c.history) {
    const leak = containsLeak(f.say, h.leakTerms);
    if (leak) err(`Patient dialogue in ${f.id} leaks "${leak}"`);
  }
  const leakDefault = containsLeak(c.defaultNegative, h.leakTerms);
  if (leakDefault) err(`defaultNegative leaks "${leakDefault}"`);

  if (c.modes.includes("emergency") && !h.urgentActions.some((u) => u.deadlineMin !== undefined)) err("Emergency case has no time-limited urgent actions");
  if (c.modes.includes("speed")) {
    if (!c.speed) err("Speed mode case lacks a speed block");
    else
      for (const y of c.speed.highYield) {
        if (!investigationIds.has(y) && !MANEUVER_BY_ID.has(y) && !INTENT_BY_ID.has(y)) err(`Speed highYield "${y}" is not an investigation, maneuver, or intent`);
      }
  }
  if ((h.endpoint === "ranked-differential" || h.endpoint === "syndrome") && !h.rankedRequired?.length) warn("Ranked or syndrome endpoint without rankedRequired concepts");
  if (h.endpoint === "further-evaluation" && !h.acceptableNextSteps?.length) err("further-evaluation endpoint needs acceptableNextSteps");
  if (c.provenance === "adapted-published" && !c.adaptation) err("Adapted case must include adaptation source, license, and alterations");
  if (!c.sources.length && c.provenance !== "synthetic") warn("Case has no sources");
  if (c.modes.includes("longitudinal") && !c.visits?.length) err("Longitudinal case lacks visits");
  return issues;
}
