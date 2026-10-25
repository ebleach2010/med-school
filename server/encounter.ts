// Encounter engine. The hidden case state lives here on the server. The client receives
// only what the learner has revealed: patient answers, requested exam findings, and
// results whose simulated turnaround has elapsed. The case never changes after loading.

import type { CaseDef, EncounterMode, Schematic, ResultValue } from "../shared/types";
import { answerQuestion, INTENT_BY_ID } from "../shared/dialogue";
import { MANEUVER_BY_ID } from "../shared/exam";
import { ACTION_BY_ID } from "../shared/actions";
import { INVESTIGATION_BY_ID } from "../content/investigations";

export const SPEED_MAX_REQUESTS = 2;

export type EventKind = "presentation" | "learner" | "patient" | "exam" | "order" | "result" | "action" | "system" | "ddx" | "warning";

export interface EncounterEvent {
  t: number;
  kind: EventKind;
  text: string;
  ref?: string;
  abnormal?: boolean;
  values?: ResultValue[];
  schematic?: Schematic;
  report?: string;
  /** Marks AI-phrased patient replies. */
  ai?: boolean;
}

export interface EncounterState {
  id: string;
  caseId: string;
  caseVersion: number;
  mode: EncounterMode;
  createdAt: number;
  simMinutes: number;
  status: "active" | "interpreting" | "submitted";
  events: EncounterEvent[];
  askedFacts: string[];
  examined: string[];
  orders: { inv: string; at: number; readyAt: number; delivered: boolean }[];
  actions: { id: string; at: number }[];
  ddx: { label: string; rank: number }[];
  ddxRevisions: number;
  requestsUsed: number;
  requestLog: { kind: "history" | "exam" | "investigation"; id: string }[];
  firedDeteriorations: number[];
  fastForwardMinutes: number;
  submission?: Submission;
  visitIndex: number;
}

export interface Submission {
  endpoint: "diagnosis" | "syndrome" | "ranked-differential" | "further-evaluation";
  diagnosis: string;
  localization?: string;
  differential: string[];
  keyFindings: string[];
  reasoning: string;
  nextSteps: string;
  skipped?: boolean;
  submittedAt: number;
}

export function newEncounter(id: string, c: CaseDef, mode: EncounterMode, now: number): EncounterState {
  const presentation = mode === "speed" && c.speed ? c.speed.presentation : c.presentation.opening;
  return {
    id,
    caseId: c.id,
    caseVersion: c.version,
    mode,
    createdAt: now,
    simMinutes: 0,
    status: "active",
    events: [
      { t: 0, kind: "presentation", text: presentation },
      ...(mode === "speed" ? [] : [{ t: 0, kind: "system" as const, text: `Vitals: ${c.presentation.vitals}` }]),
    ],
    askedFacts: [],
    examined: [],
    orders: [],
    actions: [],
    ddx: [],
    ddxRevisions: 0,
    requestsUsed: 0,
    requestLog: [],
    firedDeteriorations: [],
    fastForwardMinutes: 0,
    visitIndex: 0,
  };
}

function assertActive(s: EncounterState) {
  if (s.status !== "active") throw new EncounterError("This encounter has been submitted.");
}

export class EncounterError extends Error {}

/** Advance the simulated clock, delivering results and firing deteriorations. */
export function advance(c: CaseDef, s: EncounterState, minutes: number): void {
  const target = s.simMinutes + minutes;
  const pending = s.orders.filter((o) => !o.delivered && o.readyAt <= target).sort((a, b) => a.readyAt - b.readyAt);
  for (const o of pending) {
    o.delivered = true;
    s.events.push(resultEvent(c, o.inv, o.readyAt));
  }
  for (const [i, d] of (c.hidden.deteriorations ?? []).entries()) {
    if (s.firedDeteriorations.includes(i) || d.atMin > target) continue;
    const prevented = d.preventedBy.some((id) => doneBefore(s, id, d.atMin));
    if (!prevented) {
      s.firedDeteriorations.push(i);
      s.events.push({ t: d.atMin, kind: "warning", text: d.message + (d.vitals ? ` Vitals: ${d.vitals}` : "") });
    } else {
      s.firedDeteriorations.push(i); // resolved: never fires later
    }
  }
  s.simMinutes = target;
}

function doneBefore(s: EncounterState, id: string, minute: number): boolean {
  return s.actions.some((a) => a.id === id && a.at <= minute) || s.orders.some((o) => o.inv === id && o.at <= minute);
}

