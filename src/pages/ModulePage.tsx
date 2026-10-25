import { Link, useParams } from "react-router-dom";
import { useLearner } from "../lib/store";
import { MODULE_BY_ID, LESSON_BY_ID, ITEM_BY_ID } from "../lib/content";
import { buildPath } from "../../shared/recommend";
import { byModule } from "../../shared/mastery";
import { moduleRetention } from "../../shared/scheduler";
import { starsFor } from "../../shared/stars";
import { now } from "../../shared/clock";
import { MODULES } from "../lib/content";
import { SKILL_LABELS } from "../../shared/types";
import { Stars, StatusBadge, Bar } from "../components/Bits";
import { ProvenanceLine } from "../components/Provenance";

export function ModulePage() {
  const { moduleId } = useParams();
  const s = useLearner();
  const m = MODULE_BY_ID.get(moduleId ?? "");
  if (!m) return <p>Module not found.</p>;
  const t = now();
  const path = buildPath(MODULES, s, t).find((p) => p.moduleId === m.id)!;
  const est = byModule(s.attempts, m.id, t);
  const ret = moduleRetention(Object.values(s.reviews), m.id, t);
  const stars = starsFor(m.id, s.stars);
  const lessons = m.lessons.map((id) => LESSON_BY_ID.get(id)!).filter(Boolean);
  const nextLesson = lessons.find((l) => !s.lessonProgress[l.id]?.completedAt);
  const challengeAvailable = m.challengeItems.filter((id) => ITEM_BY_ID.has(id)).length >= 3;

  return (
    <div className="stack">
      <div className="small">
        <Link to="/learn">Learn</Link> / {m.title}
      </div>
      <div className="row between">
        <h1 style={{ margin: 0 }}>{m.title}</h1>
        <Stars stars={stars} size={20} />
      </div>
      <div className="row">
        <StatusBadge status={m.status} />
        {m.status !== "planned" && <StatusBadge status={path.status} />}
        <span className="badge gray">{m.level}</span>
        {m.minutes > 0 && <span className="badge gray">About {m.minutes} min</span>}
      </div>
      <p>{m.summary}</p>
      {m.status === "planned" && (
        <div className="notice">This module is planned. Its scope and objectives are listed so the map is honest about what is not yet written. Related content may appear in cases and the glossary.</div>
      )}

      {m.status !== "planned" && (
        <div className="row">
          {nextLesson && (
            <Link className="btn primary" to={`/lesson/${nextLesson.id}`}>
              {s.lessonProgress[nextLesson.id] ? "Continue lesson" : "Start lesson"}
            </Link>
          )}
          {!nextLesson && lessons.length > 0 && (
            <Link className="btn primary" to="/cases">
              Apply in a patient encounter
            </Link>
          )}
          {challengeAvailable && !s.testedOut.includes(m.id) && (
            <Link className="btn" to={`/challenge/${m.id}`}>
              Challenge to skip
            </Link>
          )}
          {s.testedOut.includes(m.id) && <span className="badge green">Tested out</span>}
        </div>
      )}

      <div className="grid two">
        <div className="card">
          <h2>Objectives</h2>
          <ul className="small" style={{ paddingLeft: 18, margin: 0 }}>
            {m.objectives.map((o) => (
              <li key={o.id}>
                {o.text} <span className="badge gray">{SKILL_LABELS[o.skill]}</span>
              </li>
            ))}
          </ul>
          {m.prerequisites.length > 0 && (
            <p className="small" style={{ marginTop: 8 }}>
              Builds on:{" "}
              {m.prerequisites.map((p, i) => (
                <span key={p}>
                  {i > 0 && ", "}
                  <Link to={`/learn/${p}`}>{MODULE_BY_ID.get(p)?.title}</Link>
                </span>
              ))}
            </p>
          )}
        </div>
        <div className="card">
          <h2>Your standing</h2>
          <div className="small">
            <div className="row between">
              <span>Mastery estimate</span>
              <StatusBadge status={est.status} />
            </div>
            <Bar value={est.status === "unassessed" ? 0 : est.mean} label="Module mastery estimate" />
            <p className="muted">{est.why}</p>
            <div className="row between">
              <span>Current retention (estimated)</span>
              <span>{ret === null ? "Not scheduled yet" : `${Math.round(ret * 100)}%`}</span>
            </div>
            <div className="divider" />
            <strong>Stars (kept permanently once earned)</strong>
            <ul style={{ paddingLeft: 18 }}>
              {[1, 2, 3].map((n) => {
                const st = stars.find((x) => x.star === n);
                const label = ["Understand and recognize", "Apply to a new case", "Delayed retention and transfer"][n - 1];
                return (
                  <li key={n}>
                    Star {n}: {label}. {st ? <span className="muted">Earned {new Date(st.earnedAt).toLocaleDateString()}: {st.how}</span> : <span className="muted">Not yet.</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {lessons.length > 0 && (
        <div className="card">
          <h2>Lessons</h2>
          {lessons.map((l) => {
            const lp = s.lessonProgress[l.id];
            return (
              <div key={l.id} className="row between" style={{ padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <Link to={`/lesson/${l.id}`}>{l.title}</Link>
                  <div className="tiny muted">{l.concept}</div>
                </div>
                <span className="badge gray">{lp?.completedAt ? "Done" : lp ? `Step ${lp.step + 1} of ${l.steps.length}` : `${l.minutes} min`}</span>
              </div>
            );
          })}
        </div>
      )}
      <ProvenanceLine meta={m.meta} />
    </div>
  );
}
