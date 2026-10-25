import { useState } from "react";
import { Link } from "react-router-dom";
import { useLearner, exportState } from "../lib/store";
import { MODULES, MODULE_BY_ID, ITEM_BY_ID } from "../lib/content";
import { bySkill, errorPatterns } from "../../shared/mastery";
import { moduleRetention } from "../../shared/scheduler";
import { now, dayKey, DAY_MS } from "../../shared/clock";
import { SKILLS, SKILL_LABELS, type Attempt } from "../../shared/types";
import { Stars, StatusBadge, Bar } from "../components/Bits";
import { stripMarkup } from "../../shared/text";

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

export function download(name: string, text: string) {
  const blob = new Blob([text], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
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

  return (
    <div className="stack">
      <h1>Progress</h1>
      <div className="grid three">
        <div className="card tight">
          <div className="small muted">First-attempt accuracy</div>
          <strong>{pct(firstRight, firstTotal)}</strong> <span className="small muted">({firstTotal} items)</span>
        </div>
        <div className="card tight">
          <div className="small muted">Delayed recall (reviews)</div>
          <strong>{pct(delayed.filter((a) => a.score >= 0.8).length, delayed.length)}</strong> <span className="small muted">({delayed.length})</span>
        </div>
        <div className="card tight">
          <div className="small muted">Unfamiliar presentations</div>
          <strong>{pct(unfamRight, unfamTotal)}</strong> <span className="small muted">({unfamTotal})</span>
        </div>
        <div className="card tight">
          <div className="small muted">Case diagnosis vs reasoning</div>
          <strong>{avg(dxAttempts) === null ? "No cases yet" : `${Math.round(avg(dxAttempts)! * 100)}% vs ${avg(reasonAttempts) === null ? "n/a" : Math.round(avg(reasonAttempts)! * 100) + "%"}`}</strong>
        </div>
        <div className="card tight">
          <div className="small muted">Reviews due</div>
          <strong>{due7}</strong> <span className="small muted">within 7 days, {due30} within 30</span>
        </div>
        <div className="card tight">
          <div className="small muted">Answers with hints</div>
          <strong>{hints}</strong> <span className="small muted">of {s.attempts.length}</span>
        </div>
      </div>

      <div className="card">
        <h2>Activity</h2>
        <div className="heat" role="img" aria-label={`Study activity over the last 26 weeks; active in ${activeWeeks} weeks overall`}>
          {days.map((d) => (
            <span key={d.key} className={`l${d.level}`} title={d.label} />
          ))}
        </div>
        <p className="tiny muted">Active in {activeWeeks} week{activeWeeks === 1 ? "" : "s"} so far. Breaks are not penalized.</p>
      </div>

      <div className="card">
        <h2>Abilities</h2>
        <p className="small muted">Current estimate compared with your placement baseline. Select a row to see the evidence behind it.</p>
        {SKILLS.map((k) => {
          const e = skills[k];
          const b = baseline[k];
          const ev = e.evidence.map((id) => s.attempts.find((a) => a.id === id)!).filter(Boolean);
          return (
            <div key={k} style={{ borderBottom: "1px solid var(--border)", padding: "8px 0" }}>
              <button className="btn ghost block" style={{ justifyContent: "space-between", padding: 0, minHeight: 36 }} onClick={() => setOpen(open === k ? null : k)} aria-expanded={open === k}>
                <span>{SKILL_LABELS[k]}</span>
                <StatusBadge status={e.status} />
              </button>
              <Bar value={e.status === "unassessed" ? 0 : e.mean} label={`${SKILL_LABELS[k]} current`} />
              <div className="tiny muted">
                Now {e.status === "unassessed" ? "not assessed" : `${Math.round(e.mean * 100)}% ± ${Math.round(e.sd * 100)}`} · Baseline {b.status === "unassessed" ? "not assessed" : `${Math.round(b.mean * 100)}%`} · {e.independent} independent items, {e.presentations} presentations
                {e.calibration !== undefined ? ` · "Sure" answers right ${Math.round(e.calibration * 100)}%` : ""}
              </div>
              {open === k && (
                <div className="small" style={{ marginTop: 6 }}>
                  <p className="muted">{e.why}</p>
                  <table className="data">
                    <thead>
                      <tr>
                        <th>When</th>
                        <th>Question</th>
                        <th>Score</th>
                        <th>Confidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ev.slice(0, 15).map((a) => (
                        <tr key={a.id}>
                          <td>{new Date(a.ts).toLocaleDateString()} <span className="tiny muted">{a.context}</span></td>
                          <td>
                            {itemLabel(a)}
                            <div className="tiny muted">You: {a.answerSummary}. Expected: {a.keySummary}. (version {a.itemVersion})</div>
                          </td>
                          <td>{Math.round(a.score * 100)}%</td>
                          <td>{a.confidence}{a.selfReport ? `, ${a.selfReport}` : ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="card">
        <h2>Stars and retention</h2>
        <p className="small muted">Stars are permanent achievements. Retention is an estimate of what you would recall today, so it falls over time until you review.</p>
        <table className="data">
          <thead>
            <tr>
              <th>Module</th>
              <th>Stars</th>
              <th>Current retention</th>
            </tr>
          </thead>
          <tbody>
            {MODULES.filter((m) => m.status !== "planned").map((m) => {
              const r = moduleRetention(reviews, m.id, t);
              return (
                <tr key={m.id}>
                  <td>
                    <Link to={`/learn/${m.id}`}>{m.title}</Link>
                    {s.testedOut.includes(m.id) && <span className="badge green" style={{ marginLeft: 6 }}>tested out</span>}
                  </td>
                  <td>
                    <Stars stars={s.stars.filter((x) => x.moduleId === m.id)} />
                  </td>
                  <td>{r === null ? <span className="muted">Not scheduled</span> : `${Math.round(r * 100)}%`}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>Error patterns</h2>
        {errors.length ? (
          <ul className="small">
            {errors.map((e) => (
              <li key={e.tag}>
                {ERROR_LABELS[e.tag] ?? e.tag}: {e.count}
              </li>
            ))}
          </ul>
        ) : (
          <p className="small muted">No errors recorded yet.</p>
        )}
      </div>

      <div className="row">
        <button className="btn" onClick={() => download(`neuro-tutor-progress-${dayKey(Date.now())}.json`, exportState())}>
          Export progress
        </button>
        <Link className="btn ghost" to="/settings#data">
          Import, sync, or reset
        </Link>
      </div>
      {s.attempts.length === 0 && <p className="small muted">No answers yet. Start with the <Link to="/placement">placement assessment</Link>.</p>}
      <p className="tiny muted">Modules referenced: {MODULE_BY_ID.size}. Old attempts keep the content version they used.</p>
    </div>
  );
}
