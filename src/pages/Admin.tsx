import { useEffect, useMemo, useState } from "react";
import type { ContentMeta } from "../../shared/types";
import { api } from "../lib/api";
import { MODULES, LESSONS, ITEMS, INVESTIGATIONS, ANTIBODIES, SOURCES } from "../lib/content";
import { useReviewOverrides, refreshReviews } from "../lib/hooks";
import { effectiveReview, ReviewBadge } from "../components/Provenance";
import { ErrorNote } from "../components/Bits";
import { stripMarkup } from "../../shared/text";
import { STANDALONE } from "../lib/platform";

type Tab = "content" | "cases" | "proposals" | "draft";

function adminHeaders(): Record<string, string> {
  try {
    const t = sessionStorage.getItem("nt-admin-token");
    return t ? { "x-admin-token": t } : {};
  } catch {
    return {};
  }
}

interface Row {
  type: string;
  meta: ContentMeta;
  title: string;
  body: string;
}

function contentRows(): Row[] {
  return [
    ...MODULES.filter((m) => m.status !== "planned").map((m) => ({ type: "module", meta: m.meta, title: m.title, body: `${m.summary}\n\nObjectives:\n${m.objectives.map((o) => `- ${o.text}`).join("\n")}` })),
    ...LESSONS.map((l) => ({ type: "lesson", meta: l.meta, title: l.title, body: l.steps.map((s) => `## ${s.title}\n${"body" in s ? stripMarkup(s.body) : s.kind === "summary" ? s.points.join("\n") : s.kind}`).join("\n\n") })),
    ...ITEMS.map((i) => ({ type: `item (${i.format})`, meta: i.meta, title: stripMarkup(i.stem), body: `${i.vignette ? stripMarkup(i.vignette) + "\n\n" : ""}${stripMarkup(i.stem)}\n\n${JSON.stringify("options" in i ? i.options : "answer" in i ? i.answer : "correct" in i ? i.correct : "order" in i ? i.order : "", null, 1)}\n\nRationale: ${stripMarkup(i.rationale)}` })),
    ...INVESTIGATIONS.map((i) => ({ type: "investigation", meta: i.meta, title: i.name, body: `${i.question}\nIndications: ${i.indications}\nLimitations: ${i.limitations}\nPositive: ${i.positiveMeans}\nNegative: ${i.negativeMeans}` })),
    ...ANTIBODIES.map((a) => ({ type: "antibody", meta: a.meta, title: a.name, body: `${a.target}\nPhenotypes: ${a.phenotypes.join("; ")}\nSpecimen: ${a.specimen}\nMethod: ${a.method}\nFalse positives: ${a.falsePositive}\nFalse negatives: ${a.falseNegative}\nCancer: ${a.cancer}\nEvidence: ${a.evidence}` })),
  ];
}

export function Admin() {
  const [tab, setTab] = useState<Tab>("content");
  const [token, setToken] = useState(() => {
    try {
      return sessionStorage.getItem("nt-admin-token") ?? "";
    } catch {
      return "";
    }
  });
  if (STANDALONE)
    return (
      <div className="stack">
        <h1>Review workspace</h1>
        <div className="notice">Content review, case preview, and update proposals need the self-hosted version of the app, which stores review records on its server.</div>
      </div>
    );
  return (
    <div className="stack">
      <h1>Review workspace</h1>
      <div className="notice small">This area shows answer keys and hidden case details. Use a separate profile for study if you want to avoid spoilers. Approvals record who reviewed which version; nothing generated is published without approval.</div>
      <div className="row small">
        <label htmlFor="tok">Admin token (only needed if the server sets ADMIN_TOKEN)</label>
        <input id="tok" className="input" style={{ width: 220 }} type="password" value={token} onChange={(e) => { setToken(e.target.value); try { sessionStorage.setItem("nt-admin-token", e.target.value); } catch { /* ignore */ } }} />
      </div>
      <div className="tabs" role="tablist">
        {(
          [
            ["content", "Content review"],
            ["cases", "Case preview"],
            ["proposals", "Update proposals"],
            ["draft", "Draft with AI"],
          ] as [Tab, string][]
        ).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>
            {l}
          </button>
        ))}
      </div>
      {tab === "content" && <ContentReview />}
      {tab === "cases" && <CasePreview />}
      {tab === "proposals" && <Proposals />}
      {tab === "draft" && <Draft />}
    </div>
  );
}

