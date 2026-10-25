import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { AntibodyEntry, ContentMeta } from "../../shared/types";
import { ANTIBODIES, ANTIBODY_COVERAGE, INVESTIGATIONS, GLOSSARY, SOURCES, SOURCES_COVERAGE_DATE, MODULES, DOMAINS, LESSONS, ITEMS } from "../lib/content";
import { api } from "../lib/api";
import { useReviewOverrides } from "../lib/hooks";
import { effectiveReview, ReviewBadge } from "../components/Provenance";
import { TermButton } from "../components/RichText";
import { Icon } from "../components/Icon";

type Tab = "antibodies" | "investigations" | "glossary" | "sources" | "coverage";

export function useApprovedAntibodies() {
  const [list, setList] = useState<{ entry: AntibodyEntry & { evidenceCited: string[]; changeSummary: string }; reviewer: string; approvedAt: number }[]>([]);
  useEffect(() => {
    api<typeof list>("/api/reference/approved-antibodies").then(setList).catch(() => setList([]));
  }, []);
  return list;
}

export function Reference() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get("tab") as Tab) ?? "antibodies";
  const setTab = (t: Tab) => setParams({ tab: t });
  return (
    <div>
      <div className="page-head">
        <h1>Reference</h1>
      </div>
      <div className="tabs" role="tablist">
        {(
          [
            ["antibodies", "Antibodies"],
            ["investigations", "Tests"],
            ["glossary", "Glossary"],
            ["sources", "Sources"],
            ["coverage", "Coverage"],
          ] as [Tab, string][]
        ).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>
            {l}
          </button>
        ))}
      </div>
      {tab === "antibodies" && <Antibodies />}
      {tab === "investigations" && <Investigations />}
      {tab === "glossary" && <Glossary />}
      {tab === "sources" && <Sources />}
      {tab === "coverage" && <Coverage />}
    </div>
  );
}

function Antibodies() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [ev, setEv] = useState("");
  const [showGaps, setShowGaps] = useState(false);
  const approved = useApprovedAntibodies();
  const list = useMemo(() => {
    const ql = q.toLowerCase();
    return ANTIBODIES.filter(
      (a) =>
        (!cat || a.category === cat) &&
        (!ev || a.evidence === ev) &&
        (!ql || a.name.toLowerCase().includes(ql) || a.aliases.some((x) => x.toLowerCase().includes(ql)) || a.phenotypes.some((p) => p.toLowerCase().includes(ql)) || a.target.toLowerCase().includes(ql)),
    );
  }, [q, cat, ev]);
  return (
    <div className="stack">
      <div className="callout">
        <span className="ico sm amber">
          <Icon name="info" />
        </span>
        <div className="grow">
          <p>
            <strong>Coverage as of {ANTIBODY_COVERAGE.coverageDate}.</strong> Not every reported antibody is listed.{" "}
            <button className="linkish" onClick={() => setShowGaps((g) => !g)} aria-expanded={showGaps}>
              {showGaps ? "Hide details" : `Scope and ${ANTIBODY_COVERAGE.gaps.length} known gaps`}
            </button>
          </p>
          <p>Test by phenotype, on the right specimen, with the right assay. A negative panel does not exclude immune-mediated disease.</p>
        </div>
      </div>
      {showGaps && (
        <div className="card warn small">
          <p>{ANTIBODY_COVERAGE.scope}</p>
          <p>{ANTIBODY_COVERAGE.method}</p>
          <p>A low-titer positive in the wrong syndrome rarely establishes the diagnosis.</p>
          <ul>
            {ANTIBODY_COVERAGE.gaps.map((g) => (
              <li key={g.name}>
                <strong>{g.name}:</strong> {g.reason}
              </li>
            ))}
          </ul>
          {ANTIBODY_COVERAGE.notes.map((n, i) => (
            <p key={i}>{n}</p>
          ))}
        </div>
      )}
      <div className="row nowrap" style={{ gap: 6 }}>
        <input className="input" style={{ flex: "1 1 auto", minWidth: 0 }} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" aria-label="Search antibodies" />
        <select className="input" style={{ width: 96, flex: "none", padding: "8px" }} value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category">
          <option value="">Type</option>
          {["neural-surface", "neural-intracellular", "neuromuscular", "peripheral-nerve", "demyelinating", "systemic"].map((c) => (
            <option key={c} value={c}>{c.replace("-", " ")}</option>
          ))}
        </select>
        <select className="input" style={{ width: 112, flex: "none", padding: "8px" }} value={ev} onChange={(e) => setEv(e.target.value)} aria-label="Evidence strength">
          <option value="">Evidence</option>
          {["established", "probable", "emerging", "uncertain"].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      {approved.length > 0 && (
        <div className="card green small">
          <strong>Approved updates through the review workflow</strong>
          {approved.map((a) => (
            <div key={a.entry.id + a.approvedAt}>
              {a.entry.name}: {a.entry.changeSummary} <span className="muted">(approved by {a.reviewer}, {new Date(a.approvedAt).toISOString().slice(0, 10)})</span>
            </div>
          ))}
        </div>
      )}
      <div className="list">
        {list.map((a) => (
          <Link key={a.id} to={`/reference/antibody/${a.id}`} className="list-row">
            <div className="grow">
              <div className="title small">{a.name}</div>
              <div className="sub">{a.phenotypes.slice(0, 3).join("; ")}</div>
            </div>
            <span className={`badge ${a.evidence === "established" ? "green" : a.evidence === "probable" ? "blue" : "amber"}`}>{a.evidence}</span>
          </Link>
        ))}
        {!list.length && <div className="list-row faint small">No matches.</div>}
      </div>
    </div>
  );
}

