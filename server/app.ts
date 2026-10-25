// HTTP API. Hidden case state never leaves this process before submission.

import { Hono, type Context } from "hono";
import { streamSSE } from "hono/streaming";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import type { CaseDef, CaseSummary, EncounterMode } from "../shared/types";
import { CASES, CASE_BY_ID } from "../content/cases";
import { INVESTIGATION_BY_ID, INVESTIGATIONS } from "../content/investigations";
import { INVESTIGATION_IDS } from "../content/investigationIds";
import { validateCase } from "../shared/caseValidate";
import { caseSchema, antibodyProposalSchema, patientReplySchema, equivalenceSchema } from "../shared/schemas";
import { containsLeak } from "../shared/dialogue";
import { gradeFreeText } from "../shared/text";
import type { DB } from "./db";
import { AIService } from "./ai/service";
import { AIError } from "./ai/provider";
import { patientSystem, tutorSystemForEncounter, tutorSystemForLesson, graderSystem, authorSystem, wrapUntrusted } from "./ai/roles";
import { LESSON_BY_ID } from "../content/lessons";
import { setKey, clearKey, type ProviderId } from "./secrets";
import { RateLimiter } from "./ratelimit";
import { log } from "./log";
import * as E from "./encounter";
import { gradeEncounter, type EncounterGrade } from "./caseGrading";

export interface AppDeps {
  db: DB;
  ai?: AIService;
  now?: () => number;
}

interface StoredEncounter {
  state: E.EncounterState;
  grade?: EncounterGrade;
  interpretAnswers?: Record<string, string>;
  visitAnswers?: Record<string, { answer: string; score: number; feedback: string }>;
}

const INVESTIGATION_SET = new Set<string>(INVESTIGATION_IDS);