function ReviewForm({ contentId, version, onDone }: { contentId: string; version: number; onDone: () => void }) {
  const [reviewer, setReviewer] = useState(() => localStorage.getItem("nt-reviewer") ?? "");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const send = async (status: "reviewed" | "changes-requested" | "pending") => {
    setError(null);
    try {
      localStorage.setItem("nt-reviewer", reviewer);
      await api("/api/reviews", { method: "POST", json: { contentId, version, status, reviewer, note: note || undefined }, headers: adminHeaders() });
      refreshReviews();
      setNote("");
      onDone();
    } catch (e) {
      setError((e as Error).message);
    }
  };
  return (
    <div className="stack">
      <div className="row">
        <input className="input" style={{ flex: "1 1 160px" }} value={reviewer} onChange={(e) => setReviewer(e.target.value)} placeholder="Reviewer name and role" aria-label="Reviewer" />
        <input className="input" style={{ flex: "2 1 240px" }} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (sources checked, changes needed)" aria-label="Review note" />
      </div>
      <div className="row">
        <button className="btn primary small" disabled={!reviewer.trim()} onClick={() => send("reviewed")}>Approve version {version}</button>
        <button className="btn small" disabled={!reviewer.trim()} onClick={() => send("changes-requested")}>Request changes</button>
        <button className="btn small ghost" disabled={!reviewer.trim()} onClick={() => send("pending")}>Reset to pending</button>
      </div>
      <ErrorNote error={error} />
    </div>
  );
}

