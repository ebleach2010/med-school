// In-browser stand-in for the API server, used only by the standalone build (the hosted
// page has no server). It runs the same encounter engine and grading as the server.
// Because everything runs in the browser here, case answer keys ship in this bundle;
// the server build keeps them server-side.

import type { CaseDef, CaseSummary, EncounterMode } from "../../shared/types";
import { CASES, CASE_BY_ID } from "../../content/cases";
import { gradeFreeText } from "../../shared/text";
import { containsLeak } from "../../shared/dialogue";
import * as E from "../../server/encounter";
import { gradeEncounter, type EncounterGrade } from "../../server/caseGrading";
import { patientSystem, tutorSystemForEncounter, tutorSystemForLesson, wrapUntrusted } from "../../server/ai/roles";
import { LESSON_BY_ID } from "../../content/lessons";
import type { StreamHandlers } from "../lib/api";
import { hostCapability, type SampleFn } from "../lib/platform";
import { cloudLoadProgress, cloudSaveProgress } from "./cloud";

interface StoredEncounter {
  state: E.EncounterState;
  grade?: EncounterGrade;
  visitAnswers?: Record<string, { answer: string; score: number; feedback: string }>;
}

const ENC_KEY = "nt-encounters";
const encounters = new Map<string, StoredEncounter>();
try {
  const raw = JSON.parse(localStorage.getItem(ENC_KEY) ?? "{}") as Record<string, StoredEncounter>;
  for (const [k, v] of Object.entries(raw)) encounters.set(k, v);
} catch {
  // Browser storage unavailable: encounters last for this visit only.
}

function persistEncounters() {
  try {
    // Keep the 40 most recent encounters.
    const recent = [...encounters.values()].sort((a, b) => b.state.createdAt - a.state.createdAt).slice(0, 40);
    localStorage.setItem(ENC_KEY, JSON.stringify(Object.fromEntries(recent.map((e) => [e.state.id, e]))));
  } catch {
    // ignore
  }
}

class HttpError extends Error {
  constructor(public status: number, message: string, public kind?: string) {
    super(message);
  }
}

let samplePromise: Promise<SampleFn | null> | null = null;
function sample(): Promise<SampleFn | null> {
  samplePromise ??= hostCapability<SampleFn>("sample");
  return samplePromise;
}

function summary(c: CaseDef): CaseSummary {
  return {
    id: c.id,
    label: c.label,
    modes: c.modes,
    difficulty: c.difficulty,
    provenance: c.provenance,
    review: c.review,
    age: c.presentation.age,
    sex: c.presentation.sex,
    setting: c.presentation.setting,
    chiefComplaint: c.presentation.chiefComplaint,
    adaptationSource: c.adaptation?.source,
  };
}

function get(id: string): { enc: StoredEncounter; cs: CaseDef } {
  const enc = encounters.get(id);
  if (!enc) throw new HttpError(404, "This encounter is no longer available on this device.");
  const cs = CASE_BY_ID.get(enc.state.caseId);
  if (!cs) throw new HttpError(404, "Case not found.");
  return { enc, cs };
}

function view(enc: StoredEncounter, cs: CaseDef) {
  const base = E.publicView(cs, enc.state);
  if (enc.state.status === "submitted" && enc.grade) return { ...base, caseId: cs.id, grade: enc.grade, modules: cs.modules, visits: cs.visits?.map((v) => ({ id: v.id, label: v.label })) ?? [] };
  if (enc.state.status === "interpreting")
    return {
      ...base,
      caseId: cs.id,
      interpretation: cs.hidden.interpretationChecks.map((ic) => {
        const ev = E.resultEvent(cs, ic.investigation, enc.state.simMinutes);
        return { id: ic.id, question: ic.question, result: { text: ev.text, values: ev.values, schematic: ev.schematic, report: ev.report }, orderedByLearner: enc.state.orders.some((o) => o.inv === ic.investigation) };
      }),
    };
  return { ...base, caseId: cs.id };
}

function save(enc: StoredEncounter) {
  encounters.set(enc.state.id, enc);
  persistEncounters();
}

function coverage() {
  const byModule: Record<string, { full: number; speed: number }> = {};
  for (const cs of CASES) {
    for (const m of cs.modules) {
      byModule[m] ??= { full: 0, speed: 0 };
      if (cs.modes.includes("speed")) byModule[m].speed++;
      else byModule[m].full++;
    }
  }
  const review: Record<string, number> = { reviewed: 0, pending: 0, "changes-requested": 0 };
  for (const cs of CASES) review[cs.review] = (review[cs.review] ?? 0) + 1;
  return { cases: CASES.length, byModule, review, synthetic: CASES.filter((x) => x.provenance === "synthetic").length };
}

async function aiStatus() {
  const s = await sample();
  return {
    mode: s ? "live" : "demo",
    provider: "claude.ai",
    keySource: "none",
    maskedKey: null,
    openaiBaseUrl: null,
    settings: { enabled: true, provider: "anthropic", model: "", patientModel: "", openaiModels: [], timeoutMs: 60000, maxRetries: 0, sessionCallLimit: 0, dailyCostLimitUsd: 0 },
    models: [],
    usage24h: { calls: 0, input: 0, output: 0, cost: 0, failures: 0 },
  };
}