export function createApp(deps: AppDeps) {
  const { db } = deps;
  const ai = deps.ai ?? new AIService(db);
  const now = deps.now ?? (() => Date.now());
  const app = new Hono();
  const generalLimiter = new RateLimiter(600, 600);
  const aiLimiter = new RateLimiter(30, 30);

  const clientKey = (c: Context) => c.req.header("x-forwarded-for")?.split(",")[0].trim() || c.req.header("x-real-ip") || "local";
  const sessionId = (c: Context) => (c.req.header("x-session-id") ?? "anonymous").replace(/[^a-zA-Z0-9-]/g, "").slice(0, 64) || "anonymous";

  app.use("/api/*", async (c, next) => {
    const r = generalLimiter.take(clientKey(c));
    if (!r.ok) return c.json({ error: "Too many requests." }, 429, { "retry-after": String(r.retryAfterSec) });
    await next();
  });
  const aiGate = (c: Context) => {
    const r = aiLimiter.take(clientKey(c));
    return r.ok ? null : c.json({ error: "AI rate limit reached. Try again shortly.", kind: "rate" }, 429, { "retry-after": String(r.retryAfterSec) });
  };
  const adminGate = (c: Context) => {
    const token = process.env.ADMIN_TOKEN;
    if (token && c.req.header("x-admin-token") !== token) return c.json({ error: "Admin token required." }, 401);
    return null;
  };

  app.onError((err, c) => {
    if (err instanceof E.EncounterError) return c.json({ error: err.message }, 400);
    if (err instanceof z.ZodError) return c.json({ error: "Invalid request.", issues: err.issues.slice(0, 5) }, 400);
    log.error("Unhandled error", err);
    return c.json({ error: "Server error." }, 500);
  });

  // ------------------------------------------------------------------ helpers
  function approvedGeneratedCases(): CaseDef[] {
    const rows = db.prepare("SELECT payload FROM proposals WHERE kind = 'case' AND status = 'approved'").all() as { payload: string }[];
    const out: CaseDef[] = [];
    for (const r of rows) {
      const parsed = caseSchema.safeParse(JSON.parse(r.payload));
      if (parsed.success) out.push(parsed.data as CaseDef);
    }
    return out;
  }
  function getCase(id: string): CaseDef | undefined {
    return CASE_BY_ID.get(id) ?? approvedGeneratedCases().find((c) => c.id === id);
  }
  function caseReview(c: CaseDef): CaseDef["review"] {
    const row = db.prepare("SELECT status, content_version FROM reviews WHERE content_id = ? ORDER BY ts DESC, id DESC LIMIT 1").get(`case:${c.id}`) as { status: CaseDef["review"]; content_version: number } | undefined;
    return row && row.content_version === c.version ? row.status : c.review;
  }
  function summary(c: CaseDef): CaseSummary {
    return {
      id: c.id,
      label: c.label,
      modes: c.modes,
      difficulty: c.difficulty,
      provenance: c.provenance,
      review: caseReview(c),
      age: c.presentation.age,
      sex: c.presentation.sex,
      setting: c.presentation.setting,
      chiefComplaint: c.presentation.chiefComplaint,
      adaptationSource: c.adaptation?.source,
    };
  }
  function load(id: string): StoredEncounter | undefined {
    const row = db.prepare("SELECT state FROM encounters WHERE id = ?").get(id) as { state: string } | undefined;
    return row ? (JSON.parse(row.state) as StoredEncounter) : undefined;
  }
  function save(enc: StoredEncounter, profileId?: string) {
    const t = now();
    db.prepare(
      "INSERT INTO encounters (id, profile_id, case_id, state, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET state = excluded.state, updated_at = excluded.updated_at",
    ).run(enc.state.id, profileId ?? null, enc.state.caseId, JSON.stringify(enc), t, t);
  }
  function withEncounter(c: Context): { enc: StoredEncounter; cs: CaseDef } {
    const enc = load(c.req.param("id")!);
    if (!enc) throw new E.EncounterError("Encounter not found.");
    const cs = getCase(enc.state.caseId);
    if (!cs) throw new E.EncounterError("Case not found.");
    if (cs.version !== enc.state.caseVersion) log.warn(`Encounter ${enc.state.id} uses case version ${enc.state.caseVersion}; current is ${cs.version}`);
    return { enc, cs };
  }
  function view(enc: StoredEncounter, cs: CaseDef) {
    const pv = E.publicView(cs, enc.state);
    const base = { ...pv, case: { ...pv.case, review: caseReview(cs) } };
    if (enc.state.status === "submitted" && enc.grade) return { ...base, grade: enc.grade, modules: cs.modules, visits: cs.visits?.map((v) => ({ id: v.id, label: v.label })) ?? [] };
    if (enc.state.status === "interpreting") return { ...base, interpretation: interpretationQuestions(cs, enc.state) };
    return base;
  }
  function interpretationQuestions(cs: CaseDef, s: E.EncounterState) {
    return cs.hidden.interpretationChecks.map((ic) => {
      const ev = E.resultEvent(cs, ic.investigation, s.simMinutes);
      const ordered = s.orders.some((o) => o.inv === ic.investigation);
      return { id: ic.id, question: ic.question, result: { text: ev.text, values: ev.values, schematic: ev.schematic, report: ev.report }, orderedByLearner: ordered };
    });
  }
  function aiErrorResponse(c: Context, e: unknown) {
    const err = e instanceof AIError ? e : new AIError("other", "Unexpected error.");
    const status = err.kind === "missing-key" ? 409 : err.kind === "auth" ? 401 : err.kind === "rate" || err.kind === "limit" ? 429 : err.kind === "timeout" ? 504 : 502;
    return c.json({ error: err.message, kind: err.kind }, status);
  }

  // ------------------------------------------------------------------ general
  app.get("/api/health", (c) => c.json({ ok: true, time: now() }));

  app.get("/api/reviews", (c) => {
    const rows = db.prepare("SELECT content_id, content_version, status, reviewer, note, ts FROM reviews ORDER BY ts ASC").all() as {
      content_id: string;
      content_version: number;
      status: string;
      reviewer: string;
      note: string | null;
      ts: number;
    }[];
    const latest: Record<string, unknown> = {};
    for (const r of rows) latest[r.content_id] = { version: r.content_version, status: r.status, reviewer: r.reviewer, note: r.note, ts: r.ts };
    return c.json(latest);
  });

  app.post("/api/reviews", async (c) => {
    const denied = adminGate(c);
    if (denied) return denied;
    const body = z
      .object({ contentId: z.string().min(1), version: z.number().int().min(1), status: z.enum(["reviewed", "pending", "changes-requested"]), reviewer: z.string().min(1).max(80), note: z.string().max(2000).optional() })
      .parse(await c.req.json());
    db.prepare("INSERT INTO reviews (content_id, content_version, status, reviewer, note, ts) VALUES (?, ?, ?, ?, ?, ?)").run(body.contentId, body.version, body.status, body.reviewer, body.note ?? null, now());
    return c.json({ ok: true });
  });

  // ------------------------------------------------------------------ progress sync
  app.get("/api/progress/:profileId", (c) => {
    const row = db.prepare("SELECT state, updated_at FROM progress WHERE profile_id = ?").get(c.req.param("profileId")) as { state: string; updated_at: number } | undefined;
    if (!row) return c.json({ state: null });
    return c.json({ state: JSON.parse(row.state), updatedAt: row.updated_at });
  });
  app.put("/api/progress/:profileId", async (c) => {
    const text = await c.req.text();
    if (text.length > 5_000_000) return c.json({ error: "Progress payload too large." }, 413);
    const body = JSON.parse(text);
    if (body?.schemaVersion !== 1 || typeof body.profileId !== "string" || body.profileId !== c.req.param("profileId")) return c.json({ error: "Invalid progress payload." }, 400);
    db.prepare("INSERT INTO progress (profile_id, state, updated_at) VALUES (?, ?, ?) ON CONFLICT(profile_id) DO UPDATE SET state = excluded.state, updated_at = excluded.updated_at").run(
      body.profileId,
      text,
      now(),
    );
    return c.json({ ok: true });
  });

  // ------------------------------------------------------------------ cases
  app.get("/api/cases", (c) => c.json([...CASES, ...approvedGeneratedCases()].map(summary)));

  app.post("/api/encounters", async (c) => {
    const body = z.object({ caseId: z.string(), mode: z.enum(["full", "emergency", "speed", "longitudinal", "uncertainty"]), profileId: z.string().optional() }).parse(await c.req.json());
    const cs = getCase(body.caseId);
    if (!cs) return c.json({ error: "Case not found." }, 404);
    if (!cs.modes.includes(body.mode)) return c.json({ error: "This case does not support that mode." }, 400);
    const enc: StoredEncounter = { state: E.newEncounter(randomUUID(), cs, body.mode as EncounterMode, now()) };
    save(enc, body.profileId);
    return c.json(view(enc, cs));
  });

  app.get("/api/encounters/:id", (c) => {
    const { enc, cs } = withEncounter(c);
    return c.json(view(enc, cs));
  });

  app.post("/api/encounters/:id/ask", async (c) => {
    const { enc, cs } = withEncounter(c);
    const body = z.object({ question: z.string().max(500).optional(), intent: z.string().optional(), useAI: z.boolean().optional() }).parse(await c.req.json());
    if (enc.state.mode === "speed") throw new E.EncounterError("Use speed requests in a speed round.");
    let aiNote: string | undefined;
    if (body.intent) E.askIntent(cs, enc.state, body.intent);
    else if (body.question) {
      let aiReply: { text: string; factIds: string[] } | undefined;
      if (body.useAI) {
        const gate = aiGate(c);
        if (gate) return gate;
        try {
          // The patient model receives only patient-knowable facts and the question.
          const out = await ai.json("patient", sessionId(c), patientSystem(cs), [{ role: "user", content: wrapUntrusted("learner-question", body.question) }], patientReplySchema, "patient_reply", c.req.raw.signal);
          const validIds = out.usedFactIds.filter((id) => cs.history.some((h) => h.id === id));
          const leak = containsLeak(out.reply, cs.hidden.leakTerms);
          if (leak) aiNote = "The AI reply was replaced by the rule-based reply because it risked revealing the answer.";
          else aiReply = { text: out.reply, factIds: validIds };
        } catch (e) {
          aiNote = `AI unavailable (${(e as AIError).kind ?? "error"}); using the rule-based patient.`;
        }
      }
      E.ask(cs, enc.state, body.question, aiReply);
    } else throw new E.EncounterError("Ask a question or choose a topic.");
    save(enc);
    return c.json({ ...view(enc, cs), note: aiNote });
  });

  app.post("/api/encounters/:id/exam", async (c) => {
    const { enc, cs } = withEncounter(c);
    const body = z.object({ maneuvers: z.array(z.string()).min(1).max(20) }).parse(await c.req.json());
    if (enc.state.mode === "speed") throw new E.EncounterError("Use speed requests in a speed round.");
    E.examine(cs, enc.state, body.maneuvers);
    save(enc);
    return c.json(view(enc, cs));
  });

  app.post("/api/encounters/:id/order", async (c) => {
    const { enc, cs } = withEncounter(c);
    const body = z.object({ investigations: z.array(z.string()).min(1).max(20) }).parse(await c.req.json());
    if (enc.state.mode === "speed") throw new E.EncounterError("Use speed requests in a speed round.");
    E.order(cs, enc.state, body.investigations);
    save(enc);
    return c.json(view(enc, cs));
  });

  app.post("/api/encounters/:id/action", async (c) => {
    const { enc, cs } = withEncounter(c);
    const body = z.object({ action: z.string() }).parse(await c.req.json());
    E.act(cs, enc.state, body.action);
    save(enc);
    return c.json(view(enc, cs));
  });

  app.post("/api/encounters/:id/wait", async (c) => {
    const { enc, cs } = withEncounter(c);
    const body = z.object({ minutes: z.number().min(1).max(4320) }).parse(await c.req.json());
    E.wait(cs, enc.state, body.minutes);
    save(enc);
    return c.json(view(enc, cs));
  });

  app.post("/api/encounters/:id/ddx", async (c) => {
    const { enc, cs } = withEncounter(c);
    const body = z.object({ labels: z.array(z.string().max(120)).max(10) }).parse(await c.req.json());
    E.setDdx(enc.state, body.labels);
    save(enc);
    return c.json(view(enc, cs));
  });

  const submissionSchema = z.object({
    endpoint: z.enum(["diagnosis", "syndrome", "ranked-differential", "further-evaluation"]),
    diagnosis: z.string().max(300),
    localization: z.string().optional(),
    differential: z.array(z.string().max(120)).max(10),
    keyFindings: z.array(z.string()).max(40),
    reasoning: z.string().max(3000),
    nextSteps: z.string().max(1000),
  });

  async function maybeAiEquivalence(c: Context, cs: CaseDef, enc: StoredEncounter) {
    // Optional semantic check when the rule-based matcher found no accepted concept.
    const sub = enc.state.submission!;
    if (!sub.diagnosis.trim() || sub.skipped) return;
    const g = gradeFreeText(sub.diagnosis, cs.hidden.diagnosis);
    // Only unrecognized phrasings go to the AI: never answers already credited, partially
    // credited, or matching a known wrong answer.
    if (!(g.verdict === "incorrect" && !g.matchedConcept)) return;
    try {
      const status = ai.status();
      if (status.mode !== "live") return;
      const concepts = cs.hidden.diagnosis.full.map((x) => ({ id: x.id, label: x.label }));
      const out = await ai.json(
        "grader",
        sessionId(c),
        graderSystem(),
        [{ role: "user", content: `Accepted concepts: ${JSON.stringify(concepts)}\n${wrapUntrusted("learner-answer", sub.diagnosis)}` }],
        equivalenceSchema,
        "equivalence",
      );
      if (out.equivalentConceptId && out.confidence === "high" && concepts.some((x) => x.id === out.equivalentConceptId) && enc.grade) {
        const d = enc.grade.dimensions.diagnosis;
        d.score = 1;
        d.summary = "Correct (accepted as equivalent by the AI grader).";
        d.details.push(`AI grader: ${out.rationale}`);
        enc.grade.notes.push("The diagnosis wording did not match the rule-based synonyms; an AI grader judged it equivalent. Review if in doubt.");
        const totalW = Object.values(enc.grade.dimensions).reduce((t, x) => t + x.weight, 0);
        enc.grade.overall = totalW ? Object.values(enc.grade.dimensions).reduce((t, x) => t + x.score * x.weight, 0) / totalW : 0;
      }
    } catch {
      // Grading never depends on the AI being available.
    }
  }

  app.post("/api/encounters/:id/submit", async (c) => {
    const { enc, cs } = withEncounter(c);
    if (enc.state.status !== "active") throw new E.EncounterError("Already submitted.");
    const body = submissionSchema.parse(await c.req.json());
    enc.state.submission = { ...body, submittedAt: enc.state.simMinutes };
    if (cs.hidden.interpretationChecks.length && enc.state.mode !== "speed") {
      enc.state.status = "interpreting";
    } else {
      enc.state.status = "submitted";
      enc.grade = gradeEncounter(cs, enc.state, enc.state.submission, {});
      await maybeAiEquivalence(c, cs, enc);
    }
    save(enc);
    return c.json(view(enc, cs));
  });

  app.post("/api/encounters/:id/interpret", async (c) => {
    const { enc, cs } = withEncounter(c);
    if (enc.state.status !== "interpreting") throw new E.EncounterError("No interpretation step pending.");
    const body = z.object({ answers: z.record(z.string(), z.string().max(1000)) }).parse(await c.req.json());
    enc.interpretAnswers = body.answers;
    enc.state.status = "submitted";
    enc.grade = gradeEncounter(cs, enc.state, enc.state.submission!, body.answers);
    await maybeAiEquivalence(c, cs, enc);
    save(enc);
    return c.json(view(enc, cs));
  });

  // Longitudinal follow-up visits (available after the first submission).
  app.get("/api/encounters/:id/visits/:n", (c) => {
    const { enc, cs } = withEncounter(c);
    if (enc.state.status !== "submitted") throw new E.EncounterError("Finish the first visit first.");
    const n = Number(c.req.param("n"));
    const v = cs.visits?.[n];
    if (!v) return c.json({ error: "No such visit." }, 404);
    return c.json({ index: n, total: cs.visits!.length, label: v.label, intervalNote: v.intervalNote, update: v.update, question: v.question.stem, answered: enc.visitAnswers?.[v.id] ?? null, modelAnswer: enc.visitAnswers?.[v.id] ? v.question.modelAnswer : undefined });
  });
  app.post("/api/encounters/:id/visits/:n", async (c) => {
    const { enc, cs } = withEncounter(c);
    const n = Number(c.req.param("n"));
    const v = cs.visits?.[n];
    if (!v || enc.state.status !== "submitted") return c.json({ error: "No such visit." }, 404);
    const body = z.object({ answer: z.string().max(1000) }).parse(await c.req.json());
    const g = gradeFreeText(body.answer, v.question.answer);
    enc.visitAnswers = { ...(enc.visitAnswers ?? {}), [v.id]: { answer: body.answer, score: g.score, feedback: g.feedback } };
    save(enc);
    return c.json({ score: g.score, feedback: g.feedback, modelAnswer: v.question.modelAnswer });
  });

  // ------------------------------------------------------------------ speed rounds
  app.post("/api/speed/next", async (c) => {
    const body = z.object({ exclude: z.array(z.string()).max(200).default([]), profileId: z.string().optional() }).parse(await c.req.json().catch(() => ({})));
    const pool = [...CASES, ...approvedGeneratedCases()].filter((x) => x.modes.includes("speed") && x.speed);
    if (!pool.length) return c.json({ error: "No speed cases available." }, 404);
    const fresh = pool.filter((x) => !body.exclude.includes(x.id));
    const pick = (fresh.length ? fresh : pool)[Math.floor(Math.random() * (fresh.length ? fresh.length : pool.length))];
    const enc: StoredEncounter = { state: E.newEncounter(randomUUID(), pick, "speed", now()) };
    save(enc, body.profileId);
    return c.json({ ...view(enc, pick), caseId: pick.id });
  });

  app.post("/api/encounters/:id/speed-request", async (c) => {
    const { enc, cs } = withEncounter(c);
    const body = z.object({ kind: z.enum(["history", "exam", "investigation"]), id: z.string() }).parse(await c.req.json());
    E.speedRequest(cs, enc.state, body.kind, body.id);
    save(enc);
    return c.json(view(enc, cs));
  });

  app.post("/api/encounters/:id/speed-submit", async (c) => {
    const { enc, cs } = withEncounter(c);
    if (enc.state.status !== "active") throw new E.EncounterError("Already submitted.");
    const body = z.object({ diagnosis: z.string().max(300).default(""), skip: z.boolean().default(false) }).parse(await c.req.json());
    enc.state.submission = { endpoint: "diagnosis", diagnosis: body.diagnosis, differential: [], keyFindings: [], reasoning: "", nextSteps: "", skipped: body.skip, submittedAt: 0 };
    enc.state.status = "submitted";
    enc.grade = gradeEncounter(cs, enc.state, enc.state.submission, {});
    await maybeAiEquivalence(c, cs, enc);
    save(enc);
    return c.json(view(enc, cs));
  });

  // ------------------------------------------------------------------ AI settings and tutor
  app.get("/api/ai/status", (c) => c.json(ai.status()));

  app.put("/api/ai/settings", async (c) => {
    const body = z
      .object({
        enabled: z.boolean().optional(),
        provider: z.enum(["anthropic", "openai-compatible"]).optional(),
        model: z.string().max(100).optional(),
        patientModel: z.string().max(100).optional(),
        openaiModels: z.array(z.string().max(100)).max(20).optional(),
        timeoutMs: z.number().optional(),
        maxRetries: z.number().optional(),
        sessionCallLimit: z.number().optional(),
        dailyCostLimitUsd: z.number().optional(),
      })
      .parse(await c.req.json());
    ai.updateSettings(body);
    return c.json(ai.status());
  });

  app.post("/api/ai/key", async (c) => {
    const body = z.object({ provider: z.enum(["anthropic", "openai-compatible"]), key: z.string().min(8).max(400), baseUrl: z.string().url().max(300).optional() }).parse(await c.req.json());
    setKey(body.provider as ProviderId, body.key, body.baseUrl);
    return c.json(ai.status());
  });

  app.delete("/api/ai/key", (c) => {
    const provider = (c.req.query("provider") ?? "anthropic") as ProviderId;
    clearKey(provider);
    return c.json(ai.status());
  });

  app.post("/api/ai/test", async (c) => {
    const gate = aiGate(c);
    if (gate) return gate;
    return c.json(await ai.test(sessionId(c)));
  });

  app.get("/api/ai/usage", (c) => {
    const day = now() - 24 * 3600 * 1000;
    const month = now() - 30 * 24 * 3600 * 1000;
    return c.json({ day: ai.usageSince(day), month: ai.usageSince(month), byRole30d: ai.usageByRole(month), session: db.prepare("SELECT COUNT(*) AS calls, COALESCE(SUM(cost_usd),0) AS cost FROM ai_usage WHERE session_id = ?").get(sessionId(c)) });
  });

  app.post("/api/ai/tutor", async (c) => {
    const gate = aiGate(c);
    if (gate) return gate;
    const body = z
      .object({
        kind: z.enum(["encounter", "lesson"]),
        encounterId: z.string().optional(),
        lessonId: z.string().optional(),
        mode: z.enum(["simpler", "mechanism", "compare", "deeper", "ask"]).default("ask"),
        messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) })).min(1).max(30),
      })
      .parse(await c.req.json());
    let system: string;
    if (body.kind === "encounter") {
      const enc = body.encounterId ? load(body.encounterId) : undefined;
      const cs = enc ? getCase(enc.state.caseId) : undefined;
      if (!enc || !cs) return c.json({ error: "Encounter not found." }, 404);
      // The tutor may discuss hidden case details only after submission.
      if (enc.state.status !== "submitted" || !enc.grade) return c.json({ error: "Submit the encounter before discussing it with the tutor." }, 409);
      const g = enc.grade;
      system = tutorSystemForEncounter(cs, `overall ${Math.round(g.overall * 100)}%; diagnosis ${g.dimensions.diagnosis.summary}; ${g.dimensions.reasoning.summary}; ${g.dimensions.actions.summary}`);
    } else {
      const l = body.lessonId ? LESSON_BY_ID.get(body.lessonId) : undefined;
      if (!l) return c.json({ error: "Lesson not found." }, 404);
      system = tutorSystemForLesson(l, body.mode);
    }
    const messages = body.messages.map((m) => (m.role === "user" ? { role: m.role, content: wrapUntrusted("learner", m.content) } : m));
    try {
      // Fail fast (before opening the stream) on missing key or limits.
      ai.status();
    } catch (e) {
      return aiErrorResponse(c, e);
    }
    return streamSSE(c, async (stream) => {
      const ctrl = new AbortController();
      stream.onAbort(() => ctrl.abort());
      c.req.raw.signal.addEventListener("abort", () => ctrl.abort());
      try {
        for await (const chunk of ai.stream("tutor", sessionId(c), system, messages, ctrl.signal)) {
          if (chunk.type === "text") await stream.writeSSE({ event: "text", data: JSON.stringify(chunk.text) });
          else await stream.writeSSE({ event: "done", data: JSON.stringify({ usage: chunk.usage, model: chunk.model, cost: chunk.cost }) });
        }
      } catch (e) {
        const err = e instanceof AIError ? e : new AIError("other", "Unexpected error.");
        await stream.writeSSE({ event: "error", data: JSON.stringify({ error: err.message, kind: err.kind }) });
      }
    });
  });

  // ------------------------------------------------------------------ admin: preview, proposals
  app.get("/api/admin/cases/:id", (c) => {
    const denied = adminGate(c);
    if (denied) return denied;
    if (c.req.header("x-spoilers") !== "yes") return c.json({ error: "Preview reveals answers. Confirm spoilers." }, 412);
    const cs = getCase(c.req.param("id"));
    if (!cs) return c.json({ error: "Not found." }, 404);
    return c.json({ case: cs, issues: validateCase(cs, INVESTIGATION_SET) });
  });

  app.get("/api/admin/cases", (c) => {
    const denied = adminGate(c);
    if (denied) return denied;
    return c.json([...CASES, ...approvedGeneratedCases()].map((cs) => ({ ...summary(cs), modules: cs.modules, issues: validateCase(cs, INVESTIGATION_SET).length, version: cs.version })));
  });

  app.get("/api/proposals", (c) => {
    const rows = db.prepare("SELECT * FROM proposals ORDER BY created_at DESC").all() as Record<string, unknown>[];
    return c.json(rows.map((r) => ({ ...r, payload: JSON.parse(r.payload as string), evidence: JSON.parse(r.evidence as string) })));
  });

  function validateProposal(kind: string, payload: unknown): { ok: true; data: unknown } | { ok: false; errors: string[] } {
    if (kind === "case") {
      const p = caseSchema.safeParse(payload);
      if (!p.success) return { ok: false, errors: p.error.issues.slice(0, 10).map((i) => `${i.path.join(".")}: ${i.message}`) };
      const issues = validateCase(p.data as CaseDef, INVESTIGATION_SET).filter((i) => i.severity === "error");
      if (issues.length) return { ok: false, errors: issues.map((i) => i.message) };
      if (p.data.provenance !== "synthetic") return { ok: false, errors: ["Generated cases must be labeled synthetic."] };
      return { ok: true, data: { ...p.data, review: "pending" } };
    }
    if (kind === "antibody") {
      const p = antibodyProposalSchema.safeParse(payload);
      if (!p.success) return { ok: false, errors: p.error.issues.slice(0, 10).map((i) => `${i.path.join(".")}: ${i.message}`) };
      return { ok: true, data: p.data };
    }
    return { ok: false, errors: ["Unknown proposal kind."] };
  }

  app.post("/api/proposals", async (c) => {
    const denied = adminGate(c);
    if (denied) return denied;
    const body = z.object({ kind: z.enum(["case", "antibody"]), targetId: z.string().optional(), payload: z.unknown(), evidence: z.array(z.string()).min(1) }).parse(await c.req.json());
    const v = validateProposal(body.kind, body.payload);
    if (!v.ok) return c.json({ error: "Proposal failed validation.", issues: v.errors }, 422);
    const id = randomUUID();
    db.prepare("INSERT INTO proposals (id, kind, target_id, payload, evidence, status, origin, created_at) VALUES (?, ?, ?, ?, ?, 'proposed', 'manual', ?)").run(id, body.kind, body.targetId ?? null, JSON.stringify(v.data), JSON.stringify(body.evidence), now());
    return c.json({ id });
  });

  app.post("/api/proposals/ai-draft", async (c) => {
    const denied = adminGate(c);
    if (denied) return denied;
    const gate = aiGate(c);
    if (gate) return gate;
    const body = z.object({ kind: z.enum(["case", "antibody"]), topic: z.string().min(3).max(500), sourceIds: z.array(z.string()).min(1).max(10) }).parse(await c.req.json());
    try {
      const schema = body.kind === "case" ? caseSchema : antibodyProposalSchema;
      const instructions =
        body.kind === "case"
          ? `Draft one synthetic case. Allowed investigation ids: ${INVESTIGATIONS.map((i) => i.id).join(", ")}.`
          : "Draft one antibody reference entry or revision. evidenceCited must list only the provided source ids.";
      const data = await ai.json("author", sessionId(c), authorSystem(body.sourceIds), [{ role: "user", content: `${instructions}\n${wrapUntrusted("topic", body.topic)}` }], schema as z.ZodType<unknown>, body.kind);
      const v = validateProposal(body.kind, data);
      if (!v.ok) return c.json({ error: "The generated draft failed validation and was not stored.", issues: v.errors }, 422);
      if (body.kind === "antibody") {
        const cited = (v.data as { evidenceCited: string[] }).evidenceCited;
        const unknown = cited.filter((x) => !body.sourceIds.includes(x));
        if (unknown.length) return c.json({ error: "The draft cited sources outside the provided list and was rejected.", issues: unknown }, 422);
      }
      const id = randomUUID();
      db.prepare("INSERT INTO proposals (id, kind, target_id, payload, evidence, status, origin, created_at) VALUES (?, ?, ?, ?, ?, 'proposed', 'ai-draft', ?)").run(id, body.kind, null, JSON.stringify(v.data), JSON.stringify(body.sourceIds), now());
      return c.json({ id });
    } catch (e) {
      return aiErrorResponse(c, e);
    }
  });

  app.post("/api/proposals/:id/decision", async (c) => {
    const denied = adminGate(c);
    if (denied) return denied;
    const body = z.object({ status: z.enum(["approved", "rejected", "changes-requested"]), reviewer: z.string().min(1).max(80), note: z.string().max(2000).optional() }).parse(await c.req.json());
    const row = db.prepare("SELECT kind, payload FROM proposals WHERE id = ?").get(c.req.param("id")) as { kind: string; payload: string } | undefined;
    if (!row) return c.json({ error: "Not found." }, 404);
    if (body.status === "approved") {
      const v = validateProposal(row.kind, JSON.parse(row.payload));
      if (!v.ok) return c.json({ error: "Cannot approve: the proposal no longer validates.", issues: v.errors }, 422);
      if (row.kind === "case") {
        const approved = { ...(v.data as CaseDef), review: "reviewed" };
        db.prepare("UPDATE proposals SET payload = ? WHERE id = ?").run(JSON.stringify(approved), c.req.param("id"));
      }
    }
    db.prepare("UPDATE proposals SET status = ?, reviewer = ?, note = ?, decided_at = ? WHERE id = ?").run(body.status, body.reviewer, body.note ?? null, now(), c.req.param("id"));
    return c.json({ ok: true });
  });

  app.get("/api/reference/approved-antibodies", (c) => {
    const rows = db.prepare("SELECT payload, reviewer, decided_at FROM proposals WHERE kind = 'antibody' AND status = 'approved' ORDER BY decided_at ASC").all() as { payload: string; reviewer: string; decided_at: number }[];
    return c.json(rows.map((r) => ({ entry: JSON.parse(r.payload), reviewer: r.reviewer, approvedAt: r.decided_at })));
  });

  // Aggregate counts only, so coverage reporting cannot reveal which case maps to which module.
  app.get("/api/coverage", (c) => {
    const all = [...CASES, ...approvedGeneratedCases()];
    const byModule: Record<string, { full: number; speed: number }> = {};
    for (const cs of all) {
      for (const m of cs.modules) {
        byModule[m] ??= { full: 0, speed: 0 };
        if (cs.modes.includes("speed")) byModule[m].speed++;
        else byModule[m].full++;
      }
    }
    const review = { reviewed: 0, pending: 0, "changes-requested": 0 } as Record<string, number>;
    for (const cs of all) review[cs.review] = (review[cs.review] ?? 0) + 1;
    return c.json({ cases: all.length, byModule, review, synthetic: all.filter((x) => x.provenance === "synthetic").length });
  });

  app.get("/api/investigations/:id", (c) => {
    const inv = INVESTIGATION_BY_ID.get(c.req.param("id"));
    return inv ? c.json(inv) : c.json({ error: "Not found." }, 404);
  });

  return app;
}
