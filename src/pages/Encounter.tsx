import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { EncounterView, EncEvent } from "../lib/encounterTypes";
import type { NeuraxisRegion } from "../../shared/types";
import { api } from "../lib/api";
import { useAIStatus } from "../lib/hooks";
import { useLearner, update, setResume, recordAttempt } from "../lib/store";
import { INTENTS, MANEUVERS, EXAM_GROUP_LABELS, INVESTIGATIONS, ACTIONS, MODULE_BY_ID, SOURCE_BY_ID } from "../lib/content";
import { REGION_LABELS } from "../../shared/grading";
import { Schematic } from "../components/Schematic";
import { ReviewBadge } from "../components/Provenance";
import { TutorChat } from "../components/TutorChat";
import { Bar, ErrorNote } from "../components/Bits";
import { gradeToAttempts } from "../lib/caseAttempts";

type Tab = "patient" | "exam" | "orders" | "actions" | "ddx" | "submit";

export function EventItem({ e }: { e: EncEvent }) {
  const cls = e.kind === "result" ? `result ${e.abnormal ? "abnormal" : ""}` : e.kind === "presentation" ? "result" : e.kind;
  return (
    <div className={`msg ${cls}`}>
      {e.kind !== "presentation" && <span className="t">T+{e.t}m</span>}
      {e.kind === "patient" && e.ai && <span className="badge gray" style={{ marginRight: 6 }}>AI phrasing</span>}
      <span>{e.text}</span>
      {e.values && e.values.length > 0 && (
        <table className="data" style={{ marginTop: 6 }}>
          <tbody>
            {e.values.map((v) => (
              <tr key={v.analyte}>
                <td>{v.analyte}</td>
                <td className={v.flag ? `flag-${v.flag}` : ""}>
                  {v.value} {v.unit ?? ""} {v.flag ? `(${v.flag})` : ""}
                </td>
                <td className="muted">{v.ref ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {e.report && <p className="small" style={{ margin: "6px 0 0" }}>{e.report}</p>}
      {e.schematic && <Schematic s={e.schematic} />}
    </div>
  );
}

export function Encounter() {
  const { id } = useParams();
  const s = useLearner();
  const ai = useAIStatus();
  const [v, setV] = useState<EncounterView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("patient");
  const [busy, setBusy] = useState(false);
  const [question, setQuestion] = useState("");
  const [useAI, setUseAI] = useState(false);
  const [examSel, setExamSel] = useState<string[]>([]);
  const [orderSel, setOrderSel] = useState<string[]>([]);
  const [orderQuery, setOrderQuery] = useState("");
  const [ddx, setDdx] = useState<string[]>([]);
  const [ddxInput, setDdxInput] = useState("");
  const [sub, setSub] = useState({ endpoint: "diagnosis", diagnosis: "", localization: "", reasoning: "", nextSteps: "", keyFindings: [] as string[] });
  const [interp, setInterp] = useState<Record<string, string>>({});
  const [note, setNote] = useState<string | null>(null);
  const timelineEnd = useRef<HTMLDivElement>(null);

  const load = (data: EncounterView) => {
    setV(data);
    setDdx((d) => (d.length ? d : data.ddx.map((x) => x.label)));
    if (data.note) setNote(data.note);
  };

  useEffect(() => {
    api<EncounterView>(`/api/encounters/${id}`).then(load).catch((e) => setError(e.message));
  }, [id]);

  useEffect(() => {
    if (v && v.status !== "submitted") setResume(`/encounter/${v.id}`, `Encounter: ${v.case.label}`);
    timelineEnd.current?.scrollIntoView({ block: "nearest" });
  }, [v?.events.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Record graded dimensions as learner evidence exactly once.
  useEffect(() => {
    if (!v?.grade || !id) return;
    const known = s.encounters[id];
    if (known?.submitted) return;
    for (const input of gradeToAttempts(v.caseId ?? id, v.grade, v.mode)) recordAttempt(input);
    update((x) => ({ ...x, resume: null, encounters: { ...x.encounters, [id]: { ...(x.encounters[id] ?? { caseLabel: v.case.label, mode: v.mode, startedAt: Date.now() }), submitted: true } } }));
  }, [v?.grade]); // eslint-disable-line react-hooks/exhaustive-deps

  const call = async (path: string, json: unknown) => {
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      load(await api<EncounterView>(`/api/encounters/${id}/${path}`, { method: "POST", json }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const filteredInv = useMemo(() => {
    const q = orderQuery.trim().toLowerCase();
    return INVESTIGATIONS.filter((i) => !q || i.name.toLowerCase().includes(q) || i.aliases.some((a) => a.toLowerCase().includes(q)));
  }, [orderQuery]);

  if (error && !v) return <ErrorNote error={error} />;
  if (!v) return <p className="muted">Loading encounter...</p>;
  const active = v.status === "active";
  const ordered = new Set(v.events.filter((e) => e.kind === "order").map((e) => e.ref));
  const examined = new Set(v.events.filter((e) => e.kind === "exam").map((e) => e.ref));
  const examMinutes = examSel.reduce((t, mId) => t + (MANEUVERS.find((m) => m.id === mId)?.minutes ?? 1), 0);

  return (
    <div className="stack">
      <div className="small">
        <Link to="/cases">Cases</Link> / {v.case.label}
      </div>
      <div className="row between">
        <h1 style={{ margin: 0 }}>{v.case.label}</h1>
        <div className="row">
          <ReviewBadge provenance={v.case.provenance} status={v.case.review} />
          <span className="badge blue">{v.mode}</span>
        </div>
      </div>
      <p className="small muted" style={{ margin: 0 }}>
        {v.case.age}-year-old {v.case.sex}, {v.case.setting}. {v.case.speaker === "family" ? `History from family. ${v.case.speakerNote ?? ""}` : ""}
      </p>
      {v.case.adaptation && <p className="small">Adapted from {v.case.adaptation.source} ({v.case.adaptation.license}). Altered: {v.case.adaptation.altered.join("; ")}.</p>}

      <div className="card tight row between" aria-live="polite">
        <span>
          <strong className="mono">T+{v.simMinutes} min</strong> <span className="small muted">simulated time</span>
          {v.pendingOrders.length > 0 && <span className="badge amber" style={{ marginLeft: 8 }}>{v.pendingOrders.length} result{v.pendingOrders.length > 1 ? "s" : ""} pending</span>}
        </span>
        {active && (
          <span className="row">
            <span className="tiny muted">Simulation fast-forward:</span>
            {[5, 15, 60, 240].map((m) => (
              <button key={m} className="btn small" disabled={busy} onClick={() => call("wait", { minutes: m })}>
                +{m >= 60 ? `${m / 60}h` : `${m}m`}
              </button>
            ))}
          </span>
        )}
      </div>

      <div className="grid two" style={{ alignItems: "start" }}>
        <section className="card" aria-label="Encounter timeline" style={{ maxHeight: "70vh", overflow: "auto" }}>
          <div className="timeline">
            {v.events.map((e, i) => (
              <EventItem key={i} e={e} />
            ))}
            <div ref={timelineEnd} />
          </div>
        </section>

        <section aria-label="Clinical controls">
          {active && (
            <div className="tabs" role="tablist">
              {(
                [
                  ["patient", "History"],
                  ["exam", "Exam"],
                  ["orders", "Orders"],
                  ["actions", "Actions"],
                  ["ddx", "Differential"],
                  ["submit", "Submit"],
                ] as [Tab, string][]
              ).map(([k, l]) => (
                <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>
                  {l}
                </button>
              ))}
            </div>
          )}
          <ErrorNote error={error} />
          {note && <div className="notice small">{note}</div>}

          {active && tab === "patient" && (
            <div className="card stack">
              <form
                className="row"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (question.trim()) {
                    void call("ask", { question, useAI });
                    setQuestion("");
                  }
                }}
              >
                <input className="input" style={{ flex: 1 }} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder={`Ask the ${v.case.speaker === "family" ? "family member" : "patient"} a question`} aria-label="Question for the patient" maxLength={500} />
                <button className="btn primary" disabled={busy || !question.trim()}>
                  Ask
                </button>
              </form>
              {ai?.mode === "live" && (
                <label className="row small">
                  <input type="checkbox" checked={useAI} onChange={(e) => setUseAI(e.target.checked)} /> Natural AI phrasing (the patient still only knows their own history)
                </label>
              )}
              <p className="small muted" style={{ margin: 0 }}>The patient knows symptoms and history, not exam findings or test results. Each question uses 1 simulated minute.</p>
              {(["presenting", "neuro", "systemic", "background"] as const).map((g) => (
                <div key={g}>
                  <div className="small muted">{{ presenting: "Presenting complaint", neuro: "Neurological symptoms", systemic: "Systemic", background: "Background" }[g]}</div>
                  <div className="row">
                    {INTENTS.filter((i) => i.group === g).map((i) => (
                      <button key={i.id} className="chip" disabled={busy} onClick={() => call("ask", { intent: i.id })} title={i.ask}>
                        {i.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {active && tab === "exam" && (
            <div className="card stack">
              {Object.entries(EXAM_GROUP_LABELS).map(([g, label]) => (
                <div key={g}>
                  <div className="small muted">{label}</div>
                  <div className="row">
                    {MANEUVERS.filter((m) => m.group === g).map((m) => {
                      const on = examSel.includes(m.id);
                      return (
                        <button key={m.id} className={`chip ${on ? "selected" : ""}`} aria-pressed={on} title={`${m.tests} (${m.minutes} min)`} onClick={() => setExamSel(on ? examSel.filter((x) => x !== m.id) : [...examSel, m.id])}>
                          {examined.has(m.id) ? "✓ " : ""}
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <button className="btn primary" disabled={busy || !examSel.length} onClick={() => { void call("exam", { maneuvers: examSel }); setExamSel([]); }}>
                Examine {examSel.length || ""} ({examMinutes} min)
              </button>
            </div>
          )}

          {active && tab === "orders" && (
            <div className="card stack">
              <input className="input" value={orderQuery} onChange={(e) => setOrderQuery(e.target.value)} placeholder="Search investigations (for example LP, CTA, AChR)" aria-label="Search investigations" />
              <div style={{ maxHeight: 360, overflow: "auto" }}>
                {filteredInv.map((inv) => {
                  const on = orderSel.includes(inv.id);
                  const done = ordered.has(inv.id);
                  return (
                    <button key={inv.id} className={`option ${on ? "selected" : ""}`} disabled={done} aria-pressed={on} onClick={() => setOrderSel(on ? orderSel.filter((x) => x !== inv.id) : [...orderSel, inv.id])}>
                      <span style={{ flex: 1 }}>
                        <strong>{inv.name}</strong> {done && <span className="badge gray">ordered</span>}
                        <span className="tiny muted" style={{ display: "block" }}>
                          {inv.question} Turnaround: {inv.turnaroundNote.replace(/\.$/, "")}. Cost {"$".repeat(inv.cost)}.
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="tiny muted">Results arrive after realistic turnaround times. Unnecessary tests never raise your score. <Link to="/reference?tab=investigations">Investigation guide</Link></p>
              <button className="btn primary" disabled={busy || !orderSel.length} onClick={() => { void call("order", { investigations: orderSel }); setOrderSel([]); }}>
                Order {orderSel.length || ""}
              </button>
            </div>
          )}

          {active && tab === "actions" && (
            <div className="card stack">
              <p className="small muted" style={{ margin: 0 }}>Actions happen at the current simulated time and can run alongside pending investigations.</p>
              {(["stabilize", "treat", "monitor", "consult", "disposition"] as const).map((cat) => (
                <div key={cat}>
                  <div className="small muted" style={{ textTransform: "capitalize" }}>{cat}</div>
                  {ACTIONS.filter((a) => a.category === cat).map((a) => {
                    const done = v.actions.some((x) => x.id === a.id);
                    return (
                      <div key={a.id} className="row between" style={{ padding: "4px 0", borderBottom: "1px solid var(--border)" }}>
                        <span className="small">
                          {a.label} {done && <span className="badge green">done</span>}
                          <span className="tiny muted" style={{ display: "block" }}>{a.note}</span>
                        </span>
                        <button className="btn small" disabled={busy} onClick={() => call("action", { action: a.id })}>
                          Do
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {active && tab === "ddx" && (
            <div className="card stack">
              <p className="small muted" style={{ margin: 0 }}>Rank your differential. Revise it as results arrive; revisions are tracked.</p>
              <form className="row" onSubmit={(e) => { e.preventDefault(); if (ddxInput.trim()) { setDdx([...ddx, ddxInput.trim()]); setDdxInput(""); } }}>
                <input className="input" style={{ flex: 1 }} value={ddxInput} onChange={(e) => setDdxInput(e.target.value)} placeholder="Add a diagnosis or syndrome" aria-label="Add to differential" />
                <button className="btn">Add</button>
              </form>
              <ol style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
                {ddx.map((d, i) => (
                  <li key={`${d}-${i}`} className="option" style={{ alignItems: "center" }}>
                    <span className="key">{i + 1}</span>
                    <span style={{ flex: 1 }}>{d}</span>
                    <button className="btn small" aria-label={`Move ${d} up`} disabled={i === 0} onClick={() => { const n = [...ddx]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; setDdx(n); }}>Up</button>
                    <button className="btn small" aria-label={`Remove ${d}`} onClick={() => setDdx(ddx.filter((_, k) => k !== i))}>Remove</button>
                  </li>
                ))}
              </ol>
              <button className="btn primary" disabled={busy} onClick={() => call("ddx", { labels: ddx })}>
                Save differential
              </button>
            </div>
          )}

          {active && tab === "submit" && (
            <div className="card stack">
              <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
                <legend className="field">What can the evidence support?</legend>
                <div className="row">
                  {[
                    ["diagnosis", "A specific diagnosis"],
                    ["syndrome", "A syndrome"],
                    ["ranked-differential", "A ranked differential"],
                    ["further-evaluation", "Needs further evaluation"],
                  ].map(([k, l]) => (
                    <button key={k} className={`chip ${sub.endpoint === k ? "selected" : ""}`} aria-pressed={sub.endpoint === k} onClick={() => setSub({ ...sub, endpoint: k })}>
                      {l}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div>
                <label className="field" htmlFor="dx">Leading diagnosis or syndrome</label>
                <input id="dx" className="input" value={sub.diagnosis} onChange={(e) => setSub({ ...sub, diagnosis: e.target.value })} placeholder="Spelling and abbreviations are fine" />
              </div>
              <div>
                <label className="field" htmlFor="loc">Localization</label>
                <select id="loc" className="input" value={sub.localization} onChange={(e) => setSub({ ...sub, localization: e.target.value })}>
                  <option value="">Not specified</option>
                  {(Object.keys(REGION_LABELS) as NeuraxisRegion[]).map((r) => (
                    <option key={r} value={r}>{REGION_LABELS[r]}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="field">Key findings supporting your conclusion</div>
                {v.findings.length ? (
                  v.findings.map((f) => {
                    const on = sub.keyFindings.includes(f.id);
                    return (
                      <label key={f.id} className="row small" style={{ alignItems: "flex-start", padding: "3px 0", flexWrap: "nowrap" }}>
                        <input type="checkbox" checked={on} onChange={() => setSub({ ...sub, keyFindings: on ? sub.keyFindings.filter((x) => x !== f.id) : [...sub.keyFindings, f.id] })} />
                        <span><span className="badge gray">{f.source}</span> {f.text}</span>
                      </label>
                    );
                  })
                ) : (
                  <p className="small muted">You have not gathered findings yet.</p>
                )}
              </div>
              <div>
                <label className="field" htmlFor="reason">Reasoning (brief)</label>
                <textarea id="reason" className="input" value={sub.reasoning} onChange={(e) => setSub({ ...sub, reasoning: e.target.value })} />
              </div>
              <div>
                <label className="field" htmlFor="next">Next steps</label>
                <textarea id="next" className="input" value={sub.nextSteps} onChange={(e) => setSub({ ...sub, nextSteps: e.target.value })} placeholder="Further tests, treatment, disposition" />
              </div>
              <p className="small muted">Your differential ({ddx.length} entries) is submitted too. Time taken is shown but never scored.</p>
              <button className="btn primary" disabled={busy || !sub.diagnosis.trim()} onClick={() => call("submit", { ...sub, localization: sub.localization || undefined, differential: ddx })}>
                Submit
              </button>
            </div>
          )}

          {v.status === "interpreting" && v.interpretation && (
            <div className="card stack">
              <h2>Interpretation</h2>
              <p className="small muted">Your diagnosis is locked in. Interpret these results; some may be ones you did not order.</p>
              {v.interpretation.map((q) => (
                <div key={q.id} className="stack">
                  <EventItem e={{ t: v.simMinutes, kind: "result", text: q.result.text, values: q.result.values, schematic: q.result.schematic, report: q.result.report }} />
                  {!q.orderedByLearner && <span className="tiny muted">You did not order this test; it is shown for interpretation practice.</span>}
                  <label className="field" htmlFor={`i-${q.id}`}>{q.question}</label>
                  <textarea id={`i-${q.id}`} className="input" value={interp[q.id] ?? ""} onChange={(e) => setInterp({ ...interp, [q.id]: e.target.value })} />
                </div>
              ))}
              <button className="btn primary" disabled={busy} onClick={() => call("interpret", { answers: interp })}>
                Submit interpretation
              </button>
            </div>
          )}

          {v.status === "submitted" && v.grade && <Debrief v={v} />}
        </section>
      </div>
    </div>
  );
}

const DIM_LABELS: Record<string, string> = {
  diagnosis: "Diagnosis",
  reasoning: "Reasoning",
  actions: "Urgent actions",
  investigations: "Investigation selection",
  interpretation: "Interpretation",
  localization: "Localization",
};

export function Debrief({ v }: { v: EncounterView }) {
  const g = v.grade!;
  const d = g.debrief;
  return (
    <div className="stack">
      <div className="card accent">
        <div className="row between">
          <h2 style={{ margin: 0 }}>Debrief</h2>
          <strong>{Math.round(g.overall * 100)}%</strong>
        </div>
        <p style={{ margin: "6px 0" }}>
          <span className="muted">Case answer ({d.endpoint.replace("-", " ")}):</span> <strong>{d.diagnosisLabel}</strong>
        </p>
        <p className="small muted" style={{ margin: 0 }}>
          A vignette like this supports a diagnosis; it does not prove one. Simulated time {g.simMinutes} min{g.fastForwardMinutes ? `, of which ${g.fastForwardMinutes} fast-forwarded` : ""}. Time is not scored.
        </p>
      </div>
      {Object.entries(g.dimensions)
        .filter(([, x]) => x.weight > 0)
        .map(([k, x]) => (
          <div key={k} className="card tight">
            <div className="row between">
              <strong>{DIM_LABELS[k]}</strong>
              <span>{Math.round(x.score * 100)}%</span>
            </div>
            <Bar value={x.score} label={`${DIM_LABELS[k]} score`} tone={x.score >= 0.8 ? "green" : "teal"} />
            <p className="small" style={{ margin: "6px 0 0" }}>{x.summary}</p>
            {x.details.length > 0 && (
              <details open={x.details.length <= 2}>
                <summary className="small">{x.details.length} detail{x.details.length > 1 ? "s" : ""}</summary>
                <ul className="small" style={{ margin: "4px 0 0", paddingLeft: 18 }}>
                  {x.details.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        ))}
      {d.speedExplanation && (
        <div className="card">
          <h3>Why</h3>
          <p className="small">{d.speedExplanation}</p>
        </div>
      )}
      <div className="card">
        <h3>Teaching points</h3>
        <ul className="small">
          {d.teachingPoints.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
        {d.localization && (
          <details>
            <summary><strong>Localization</strong></summary>
            <p className="small">{d.localization}</p>
          </details>
        )}
        {d.urgent.length > 0 && (
          <details>
            <summary><strong>Time-critical actions</strong></summary>
            <ul className="small">
              {d.urgent.map((u, i) => (
                <li key={i}>
                  {u.met ? "Done" : "Missed"}: {u.label}
                  {u.at !== undefined ? ` at T+${u.at}m` : ""}
                  {u.deadline !== undefined ? ` (target by T+${u.deadline}m)` : ""}. <span className="muted">{u.why}</span>
                </li>
              ))}
            </ul>
          </details>
        )}
        {d.results.length > 0 && (
          <details>
            <summary><strong>What the results meant</strong></summary>
            <ul className="small">
              {d.results.map((r) => (
                <li key={r.investigation}>
                  <strong>{r.name}:</strong> {r.interpretation}
                </li>
              ))}
            </ul>
          </details>
        )}
        <p className="tiny muted">
          Modules: {d.modules.map((m) => MODULE_BY_ID.get(m)?.title ?? m).join(", ")}. Sources:{" "}
          {d.sources.length
            ? d.sources.map((sid, i) => {
                const src = SOURCE_BY_ID.get(sid);
                return (
                  <span key={sid}>
                    {i > 0 && "; "}
                    {src ? <a href={src.url} target="_blank" rel="noreferrer">{src.authors.split(",")[0]} {src.year}</a> : sid}
                  </span>
                );
              })
            : "general teaching principles (no registry source)"}
          .
        </p>
        {g.notes.map((n, i) => (
          <p key={i} className="tiny muted">{n}</p>
        ))}
      </div>
      {v.visits && v.visits.length > 0 && <Visits encounterId={v.id} total={v.visits.length} />}
      <div className="card">
        <h3>Discuss with the AI tutor</h3>
        <TutorChat kind="encounter" encounterId={v.id} starter="What was the most important thing I missed, and why?" />
      </div>
      <Link className="btn primary" to="/cases">
        Next case
      </Link>
    </div>
  );
}

function Visits({ encounterId, total }: { encounterId: string; total: number }) {
  const [n, setN] = useState(0);
  const [visit, setVisit] = useState<{ label: string; intervalNote: string; update: string; question: string; answered: { answer: string; score: number; feedback: string } | null; modelAnswer?: string } | null>(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<{ score: number; feedback: string; modelAnswer: string } | null>(null);
  useEffect(() => {
    setResult(null);
    setAnswer("");
    api<typeof visit>(`/api/encounters/${encounterId}/visits/${n}`).then(setVisit).catch(() => setVisit(null));
  }, [encounterId, n]);
  if (!visit) return null;
  const done = result ?? (visit.answered ? { ...visit.answered, modelAnswer: visit.modelAnswer ?? "" } : null);
  return (
    <div className="card teal stack">
      <div className="row between">
        <h3 style={{ margin: 0 }}>Follow-up: {visit.label}</h3>
        <span className="small muted">Visit {n + 2} of {total + 1}</span>
      </div>
      <p className="small muted" style={{ margin: 0 }}>{visit.intervalNote}</p>
      <p>{visit.update}</p>
      <label className="field" htmlFor="visit-a">{visit.question}</label>
      <textarea id="visit-a" className="input" value={visit.answered && !result ? visit.answered.answer : answer} disabled={!!done} onChange={(e) => setAnswer(e.target.value)} />
      {!done ? (
        <button className="btn primary" disabled={!answer.trim()} onClick={async () => setResult(await api(`/api/encounters/${encounterId}/visits/${n}`, { method: "POST", json: { answer } }))}>
          Submit
        </button>
      ) : (
        <div className={`feedback ${done.score >= 0.8 ? "good" : done.score > 0 ? "partial" : "bad"}`}>
          <p>{done.feedback}</p>
          <p className="small"><span className="muted">Model answer:</span> {done.modelAnswer}</p>
        </div>
      )}
      {done && n < total - 1 && (
        <button className="btn" onClick={() => setN(n + 1)}>
          Next visit
        </button>
      )}
    </div>
  );
}