function Investigations() {
  const [q, setQ] = useState("");
  const list = INVESTIGATIONS.filter((i) => !q || i.name.toLowerCase().includes(q.toLowerCase()) || i.aliases.some((a) => a.toLowerCase().includes(q.toLowerCase())));
  const cats = [...new Set(list.map((i) => i.category))];
  return (
    <div className="stack">
      <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search investigations" aria-label="Search investigations" />
      <p className="small faint" style={{ margin: 0 }}>What each test answers, when to send it, turnaround, limits, and what results do and do not mean. Reference ranges vary by laboratory.</p>
      {cats.map((c) => (
        <div key={c}>
          <div className="eyebrow" style={{ margin: "4px 2px 6px" }}>{c}</div>
          <div className="list">
            {list
              .filter((i) => i.category === c)
              .map((i) => (
                <Link key={i.id} to={`/reference/investigation/${i.id}`} className="list-row">
                  <div className="grow">
                    <div className="title small">{i.name}</div>
                    <div className="sub">{i.question}</div>
                  </div>
                  <span className="chev">
                    <Icon name="chevron" />
                  </span>
                </Link>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Glossary() {
  const [q, setQ] = useState("");
  const list = GLOSSARY.filter((t) => !q || t.term.toLowerCase().includes(q.toLowerCase()) || t.plain.toLowerCase().includes(q.toLowerCase())).sort((a, b) => a.term.localeCompare(b.term));
  return (
    <div className="stack">
      <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search terms" aria-label="Search glossary" />
      <div className="list">
        {list.map((t) => (
          <div key={t.id} className="list-row" style={{ display: "block", cursor: "default" }}>
            <div className="title small">
              <TermButton id={t.id}>{t.term}</TermButton> {t.pronunciation && <span className="tiny faint" style={{ fontWeight: 400 }}>{t.pronunciation}</span>}
            </div>
            <div className="sub" style={{ color: "var(--text-2)" }}>{t.plain}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Sources() {
  return (
    <div className="stack">
      <p className="small faint" style={{ margin: 0 }}>
        Evidence registry checked {SOURCES_COVERAGE_DATE}. Content may cite only these. An AI model's internal knowledge is never treated as a citation. Superseded guidelines are kept for context and marked.
      </p>
      {(["guideline", "consensus-criteria", "trial", "review", "primary-research", "curriculum", "lab-catalog"] as const).map((k) => {
        const list = SOURCES.filter((s) => s.kind === k);
        if (!list.length) return null;
        return (
          <div key={k}>
            <div className="eyebrow" style={{ margin: "4px 2px 6px" }}>{k.replace("-", " ")}s</div>
            <div className="list">
              {list.map((s) => (
                <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="list-row" style={{ display: "block" }}>
                  <div className="small" style={{ color: "var(--blue)" }}>{s.citation}</div>
                  <div className="sub">
                    {s.pmid ? `PMID ${s.pmid}. ` : ""}
                    {s.verificationNote}
                  </div>
                </a>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function countStatuses(metas: ContentMeta[], overrides: ReturnType<typeof useReviewOverrides>) {
  const out = { reviewed: 0, draft: 0, synthetic: 0, changes: 0 };
  for (const m of metas) {
    const r = effectiveReview(m, overrides).status;
    if (m.provenance === "synthetic") out.synthetic++;
    else if (r === "reviewed") out.reviewed++;
    else if (r === "changes-requested") out.changes++;
    else out.draft++;
  }
  return out;
}

function Coverage() {
  const overrides = useReviewOverrides();
  const [cov, setCov] = useState<{ cases: number; byModule: Record<string, { full: number; speed: number }>; review: Record<string, number>; synthetic: number } | null>(null);
  useEffect(() => {
    api<typeof cov>("/api/coverage").then(setCov).catch(() => setCov(null));
  }, []);
  const rows: [string, ContentMeta[]][] = [
    ["Modules", MODULES.filter((m) => m.status !== "planned").map((m) => m.meta)],
    ["Lessons", LESSONS.map((l) => l.meta)],
    ["Assessment items", ITEMS.map((i) => i.meta)],
    ["Investigations", INVESTIGATIONS.map((i) => i.meta)],
    ["Antibody entries", ANTIBODIES.map((a) => a.meta)],
  ];
  return (
    <div className="stack">
      <div className="card">
        <h2>Review status</h2>
        <p className="small muted">"AI draft" means drafted from cited sources by a model and not yet checked by a clinician. Approve items in the <Link to="/admin">review workspace</Link>.</p>
        <div className="table-wrap"><table className="data">
          <thead>
            <tr>
              <th>Content</th>
              <th>Reviewed</th>
              <th>AI draft, awaiting review</th>
              <th>Changes requested</th>
              <th>Synthetic</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, metas]) => {
              const c = countStatuses(metas, overrides);
              return (
                <tr key={label}>
                  <td>{label} ({metas.length})</td>
                  <td>{c.reviewed}</td>
                  <td>{c.draft}</td>
                  <td>{c.changes}</td>
                  <td>{c.synthetic}</td>
                </tr>
              );
            })}
            {cov && (
              <tr>
                <td>Cases ({cov.cases})</td>
                <td>{cov.review.reviewed ?? 0}</td>
                <td>{cov.review.pending ?? 0}</td>
                <td>{cov.review["changes-requested"] ?? 0}</td>
                <td>{cov.synthetic} (all cases are synthetic)</td>
              </tr>
            )}
          </tbody>
        </table></div>
      </div>
      <div className="card">
        <h2>Coverage matrix</h2>
        <div className="table-wrap"><table className="data">
          <thead>
            <tr>
              <th>Domain</th>
              <th>Modules (complete / partial / planned)</th>
              <th>Lessons</th>
              <th>Items</th>
              <th>Cases (full / speed)</th>
            </tr>
          </thead>
          <tbody>
            {DOMAINS.map((d) => {
              const mods = MODULES.filter((m) => m.domain === d.id);
              const ids = new Set(mods.map((m) => m.id));
              const lessons = LESSONS.filter((l) => ids.has(l.moduleId)).length;
              const items = ITEMS.filter((i) => i.modules.some((m) => ids.has(m))).length;
              const full = mods.reduce((t, m) => t + (cov?.byModule[m.id]?.full ?? 0), 0);
              const speed = mods.reduce((t, m) => t + (cov?.byModule[m.id]?.speed ?? 0), 0);
              return (
                <tr key={d.id}>
                  <td>{d.title}</td>
                  <td>
                    {mods.filter((m) => m.status === "complete").length} / {mods.filter((m) => m.status === "partial").length} / {mods.filter((m) => m.status === "planned").length}
                  </td>
                  <td>{lessons}</td>
                  <td>{items}</td>
                  <td>{cov ? `${full} / ${speed}` : "?"}</td>
                </tr>
              );
            })}
          </tbody>
        </table></div>
        <p className="tiny muted">Cases can count toward more than one module. Planned modules have no instructional content yet.</p>
      </div>
    </div>
  );
}

export { ReviewBadge };