export function resultEvent(c: CaseDef, invId: string, t: number): EncounterEvent {
  const inv = INVESTIGATION_BY_ID.get(invId);
  const name = inv?.name ?? invId;
  const r = c.results.find((x) => x.investigation === invId);
  if (r) {
    return { t, kind: "result", ref: invId, text: `${name}: ${r.summary}`, abnormal: r.abnormal, values: r.values, schematic: r.schematic, report: r.report };
  }
  if (c.normalInvestigations.includes(invId) && inv) {
    return { t, kind: "result", ref: invId, text: `${name}: ${inv.normalResult}`, abnormal: false, values: inv.normalValues };
  }
  return { t, kind: "result", ref: invId, text: `${name}: not modeled in this case. The simulator does not invent results that were not authored for this patient.`, abnormal: false };
}

export function ask(c: CaseDef, s: EncounterState, question: string, aiReply?: { text: string; factIds: string[] }): EncounterEvent {
  assertActive(s);
  const q = question.trim().slice(0, 500);
  s.events.push({ t: s.simMinutes, kind: "learner", text: q });
  const rule = answerQuestion(c, q);
  const reply = aiReply ?? { text: rule.text, factIds: rule.factIds };
  for (const id of reply.factIds) if (!s.askedFacts.includes(id)) s.askedFacts.push(id);
  const ev: EncounterEvent = { t: s.simMinutes, kind: "patient", text: reply.text, ai: Boolean(aiReply) };
  s.events.push(ev);
  advance(c, s, 1);
  return ev;
}

export function askIntent(c: CaseDef, s: EncounterState, intentId: string): EncounterEvent {
  const intent = INTENT_BY_ID.get(intentId);
  if (!intent) throw new EncounterError("Unknown history topic.");
  return ask(c, s, intent.ask);
}

export function examine(c: CaseDef, s: EncounterState, maneuverIds: string[]): EncounterEvent[] {
  assertActive(s);
  const out: EncounterEvent[] = [];
  for (const id of maneuverIds) {
    const m = MANEUVER_BY_ID.get(id);
    if (!m) throw new EncounterError(`Unknown maneuver ${id}`);
    const f = c.exam.find((e) => e.maneuver === id);
    const ev: EncounterEvent = { t: s.simMinutes, kind: "exam", ref: id, text: `${m.label}: ${f ? f.finding : m.normal}`, abnormal: f?.abnormal ?? false };
    if (!s.examined.includes(id)) s.examined.push(id);
    s.events.push(ev);
    out.push(ev);
    advance(c, s, m.minutes);
  }
  return out;
}

export function order(c: CaseDef, s: EncounterState, invIds: string[]): void {
  assertActive(s);
  for (const id of invIds) {
    const inv = INVESTIGATION_BY_ID.get(id);
    if (!inv) throw new EncounterError(`Unknown investigation ${id}`);
    if (s.orders.some((o) => o.inv === id)) continue;
    const r = c.results.find((x) => x.investigation === id);
    const tat = r?.turnaroundMin ?? inv.turnaroundMin;
    s.orders.push({ inv: id, at: s.simMinutes, readyAt: s.simMinutes + tat, delivered: false });
    s.events.push({ t: s.simMinutes, kind: "order", ref: id, text: `Ordered ${inv.name}. Typical turnaround: ${inv.turnaroundNote.replace(/\.$/, "")}.` });
  }
  advance(c, s, 1);
}

export function act(c: CaseDef, s: EncounterState, actionId: string): EncounterEvent {
  assertActive(s);
  const a = ACTION_BY_ID.get(actionId);
  if (!a) throw new EncounterError("Unknown action.");
  s.actions.push({ id: actionId, at: s.simMinutes });
  const ev: EncounterEvent = { t: s.simMinutes, kind: "action", ref: actionId, text: `${a.label}.` };
  s.events.push(ev);
  advance(c, s, a.minutes);
  return ev;
}

export function wait(c: CaseDef, s: EncounterState, minutes: number): void {
  assertActive(s);
  const m = Math.max(1, Math.min(24 * 60 * 3, Math.round(minutes)));
  s.fastForwardMinutes += m;
  s.events.push({ t: s.simMinutes, kind: "system", text: `Simulation fast-forward: ${m} minutes.` });
  advance(c, s, m);
}

export function setDdx(s: EncounterState, labels: string[]): void {
  assertActive(s);
  const clean = labels.map((l) => l.trim().slice(0, 120)).filter(Boolean).slice(0, 10);
  const prev = s.ddx.map((d) => d.label).join("|");
  if (prev && prev !== clean.join("|")) s.ddxRevisions++;
  s.ddx = clean.map((label, i) => ({ label, rank: i + 1 }));
  s.events.push({ t: s.simMinutes, kind: "ddx", text: clean.length ? `Differential: ${clean.join("; ")}` : "Differential cleared." });
}