type Body = Record<string, unknown> | undefined;

export async function localApi(method: string, path: string, rawBody: unknown): Promise<unknown> {
  const body = (rawBody ?? {}) as Body & Record<string, unknown>;
  const url = new URL(path, "http://local");
  const p = url.pathname;
  const m = p.match(/^\/api\/encounters\/([^/]+)(?:\/(.+))?$/);

  if (method === "GET" && p === "/api/health") return { ok: true, time: Date.now() };
  if (method === "GET" && p === "/api/reviews") return {};
  if (method === "GET" && p === "/api/cases") return CASES.map(summary);
  if (method === "GET" && p === "/api/coverage") return coverage();
  if (method === "GET" && (p === "/api/reference/approved-antibodies" || p === "/api/proposals")) return [];
  if (method === "GET" && p === "/api/ai/status") return aiStatus();
  if (method === "GET" && p === "/api/ai/usage") return null;

  const prog = p.match(/^\/api\/progress\/([^/]+)$/);
  if (prog && method === "GET") return { state: await cloudLoadProgress() };
  if (prog && method === "PUT") {
    await cloudSaveProgress(body);
    return { ok: true };
  }

  if (method === "POST" && p === "/api/encounters") {
    const cs = CASE_BY_ID.get(String(body.caseId));
    if (!cs) throw new HttpError(404, "Case not found.");
    const mode = String(body.mode) as EncounterMode;
    if (!cs.modes.includes(mode)) throw new HttpError(400, "This case does not support that mode.");
    const enc: StoredEncounter = { state: E.newEncounter(crypto.randomUUID(), cs, mode, Date.now()) };
    save(enc);
    return view(enc, cs);
  }

  if (method === "POST" && p === "/api/speed/next") {
    const exclude = (body.exclude as string[] | undefined) ?? [];
    const pool = CASES.filter((x) => x.modes.includes("speed") && x.speed);
    const fresh = pool.filter((x) => !exclude.includes(x.id));
    const from = fresh.length ? fresh : pool;
    const pick = from[Math.floor(Math.random() * from.length)];
    const enc: StoredEncounter = { state: E.newEncounter(crypto.randomUUID(), pick, "speed", Date.now()) };
    save(enc);
    return view(enc, pick);
  }

  if (m) {
    const [, id, action] = m;
    const { enc, cs } = get(id);
    const s = enc.state;
    try {
      if (method === "GET" && !action) return view(enc, cs);
      if (method === "POST" && action === "ask") {
        if (s.mode === "speed") throw new HttpError(400, "Use speed requests in a speed round.");
        let note: string | undefined;
        if (body.intent) E.askIntent(cs, s, String(body.intent));
        else if (body.question) {
          let aiReply: { text: string; factIds: string[] } | undefined;
          const smp = body.useAI ? await sample() : null;
          if (smp) {
            try {
              const out = await smp.json<{ reply: string; usedFactIds: string[] }>(
                `${patientSystem(cs)}\n\nReply with only a JSON object {"reply": string, "usedFactIds": string[]}.\n\n${wrapUntrusted("learner-question", String(body.question).slice(0, 500))}`,
                { modelTier: "quick", cache: false },
              );
              const reply = typeof out?.reply === "string" ? out.reply.slice(0, 600) : "";
              const ids = Array.isArray(out?.usedFactIds) ? out.usedFactIds.filter((x) => cs.history.some((h) => h.id === x)) : [];
              if (!reply) note = "The AI reply was empty; using the rule-based patient.";
              else if (containsLeak(reply, cs.hidden.leakTerms)) note = "The AI reply was replaced by the rule-based reply because it risked revealing the answer.";
              else aiReply = { text: reply, factIds: ids };
            } catch {
              note = "AI unavailable; using the rule-based patient.";
            }
          }
          E.ask(cs, s, String(body.question), aiReply);
        } else throw new HttpError(400, "Ask a question or choose a topic.");
        save(enc);
        return { ...view(enc, cs), note };
      }
      if (method === "POST" && action === "exam") E.examine(cs, s, body.maneuvers as string[]);
      else if (method === "POST" && action === "order") E.order(cs, s, body.investigations as string[]);
      else if (method === "POST" && action === "action") E.act(cs, s, String(body.action));
      else if (method === "POST" && action === "wait") E.wait(cs, s, Number(body.minutes));
      else if (method === "POST" && action === "ddx") E.setDdx(s, (body.labels as string[]) ?? []);
      else if (method === "POST" && action === "submit") {
        if (s.status !== "active") throw new HttpError(400, "Already submitted.");
        s.submission = {
          endpoint: body.endpoint as E.Submission["endpoint"],
          diagnosis: String(body.diagnosis ?? "").slice(0, 300),
          localization: body.localization as string | undefined,
          differential: (body.differential as string[]) ?? [],
          keyFindings: (body.keyFindings as string[]) ?? [],
          reasoning: String(body.reasoning ?? ""),
          nextSteps: String(body.nextSteps ?? ""),
          submittedAt: s.simMinutes,
        };
        if (cs.hidden.interpretationChecks.length && s.mode !== "speed") s.status = "interpreting";
        else {
          s.status = "submitted";
          enc.grade = gradeEncounter(cs, s, s.submission, {});
        }
      } else if (method === "POST" && action === "interpret") {
        if (s.status !== "interpreting") throw new HttpError(400, "No interpretation step pending.");
        s.status = "submitted";
        enc.grade = gradeEncounter(cs, s, s.submission!, (body.answers as Record<string, string>) ?? {});
      } else if (method === "POST" && action === "speed-request") E.speedRequest(cs, s, body.kind as "history" | "exam" | "investigation", String(body.id));
      else if (method === "POST" && action === "speed-submit") {
        if (s.status !== "active") throw new HttpError(400, "Already submitted.");
        s.submission = { endpoint: "diagnosis", diagnosis: String(body.diagnosis ?? ""), differential: [], keyFindings: [], reasoning: "", nextSteps: "", skipped: Boolean(body.skip), submittedAt: 0 };
        s.status = "submitted";
        enc.grade = gradeEncounter(cs, s, s.submission, {});
      } else if (action?.startsWith("visits/")) {
        const n = Number(action.split("/")[1]);
        const v = cs.visits?.[n];
        if (!v || s.status !== "submitted") throw new HttpError(404, "No such visit.");
        if (method === "GET") return { index: n, total: cs.visits!.length, label: v.label, intervalNote: v.intervalNote, update: v.update, question: v.question.stem, answered: enc.visitAnswers?.[v.id] ?? null, modelAnswer: enc.visitAnswers?.[v.id] ? v.question.modelAnswer : undefined };
        const g = gradeFreeText(String(body.answer ?? ""), v.question.answer);
        enc.visitAnswers = { ...(enc.visitAnswers ?? {}), [v.id]: { answer: String(body.answer ?? ""), score: g.score, feedback: g.feedback } };
        save(enc);
        return { score: g.score, feedback: g.feedback, modelAnswer: v.question.modelAnswer };
      } else throw new HttpError(404, "Not available in this version.");
    } catch (e) {
      if (e instanceof E.EncounterError) throw new HttpError(400, e.message);
      throw e;
    }
    save(enc);
    return view(enc, cs);
  }

  throw new HttpError(404, "This feature needs the full app server (review workspace, API keys, content drafting).");
}

