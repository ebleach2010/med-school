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
import { FocusShell } from "../components/FocusShell";
import { Sheet } from "../components/Sheet";
import { Icon, Ring, type IconName } from "../components/Icon";
import { gradeToAttempts } from "../lib/caseAttempts";

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

type Panel = "ask" | "exam" | "orders" | "actions" | "ddx" | "wait" | "submit";

const DOCK: { k: Panel; label: string; icon: IconName }[] = [
  { k: "ask", label: "Ask", icon: "chat" },
  { k: "exam", label: "Examine", icon: "steth" },
  { k: "orders", label: "Order", icon: "flask" },
  { k: "actions", label: "Treat", icon: "pill" },
  { k: "ddx", label: "Ddx", icon: "list" },
];

const PANEL_TITLES: Record<Panel, string> = {
  ask: "Ask a question",
  exam: "Examine",
  orders: "Order tests",
  actions: "Treat and manage",
  ddx: "Your differential",
  wait: "Let time pass",
  submit: "Submit your assessment",
};

export function Encounter() {
  const { id } = useParams();
  const s = useLearner();
  const ai = useAIStatus();
  const [v, setV] = useState<EncounterView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [panel, setPanel] = useState<Panel | null>(null);
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
    timelineEnd.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [v?.events.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Record graded dimensions as learner evidence exactly once.
  useEffect(() => {
    if (!v?.grade || !id) return;
    const known = s.encounters[id];
    if (known?.submitted) return;
    for (const input of gradeToAttempts(v.caseId ?? id, v.grade, v.mode)) recordAttempt(input);
    update((x) => ({ ...x, resume: null, encounters: { ...x.encounters, [id]: { ...(x.encounters[id] ?? { caseLabel: v.case.label, mode: v.mode, startedAt: Date.now() }), submitted: true } } }));
  }, [v?.grade]); // eslint-disable-line react-hooks/exhaustive-deps

  const call = async (path: string, json: unknown, closePanel = true) => {
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      load(await api<EncounterView>(`/api/encounters/${id}/${path}`, { method: "POST", json }));
      if (closePanel) setPanel(null);
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
  const who = v.case.speaker === "family" ? "family member" : "patient";

  const header = (
    <div className="enc-head grow">
      <div className="grow">
        <div className="title">{v.case.label}</div>
        <div className="sub" aria-live="polite">
          <span className="mono">T+{v.simMinutes}m</span>
          {v.pendingOrders.length > 0 && ` · ${v.pendingOrders.length} result${v.pendingOrders.length > 1 ? "s" : ""} pending`}
          {` · ${v.mode}`}
        </div>
      </div>
      {active && (
        <>
          <button className="icon-btn" aria-label="Let time pass" onClick={() => setPanel("wait")}>
            <Icon name="clock" />
          </button>
          <button className="btn green small" onClick={() => setPanel("submit")}>
            Submit
          </button>
        </>
      )}
    </div>
  );

  return (
    <FocusShell closeTo="/cases" closeLabel="Leave encounter (progress is kept)" top={header}>
      <div className="row small faint" style={{ gap: 6, marginBottom: 10 }}>
        <ReviewBadge provenance={v.case.provenance} status={v.case.review} />
        <span>
          {v.case.age}-year-old {v.case.sex}, {v.case.setting}.
        </span>
        {v.case.speaker === "family" && <span>History from family. {v.case.speakerNote ?? ""}</span>}
      </div>
      {v.case.adaptation && <p className="tiny faint">Adapted from {v.case.adaptation.source} ({v.case.adaptation.license}). Altered: {v.case.adaptation.altered.join("; ")}.</p>}

      <section className="timeline" aria-label="Encounter timeline">
        {v.events.map((e, i) => (
          <EventItem key={i} e={e} />
        ))}
        <div ref={timelineEnd} style={{ scrollMarginBottom: active ? 170 : 20 }} />
      </section>
      <ErrorNote error={error} />
      {note && <div className="notice" style={{ marginTop: 10 }}>{note}</div>}

      {v.status === "interpreting" && v.interpretation && (
        <div className="section">
          <h2>Interpret the results</h2>
          <p className="small muted">Your diagnosis is locked in. Some of these you may not have ordered.</p>
          <div className="stack">
            {v.interpretation.map((q) => (
              <div key={q.id} className="card tight stack-sm">
                <EventItem e={{ t: v.simMinutes, kind: "result", text: q.result.text, values: q.result.values, schematic: q.result.schematic, report: q.result.report }} />
                {!q.orderedByLearner && <span className="tiny faint">Shown for interpretation practice; you did not order it.</span>}
                <label className="field" htmlFor={`i-${q.id}`}>{q.question}</label>
                <textarea id={`i-${q.id}`} className="input" value={interp[q.id] ?? ""} onChange={(e) => setInterp({ ...interp, [q.id]: e.target.value })} />
              </div>
            ))}
          </div>
          <button className="btn primary block lg" style={{ marginTop: 12 }} disabled={busy} onClick={() => call("interpret", { answers: interp })}>
            Submit interpretation
          </button>
        </div>
      )}

      {v.status === "submitted" && v.grade && (
        <div className="section">
          <Debrief v={v} />
        </div>
      )}

      {active && (
        <div className="dock">
          <div className="dock-inner">
            <form
              className="ask-row"
              onSubmit={(e) => {
                e.preventDefault();
                if (question.trim()) {
                  void call("ask", { question, useAI });
                  setQuestion("");
                }
              }}
            >
              <input className="input" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder={`Ask the ${who}...`} aria-label={`Question for the ${who}`} maxLength={500} />
              <button className="btn primary" disabled={busy || !question.trim()} aria-label="Send question">
                <Icon name="send" />
              </button>
            </form>
            <div className="dock-tabs" role="group" aria-label="Clinical tools">
              {DOCK.map((d) => (
                <button key={d.k} aria-pressed={panel === d.k} onClick={() => setPanel(d.k)}>
                  <Icon name={d.icon} />
                  {d.label}
                  {d.k === "ddx" && ddx.length > 0 ? ` (${ddx.length})` : ""}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {panel && active && (
        <Sheet
          title={PANEL_TITLES[panel]}
          onClose={() => setPanel(null)}
          footer={
            panel === "exam" ? (
              <button className="btn primary block" disabled={busy || !examSel.length} onClick={() => { void call("exam", { maneuvers: examSel }); setExamSel([]); }}>
                Examine {examSel.length || ""} {examSel.length ? `(${examMinutes} min)` : ""}
              </button>
            ) : panel === "orders" ? (
              <button className="btn primary block" disabled={busy || !orderSel.length} onClick={() => { void call("order", { investigations: orderSel }); setOrderSel([]); }}>
                Order {orderSel.length || ""}
              </button>
            ) : panel === "ddx" ? (
              <button className="btn primary block" disabled={busy} onClick={() => call("ddx", { labels: ddx })}>
                Save differential
              </button>
            ) : panel === "submit" ? (
              <button className="btn green block lg" disabled={busy || !sub.diagnosis.trim()} onClick={() => call("submit", { ...sub, localization: sub.localization || undefined, differential: ddx })}>
                Submit
              </button>
            ) : undefined
          }
        >
          {panel === "ask" && (
            <div className="stack">
              {ai?.mode === "live" && (
                <label className="row small">
                  <input type="checkbox" checked={useAI} onChange={(e) => setUseAI(e.target.checked)} /> Natural AI phrasing (the {who} still only knows their own history)
                </label>
              )}
              <p className="small faint" style={{ margin: 0 }}>Tap a question or type your own below. The {who} knows symptoms and history, not exam findings or results. Each question takes 1 simulated minute.</p>
              {(["presenting", "neuro", "systemic", "background"] as const).map((g) => (
                <div key={g}>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>{{ presenting: "Presenting complaint", neuro: "Neurological", systemic: "Systemic", background: "Background" }[g]}</div>
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

          {panel === "exam" && (
            <div className="stack">
              {Object.entries(EXAM_GROUP_LABELS).map(([g, label]) => (
                <div key={g}>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>{label}</div>
                  <div className="row">
                    {MANEUVERS.filter((m) => m.group === g).map((m) => {
                      const on = examSel.includes(m.id);
                      return (
                        <button key={m.id} className={`chip ${!on && examined.has(m.id) ? "correct" : ""}`} aria-pressed={on} title={`${m.tests} (${m.minutes} min)`} onClick={() => setExamSel(on ? examSel.filter((x) => x !== m.id) : [...examSel, m.id])}>
                          {examined.has(m.id) && <Icon name="check" size={14} />}
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {panel === "orders" && (
            <div className="stack-sm">
              <input className="input" value={orderQuery} onChange={(e) => setOrderQuery(e.target.value)} placeholder="Search (for example LP, CTA, AChR)" aria-label="Search investigations" />
              <p className="tiny faint">Results arrive after realistic turnaround times. Unnecessary tests never raise your score. <Link to="/reference?tab=investigations">Test guide</Link></p>
              <div className="list">
                {filteredInv.map((inv) => {
                  const on = orderSel.includes(inv.id);
                  const done = ordered.has(inv.id);
                  return (
                    <button key={inv.id} className={`list-row ${on ? "current" : ""}`} style={{ minHeight: 52, padding: "8px 12px" }} disabled={done} aria-pressed={on} onClick={() => setOrderSel(on ? orderSel.filter((x) => x !== inv.id) : [...orderSel, inv.id])}>
                      <div className="grow">
                        <div className="title small">
                          {inv.name} {done && <span className="badge gray">ordered</span>}
                        </div>
                        <div className="sub">
                          {inv.turnaroundNote.replace(/\.$/, "")} · {"$".repeat(inv.cost)}
                        </div>
                      </div>
                      {on && (
                        <span style={{ color: "var(--blue)" }}>
                          <Icon name="check" size={18} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {panel === "actions" && (
            <div className="stack">
              <p className="small faint" style={{ margin: 0 }}>Actions happen now and can run alongside pending tests.</p>
              {(["stabilize", "treat", "monitor", "consult", "disposition"] as const).map((cat) => (
                <div key={cat}>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>{cat}</div>
                  <div className="list">
                    {ACTIONS.filter((a) => a.category === cat).map((a) => {
                      const done = v.actions.some((x) => x.id === a.id);
                      return (
                        <div key={a.id} className="list-row" style={{ cursor: "default", minHeight: 52, padding: "8px 12px" }}>
                          <div className="grow">
                            <div className="title small">
                              {a.label} {done && <span className="badge green">done</span>}
                            </div>
                            <div className="sub">{a.note}</div>
                          </div>
                          <button className="btn small" disabled={busy} onClick={() => call("action", { action: a.id })}>
                            Do
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {panel === "ddx" && (
            <div className="stack-sm">
              <p className="small faint" style={{ margin: 0 }}>Rank your differential, most likely first. Revise it as results arrive; revisions are tracked.</p>
              <form className="ask-row" onSubmit={(e) => { e.preventDefault(); if (ddxInput.trim()) { setDdx([...ddx, ddxInput.trim()]); setDdxInput(""); } }}>
                <input className="input" value={ddxInput} onChange={(e) => setDdxInput(e.target.value)} placeholder="Add a diagnosis or syndrome" aria-label="Add to differential" />
                <button className="btn">Add</button>
              </form>
              <ol style={{ padding: 0, listStyle: "none", margin: 0 }}>
                {ddx.map((d, i) => (
                  <li key={`${d}-${i}`} className="option" style={{ cursor: "default", marginTop: i ? 8 : 0, minHeight: 48, padding: "6px 8px 6px 12px" }}>
                    <span className="key">{i + 1}</span>
                    <span className="grow">{d}</span>
                    <button className="icon-btn" aria-label={`Move ${d} up`} disabled={i === 0} onClick={() => { const n = [...ddx]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; setDdx(n); }}>
                      <Icon name="up" />
                    </button>
                    <button className="icon-btn" aria-label={`Remove ${d}`} onClick={() => setDdx(ddx.filter((_, k) => k !== i))}>
                      <Icon name="x" />
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {panel === "wait" && (
            <div className="stack">
              <p className="small faint" style={{ margin: 0 }}>Fast-forward the simulation to let results come back. The patient keeps evolving while you wait.</p>
              <div className="grid two">
                {[5, 15, 60, 240].map((m) => (
                  <button key={m} className="btn" disabled={busy} onClick={() => call("wait", { minutes: m })}>
                    +{m >= 60 ? `${m / 60} h` : `${m} min`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {panel === "submit" && (
            <div className="stack">
              <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
                <legend className="field">What can the evidence support?</legend>
                <div className="row">
                  {[
                    ["diagnosis", "A diagnosis"],
                    ["syndrome", "A syndrome"],
                    ["ranked-differential", "A ranked differential"],
                    ["further-evaluation", "More workup needed"],
                  ].map(([k, l]) => (
                    <button key={k} className="chip" aria-pressed={sub.endpoint === k} onClick={() => setSub({ ...sub, endpoint: k })}>
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
                <div className="field">Key findings that support it</div>
                {v.findings.length ? (
                  <div className="row">
                    {v.findings.map((f) => {
                      const on = sub.keyFindings.includes(f.id);
                      return (
                        <button key={f.id} className="chip" aria-pressed={on} onClick={() => setSub({ ...sub, keyFindings: on ? sub.keyFindings.filter((x) => x !== f.id) : [...sub.keyFindings, f.id] })}>
                          {f.text}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="small faint">No findings gathered yet.</p>
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
              <p className="tiny faint" style={{ margin: 0 }}>Your differential ({ddx.length}) is submitted too. Time is shown but never scored.</p>
            </div>
          )}
        </Sheet>
      )}
    </FocusShell>
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
      <div className="card">
        <div className="row nowrap" style={{ gap: 14 }}>
          <span style={{ position: "relative", display: "inline-grid", placeItems: "center" }}>
            <Ring value={g.overall} size={72} stroke={7} label={`Overall ${Math.round(g.overall * 100)} percent`} />
            <strong style={{ position: "absolute", fontSize: "1.05rem" }}>{Math.round(g.overall * 100)}%</strong>
          </span>
          <div className="grow">
            <div className="eyebrow">Case answer · {d.endpoint.replace("-", " ")}</div>
            <h2 style={{ margin: "2px 0 0" }}>{d.diagnosisLabel}</h2>
          </div>
        </div>
        <p className="tiny faint" style={{ margin: "10px 0 0" }}>
          A vignette like this supports a diagnosis; it does not prove one. Simulated time {g.simMinutes} min{g.fastForwardMinutes ? `, ${g.fastForwardMinutes} fast-forwarded` : ""}. Time is not scored.
        </p>
      </div>
      <div className="list">
        {Object.entries(g.dimensions)
          .filter(([, x]) => x.weight > 0)
          .map(([k, x]) => (
            <details key={k} className="list-row" style={{ display: "block", cursor: "pointer" }}>
              <summary style={{ listStyle: "none" }}>
                <div className="row between nowrap" style={{ marginBottom: 6 }}>
                  <span className="title small">{DIM_LABELS[k]}</span>
                  <strong className="small">{Math.round(x.score * 100)}%</strong>
                </div>
                <Bar value={x.score} label={`${DIM_LABELS[k]} score`} tone={x.score >= 0.8 ? "green" : "teal"} />
                <div className="sub">{x.summary}</div>
              </summary>
              {x.details.length > 0 && (
                <ul className="small" style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                  {x.details.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              )}
            </details>
          ))}
      </div>
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
      <Link className="btn primary block lg" to="/cases">
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