function ContentReview() {
  const overrides = useReviewOverrides();
  const rows = useMemo(contentRows, []);
  const [filter, setFilter] = useState("pending");
  const [type, setType] = useState("");
  const [sel, setSel] = useState<Row | null>(null);
  const list = rows.filter((r) => {
    const st = effectiveReview(r.meta, overrides).status;
    return (!filter || st === filter) && (!type || r.type.startsWith(type));
  });
  return (
    <div className="grid two" style={{ alignItems: "start" }}>
      <div className="stack">
        <div className="row">
          <select className="input" style={{ width: "auto" }} value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Status filter">
            <option value="">All statuses</option>
            <option value="pending">Awaiting review</option>
            <option value="reviewed">Reviewed</option>
            <option value="changes-requested">Changes requested</option>
          </select>
          <select className="input" style={{ width: "auto" }} value={type} onChange={(e) => setType(e.target.value)} aria-label="Type filter">
            <option value="">All types</option>
            {["module", "lesson", "item", "investigation", "antibody"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <span className="small muted">{list.length} shown</span>
        </div>
        <div style={{ maxHeight: "65vh", overflow: "auto" }}>
          {list.map((r) => (
            <button key={r.meta.id} className={`option ${sel?.meta.id === r.meta.id ? "selected" : ""}`} onClick={() => setSel(r)}>
              <span style={{ flex: 1 }}>
                <span className="tiny muted">{r.type} · {r.meta.id} · v{r.meta.version}</span>
                <span style={{ display: "block" }}>{r.title.slice(0, 100)}</span>
              </span>
              <ReviewBadge provenance={r.meta.provenance} status={effectiveReview(r.meta, overrides).status} />
            </button>
          ))}
        </div>
      </div>
      {sel ? (
        <div className="card stack">
          <h2>{sel.title.slice(0, 120)}</h2>
          <pre className="small" style={{ whiteSpace: "pre-wrap", fontFamily: "var(--font)", margin: 0 }}>{sel.body}</pre>
          <div className="small">
            <strong>Sources</strong>
            <ul>
              {sel.meta.sources.map((id) => {
                const s = SOURCES.find((x) => x.id === id);
                return <li key={id}>{s ? <a href={s.url} target="_blank" rel="noreferrer">{s.citation}</a> : id}</li>;
              })}
              {!sel.meta.sources.length && <li className="muted">No citation attached.</li>}
            </ul>
          </div>
          <ReviewForm contentId={sel.meta.id} version={sel.meta.version} onDone={() => undefined} />
        </div>
      ) : (
        <p className="muted">Select an item to preview and review it.</p>
      )}
    </div>
  );
}

function CasePreview() {
  const [list, setList] = useState<{ id: string; label: string; modes: string[]; modules: string[]; issues: number; version: number; review: string; provenance: "synthetic" | "source-grounded" | "adapted-published" }[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [detail, setDetail] = useState<{ case: Record<string, unknown> & { hidden: Record<string, unknown>; version: number }; issues: { severity: string; message: string }[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    api<typeof list>("/api/admin/cases", { headers: adminHeaders() }).then(setList).catch((e) => setError(e.message));
  }, []);
  useEffect(() => {
    if (!sel) return;
    api<typeof detail>(`/api/admin/cases/${sel}`, { headers: { ...adminHeaders(), "x-spoilers": "yes" } }).then(setDetail).catch((e) => setError(e.message));
  }, [sel]);
  return (
    <div className="grid two" style={{ alignItems: "start" }}>
      <div>
        <ErrorNote error={error} />
        {list.map((c) => (
          <button key={c.id} className={`option ${sel === c.id ? "selected" : ""}`} onClick={() => setSel(c.id)}>
            <span style={{ flex: 1 }}>
              <span className="tiny muted">{c.id} · v{c.version} · {c.modes.join(", ")} · {c.issues} validation issues</span>
              <span style={{ display: "block" }}>{c.label}</span>
            </span>
            <span className="badge gray">{c.review}</span>
          </button>
        ))}
      </div>
      {detail && sel ? (
        <div className="card stack">
          <h2>Hidden state: {sel}</h2>
          {detail.issues.length > 0 && (
            <div className="feedback partial small">
              {detail.issues.map((i, k) => (
                <div key={k}>{i.severity}: {i.message}</div>
              ))}
            </div>
          )}
          <pre className="small" style={{ whiteSpace: "pre-wrap", maxHeight: "55vh", overflow: "auto" }}>{JSON.stringify(detail.case, null, 2)}</pre>
          <ReviewForm contentId={`case:${sel}`} version={detail.case.version} onDone={() => undefined} />
        </div>
      ) : (
        <p className="muted">Select a case to preview its hidden state and validation result.</p>
      )}
    </div>
  );
}

interface Proposal {
  id: string;
  kind: string;
  status: string;
  origin: string;
  created_at: number;
  evidence: string[];
  payload: Record<string, unknown>;
  reviewer?: string;
  note?: string;
}

function Proposals() {
  const [list, setList] = useState<Proposal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [reviewer, setReviewer] = useState(() => localStorage.getItem("nt-reviewer") ?? "");
  const load = () => api<Proposal[]>("/api/proposals").then(setList).catch((e) => setError(e.message));
  useEffect(() => {
    void load();
  }, []);
  const decide = async (id: string, status: string) => {
    setError(null);
    try {
      await api(`/api/proposals/${id}/decision`, { method: "POST", json: { status, reviewer }, headers: adminHeaders() });
      void load();
    } catch (e) {
      setError((e as Error).message);
    }
  };
  return (
    <div className="stack">
      <p className="small muted">Proposed additions and revisions, with the evidence offered. Approving checks the proposal still validates. Approved antibody updates appear in Reference marked as workflow approvals; approved cases become playable and stay labeled synthetic.</p>
      <input className="input" value={reviewer} onChange={(e) => { setReviewer(e.target.value); localStorage.setItem("nt-reviewer", e.target.value); }} placeholder="Reviewer name and role" aria-label="Reviewer" />
      <ErrorNote error={error} />
      {!list.length && <p className="small muted">No proposals yet. Create one under "Draft with AI".</p>}
      {list.map((p) => (
        <div key={p.id} className="card stack">
          <div className="row between">
            <strong>{p.kind}: {String(p.payload.name ?? p.payload.label ?? p.payload.id)}</strong>
            <span className="row">
              <span className="badge gray">{p.origin}</span>
              <span className={`badge ${p.status === "approved" ? "green" : p.status === "rejected" ? "red" : "amber"}`}>{p.status}</span>
            </span>
          </div>
          <div className="small">Evidence offered: {p.evidence.join(", ")}. Verify each before approving.</div>
          <details>
            <summary className="small">Show proposed content</summary>
            <pre className="small" style={{ whiteSpace: "pre-wrap", maxHeight: 300, overflow: "auto" }}>{JSON.stringify(p.payload, null, 2)}</pre>
          </details>
          {p.status !== "approved" && (
            <div className="row">
              <button className="btn small primary" disabled={!reviewer.trim()} onClick={() => decide(p.id, "approved")}>Approve</button>
              <button className="btn small" disabled={!reviewer.trim()} onClick={() => decide(p.id, "changes-requested")}>Request changes</button>
              <button className="btn small ghost" disabled={!reviewer.trim()} onClick={() => decide(p.id, "rejected")}>Reject</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Draft() {
  const [kind, setKind] = useState<"case" | "antibody">("antibody");
  const [topic, setTopic] = useState("");
  const [sources, setSources] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string; issues?: string[] } | null>(null);
  const go = async () => {
    setBusy(true);
    setResult(null);
    try {
      await api("/api/proposals/ai-draft", { method: "POST", json: { kind, topic, sourceIds: sources }, headers: adminHeaders() });
      setResult({ ok: true, text: "Draft passed validation and was stored as a proposal awaiting review." });
    } catch (e) {
      const err = e as { message: string; issues?: string[] };
      setResult({ ok: false, text: err.message, issues: Array.isArray(err.issues) ? err.issues.map(String) : undefined });
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="card stack">
      <p className="small muted">The AI drafts structured content from the sources you select. The draft must pass schema and consistency checks, may cite only the selected sources, and is stored as a proposal. It is never published until a reviewer approves it.</p>
      <div className="row" role="group" aria-label="Draft type">
        <button className={`chip ${kind === "antibody" ? "selected" : ""}`} onClick={() => setKind("antibody")}>Antibody entry or revision</button>
        <button className={`chip ${kind === "case" ? "selected" : ""}`} onClick={() => setKind("case")}>Synthetic case</button>
      </div>
      <label className="field" htmlFor="topic">Topic</label>
      <input id="topic" className="input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={kind === "case" ? "For example: LGI1 encephalitis with faciobrachial dystonic seizures" : "For example: revise the CASPR2 entry for specimen guidance"} />
      <div className="field">Sources the draft may use</div>
      <div style={{ maxHeight: 220, overflow: "auto" }}>
        {SOURCES.map((s) => (
          <label key={s.id} className="row small" style={{ alignItems: "flex-start" }}>
            <input type="checkbox" checked={sources.includes(s.id)} onChange={() => setSources(sources.includes(s.id) ? sources.filter((x) => x !== s.id) : [...sources, s.id])} />
            <span>{s.citation}</span>
          </label>
        ))}
      </div>
      <button className="btn primary" disabled={busy || topic.length < 3 || !sources.length} onClick={go}>
        {busy ? "Drafting..." : "Draft proposal"}
      </button>
      {result && (
        <div className={`feedback ${result.ok ? "good" : "bad"}`}>
          {result.text}
          {result.issues && (
            <ul className="small">
              {result.issues.map((i, k) => (
                <li key={k}>{i}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