/** Speed round: exactly one request per call, at most two per case. */
export function speedRequest(c: CaseDef, s: EncounterState, kind: "history" | "exam" | "investigation", id: string): EncounterEvent {
  assertActive(s);
  if (s.mode !== "speed") throw new EncounterError("Not a speed round.");
  if (s.requestsUsed >= SPEED_MAX_REQUESTS) throw new EncounterError(`Request limit reached (${SPEED_MAX_REQUESTS}).`);
  let ev: EncounterEvent;
  if (kind === "history") {
    const intent = INTENT_BY_ID.get(id);
    if (!intent) throw new EncounterError("Unknown history topic.");
    s.events.push({ t: 0, kind: "learner", text: intent.ask });
    const r = answerQuestion(c, intent.ask);
    r.factIds.forEach((f) => s.askedFacts.includes(f) || s.askedFacts.push(f));
    ev = { t: 0, kind: "patient", text: r.text };
    s.events.push(ev);
  } else if (kind === "exam") {
    const m = MANEUVER_BY_ID.get(id);
    if (!m) throw new EncounterError("Unknown maneuver.");
    const f = c.exam.find((e) => e.maneuver === id);
    ev = { t: 0, kind: "exam", ref: id, text: `${m.label}: ${f ? f.finding : m.normal}`, abnormal: f?.abnormal ?? false };
    s.examined.push(id);
    s.events.push(ev);
  } else {
    if (!INVESTIGATION_BY_ID.has(id)) throw new EncounterError("Unknown investigation.");
    ev = resultEvent(c, id, 0);
    s.orders.push({ inv: id, at: 0, readyAt: 0, delivered: true });
    s.events.push(ev);
  }
  s.requestsUsed++;
  s.requestLog.push({ kind, id });
  return ev;
}

/** Ids of everything the learner has revealed, used for citing key findings. */
export function revealedIds(s: EncounterState): string[] {
  return [...s.askedFacts, ...s.examined, ...s.orders.filter((o) => o.delivered).map((o) => o.inv)];
}

export interface RevealedFinding {
  id: string;
  text: string;
  source: "history" | "exam" | "result";
}

export function revealedFindings(c: CaseDef, s: EncounterState): RevealedFinding[] {
  const out: RevealedFinding[] = [];
  for (const id of s.askedFacts) {
    const f = c.history.find((h) => h.id === id);
    if (f) out.push({ id, text: f.finding, source: "history" });
  }
  for (const id of s.examined) {
    const m = MANEUVER_BY_ID.get(id);
    const f = c.exam.find((e) => e.maneuver === id);
    if (m) out.push({ id, text: `${m.label}: ${f ? f.finding : m.normal}`, source: "exam" });
  }
  for (const o of s.orders.filter((x) => x.delivered)) {
    const r = c.results.find((x) => x.investigation === o.inv);
    const inv = INVESTIGATION_BY_ID.get(o.inv);
    out.push({ id: o.inv, text: `${inv?.name ?? o.inv}: ${r ? r.summary : c.normalInvestigations.includes(o.inv) ? "normal" : "not modeled"}`, source: "result" });
  }
  return out;
}

/** Public view: the presentation and revealed events. Never includes `hidden`. */
export function publicView(c: CaseDef, s: EncounterState) {
  return {
    id: s.id,
    mode: s.mode,
    status: s.status,
    simMinutes: s.simMinutes,
    fastForwardMinutes: s.fastForwardMinutes,
    case: {
      label: c.label,
      age: c.presentation.age,
      sex: c.presentation.sex,
      setting: c.presentation.setting,
      chiefComplaint: c.presentation.chiefComplaint,
      speaker: c.presentation.speaker,
      speakerNote: c.presentation.speakerNote,
      provenance: c.provenance,
      review: c.review,
      adaptation: c.adaptation,
      hasVisits: Boolean(c.visits?.length),
    },
    events: s.events,
    pendingOrders: s.orders.filter((o) => !o.delivered).map((o) => ({ inv: o.inv, readyAt: o.readyAt })),
    actions: s.actions,
    ddx: s.ddx,
    requestsUsed: s.requestsUsed,
    requestLimit: s.mode === "speed" ? SPEED_MAX_REQUESTS : null,
    findings: revealedFindings(c, s),
  };
}