/** Tutor chat over the viewer's own Claude account (the page's `sample` capability). */
export async function localStream(path: string, rawBody: unknown, h: StreamHandlers, signal: AbortSignal): Promise<void> {
  if (path !== "/api/ai/tutor") throw new Error("Not available.");
  const body = rawBody as { kind: "encounter" | "lesson"; encounterId?: string; lessonId?: string; mode?: string; messages: { role: "user" | "assistant"; content: string }[] };
  const smp = await sample();
  if (!smp) {
    h.onError?.({ error: "The AI tutor is not available here. Open this page on claude.ai while signed in to use it.", kind: "missing-key" });
    return;
  }
  let system: string;
  if (body.kind === "encounter") {
    const { enc, cs } = get(body.encounterId ?? "");
    if (enc.state.status !== "submitted" || !enc.grade) {
      h.onError?.({ error: "Submit the encounter before discussing it with the tutor." });
      return;
    }
    const g = enc.grade;
    system = tutorSystemForEncounter(cs, `overall ${Math.round(g.overall * 100)}%; diagnosis ${g.dimensions.diagnosis.summary}; ${g.dimensions.reasoning.summary}; ${g.dimensions.actions.summary}`);
  } else {
    const l = LESSON_BY_ID.get(body.lessonId ?? "");
    if (!l) {
      h.onError?.({ error: "Lesson not found." });
      return;
    }
    system = tutorSystemForLesson(l, body.mode ?? "ask");
  }
  const turns = [{ role: "user" as const, content: system }, ...body.messages.map((m) => (m.role === "user" ? { role: m.role, content: wrapUntrusted("learner", m.content) } : m))];
  try {
    const r = await smp(turns, { signal, cache: false, onText: ({ delta }) => h.onText(delta) });
    h.onDone?.({ usage: { inputTokens: 0, outputTokens: 0 }, model: "your Claude account", cost: 0 });
    if (r.truncated) h.onText("\n\n(Answer cut short.)");
  } catch (e) {
    const err = e as { code?: string; message?: string };
    if (err.code === "cancelled") return;
    const copy: Record<string, string> = {
      not_granted: "The AI tutor was not allowed for this page. Use the prewritten explanations instead.",
      rate_limited: "Too many requests right now. Try again in a little while.",
      sampling_disabled: "Claude is not available for this account.",
      refused: "Claude declined this request. Try rephrasing.",
    };
    h.onError?.({ error: copy[err.code ?? ""] ?? "The tutor could not answer. Try again.", kind: err.code });
  }
}
