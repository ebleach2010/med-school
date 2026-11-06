import { useState } from "react";
import { Link } from "react-router-dom";
import { useLearner, exportState } from "../lib/store";
import { MODULES, ITEM_BY_ID } from "../lib/content";
import { bySkill, errorPatterns } from "../../shared/mastery";
import { moduleRetention } from "../../shared/scheduler";
import { now, dayKey, DAY_MS } from "../../shared/clock";
import { SKILLS, SKILL_LABELS, type Attempt } from "../../shared/types";
import { Stars, StatusBadge, Bar } from "../components/Bits";
import { stripMarkup } from "../../shared/text";
import { STANDALONE, hostCapability, type DownloadsCap } from "../lib/platform";
import { Icon } from "../components/Icon";

const ERROR_LABELS: Record<string, string> = {
  "knowledge-gap": "Knowledge gap",
  slip: "Slip or misread",
  terminology: "Terminology confusion",
  misconception: "Misconception",
  "weak-reasoning": "Right answer, weak reasoning",
  "overly-specific": "Overly specific",
  incomplete: "Incomplete",
  "unsafe-priority": "Unsafe prioritization",
};

function pct(n: number, d: number) {
  return d ? `${Math.round((n / d) * 100)}%` : "No data";
}

export async function download(name: string, text: string): Promise<string | null> {
  if (STANDALONE) {
    const d = await hostCapability<DownloadsCap>("downloads");
    if (!d) return "Saving files is not available here. Use Settings > Your data > Copy to copy the export instead.";
    try {
      await d.save({ filename: name, data: text });
      return null;
    } catch (e) {
      return (e as { code?: string }).code === "declined" ? null : "The file could not be saved.";
    }
  }
  const blob = new Blob([text], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
  return null;
}

function itemLabel(a: Attempt): string {
  const it = ITEM_BY_ID.get(a.itemId);
  if (it) return stripMarkup(it.stem).slice(0, 90);
  return a.itemId.includes(":") ? `Case ${a.itemId.split(":")[1]}` : a.itemId;
}

export function Progress() {
  const s = useLearner();
  const t = now();
  const [open, setOpen] = useState<string | null>(null);
  const [view, setView] = useState<"overview" | "abilities" | "modules">("overview");
  const skills = bySkill(s.attempts, t);
  const baseline = bySkill(s.attempts, t, (a) => a.context === "placement");
  const firstSeen = new Set<string>();
  let firstTotal = 0;
  let firstRight = 0;
  const presSeen = new Set<string>();
  let unfamTotal = 0;
  let unfamRight = 0;
  for (const a of [...s.attempts].sort((x, y) => x.ts - y.ts)) {
    if (!firstSeen.has(a.itemId)) {
      firstSeen.add(a.itemId);
      firstTotal++;
      if (a.score >= 0.8) firstRight++;
    }
    if (!presSeen.has(a.presentation) && a.transfer) {
      unfamTotal++;
      if (a.score >= 0.8) unfamRight++;
    }
    presSeen.add(a.presentation);
  }
  const dxAttempts = s.attempts.filter((a) => a.itemId.endsWith(":diagnosis"));
  const reasonAttempts = s.attempts.filter((a) => a.itemId.endsWith(":reasoning"));
  const avg = (xs: Attempt[]) => (xs.length ? xs.reduce((x, a) => x + a.score, 0) / xs.length : null);
  const delayed = s.attempts.filter((a) => a.context === "review");
  const hints = s.attempts.filter((a) => a.hintsUsed > 0).length;
  const errors = errorPatterns(s.attempts);
  const reviews = Object.values(s.reviews);
  const due7 = reviews.filter((e) => e.dueAt <= t + 7 * DAY_MS).length;
  const due30 = reviews.filter((e) => e.dueAt <= t + 30 * DAY_MS).length;

  // Activity heatmap: last 26 weeks.
  const days: { key: string; level: number; label: string }[] = [];
  const start = t - 26 * 7 * DAY_MS;
  for (let d = start; d <= t; d += DAY_MS) {
    const k = dayKey(d);
    const a = s.activity[k];
    const m = a?.minutes ?? 0;
    days.push({ key: k, level: m === 0 ? 0 : m < 5 ? 1 : m < 15 ? 2 : 3, label: `${k}: ${a ? `${a.items} answers, ${Math.round(m)} min` : "no activity"}` });
  }
  const activeWeeks = new Set(Object.keys(s.activity).map((k) => Math.floor(new Date(k).getTime() / (7 * DAY_MS)))).size;

  const metrics: [string, string, string][] = [
    ["First try", pct(firstRight, firstTotal), `${firstTotal} items`],
    ["Delayed recall", pct(delayed.filter((a) => a.score >= 0.8).length, delayed.length), `${delayed.length} reviews`],
    ["New presentations", pct(unfamRight, unfamTotal), `${unfamTotal} seen`],
    ["Case diagnosis", avg(dxAttempts) === null ? "No data" : `${Math.round(avg(dxAttempts)! * 100)}%`, avg(reasonAttempts) === null ? "No cases yet" : `reasoning ${Math.round(avg(reasonAttempts)! * 100)}%`],
    ["Due soon", String(due7), `7 days · ${due30} in 30`],
    ["With hints", String(hints), `of ${s.attempts.length} answers`],
  ];

  return (
    <div>
      <div className="page-head">
        <h1>Progress</h1>
      </div>
      <div className="seg block" role="tablist" aria-label="Progress view" style={{ margin: "0 0 14px" }}>
        {(
          [
            ["overview", "Overview"],
            ["abilities", "Abilities"],
            ["modules", "Modules"],
          ] as const
        ).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={view === k} onClick={() => setView(k)}>
            {l}
          </button>
        ))}
      </div>

      {view === "overview" && (
        <>
          {s.attempts.length === 0 && (
            <div className="callout" style={{ marginBottom: 12 }}>
              <span className="ico sm">
                <Icon name="target" />
              </span>
              <div className="grow">
                No answers yet. Start with the <Link to="/placement">placement</Link>.
              </div>
            </div>
          )}
          <div className="grid two" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {metrics.map(([l, v, sub]) => (
              <div key={l} className="card tight">
                <div className="eyebrow">{l}</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 800 }}>{v}</div>
                <div className="tiny faint">{sub}</div>
              </div>
            ))}
          </div>

          <div className="section-title">
            <h2>Activity</h2>
            <span className="tiny faint">Active {activeWeeks} week{activeWeeks === 1 ? "" : "s"}</span>
          </div>
          <div className="card tight">
            <div className="heat" role="img" aria-label={`Study activity over the last 26 weeks; active in ${activeWeeks} weeks overall`}>
              {days.map((d) => (
                <span key={d.key} className={`l${d.level}`} title={d.label} />
              ))}
            </div>
            <p className="tiny faint" style={{ margin: "8px 0 0" }}>Breaks are not penalized. Stars you earn are kept.</p>
          </div>

          <div className="section-title">
            <h2>Error patterns</h2>
          </div>
          {errors.length ? (
            <div className="row">
              {errors.map((e) => (
                <span key={e.tag} className="badge gray" style={{ fontSize: "0.8rem", padding: "4px 10px" }}>
                  {ERROR_LABELS[e.tag] ?? e.tag} · {e.count}
                </span>
              ))}
            </div>
          ) : (
            <p className="small faint">No errors recorded yet.</p>
          )}

          <div className="list" style={{ marginTop: 18 }}>
            <button className="list-row" onClick={() => void download(`neuro-tutor-progress-${dayKey(Date.now())}.json`, exportState())}>
              <span className="ico sm gray">
                <Icon name="down" />
              </span>
              <div className="grow title">Export progress</div>
            </button>
            <Link className="list-row" to="/settings#data">
              <span className="ico sm gray">
                <Icon name="refresh" />
              </span>
              <div className="grow title">Import, sync, or reset</div>
              <span className="chev">
                <Icon name="chevron" />
              </span>
            </Link>
          </div>
          <p className="tiny faint" style={{ marginTop: 8 }}>Old attempts keep the content version they used.</p>
        </>
      )}

      {view === "abilities" && (
        <>
          <p className="small faint" style={{ marginTop: 0 }}>Current estimate against your placement baseline. Tap one to see the evidence.</p>
          <div className="list">
            {SKILLS.map((k) => {
              const e = skills[k];
              const b = baseline[k];
              const ev = e.evidence.map((id) => s.attempts.find((a) => a.id === id)!).filter(Boolean);
              return (
                <div key={k} className="list-row" style={{ display: "block" }}>
                  <button className="linkish" style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", color: "inherit", marginBottom: 6 }} onClick={() => setOpen(open === k ? null : k)} aria-expanded={open === k}>
                    <span className="title small">{SKILL_LABELS[k]}</span>
                    <StatusBadge status={e.status} />
                  </button>
                  <Bar value={e.status === "unassessed" ? 0 : e.mean} label={`${SKILL_LABELS[k]} current`} tone={e.status === "demonstrated" ? "green" : "teal"} />
                  <div className="sub">
                    Now {e.status === "unassessed" ? "not assessed" : `${Math.round(e.mean * 100)}% ± ${Math.round(e.sd * 100)}`} · baseline {b.status === "unassessed" ? "none" : `${Math.round(b.mean * 100)}%`} · {e.independent} items, {e.presentations} presentations
                    {e.calibration !== undefined ? ` · "Sure" right ${Math.round(e.calibration * 100)}%` : ""}
                  </div>
                  {open === k && (
                    <div className="small" style={{ marginTop: 8 }}>
                      <p className="muted">{e.why}</p>
                      <div className="table-wrap">
                        <table className="data">
                          <thead>
                            <tr>
                              <th>When</th>
                              <th>Question</th>
                              <th>Score</th>
                              <th>Sure?</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ev.slice(0, 15).map((a) => (
                              <tr key={a.id}>
                                <td>
                                  {new Date(a.ts).toLocaleDateString()} <span className="tiny faint">{a.context}</span>
                                </td>
                                <td>
                                  {itemLabel(a)}
                                  <div className="tiny faint">
                                    You: {a.answerSummary}. Expected: {a.keySummary}. (v{a.itemVersion})
                                  </div>
                                </td>
                                <td>{Math.round(a.score * 100)}%</td>
                                <td>
                                  {a.confidence}
                                  {a.selfReport ? `, ${a.selfReport}` : ""}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {view === "modules" && (
        <>
          <p className="small faint" style={{ marginTop: 0 }}>Stars are permanent. Retention estimates what you would recall today, so it falls until you review.</p>
          <div className="list">
            {MODULES.filter((m) => m.status !== "planned").map((m) => {
              const r = moduleRetention(reviews, m.id, t);
              return (
                <Link key={m.id} to={`/learn/${m.id}`} className="list-row">
                  <div className="grow">
                    <div className="title small">{m.title}</div>
                    <div className="sub">
                      {s.testedOut.includes(m.id) ? "Tested out · " : ""}
                      {r === null ? "Not scheduled yet" : `Retention ${Math.round(r * 100)}%`}
                    </div>
                  </div>
                  <Stars stars={s.stars.filter((x) => x.moduleId === m.id)} />
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
