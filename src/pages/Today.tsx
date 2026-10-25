import { Link, useNavigate } from "react-router-dom";
import { useLearner, update } from "../lib/store";
import { MODULES, LESSONS, MODULE_BY_ID } from "../lib/content";
import { recommendNext } from "../../shared/recommend";
import { dueEntries } from "../../shared/scheduler";
import { bySkill } from "../../shared/mastery";
import { now } from "../../shared/clock";
import { SKILLS, SKILL_LABELS } from "../../shared/types";
import { Bar, Stars, StatusBadge } from "../components/Bits";

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <p className={compact ? "tiny muted" : "small muted"} style={{ margin: 0 }}>
      Educational tool only. Completing it does not confer a degree, license, or qualification to practice, and its assessments do not establish clinical competence.
    </p>
  );
}

export function Today() {
  const s = useLearner();
  const nav = useNavigate();
  const t = now();
  const rec = recommendNext(MODULES, LESSONS, s, t);
  const due = dueEntries(s.reviews, t);
  const skills = bySkill(s.attempts, t);
  const recentStars = [...s.stars].sort((a, b) => b.earnedAt - a.earnedAt).slice(0, 4);
  const lengths: (3 | 5 | 10 | 20 | 0)[] = [3, 5, 10, 20, 0];

  return (
    <div className="stack">
      {!s.settings.noticeAcknowledged && (
        <div className="notice row between" role="note">
          <Disclaimer />
          <button className="btn small" onClick={() => update((x) => ({ ...x, settings: { ...x.settings, noticeAcknowledged: true } }))}>
            Got it
          </button>
        </div>
      )}

      <div className="grid two">
        {s.resume && s.resume.route !== rec.route && (
          <div className="card accent">
            <div className="small muted">Continue where you stopped</div>
            <h2>{s.resume.label}</h2>
            <Link className="btn primary" to={s.resume.route}>
              Continue
            </Link>
          </div>
        )}
        <div className="card teal">
          <div className="small muted">Recommended next</div>
          <h2>{rec.title}</h2>
          <p className="small">{rec.why}</p>
          <div className="row">
            <Link className="btn primary" to={rec.route}>
              Start ({rec.minutes} min)
            </Link>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="row between">
          <h2 style={{ margin: 0 }}>Study session</h2>
          <span className="small muted">Breaks are fine. Progress saves after every answer.</span>
        </div>
        <div className="row" style={{ marginTop: 8 }} role="group" aria-label="Session length">
          {lengths.map((m) => (
            <button key={m} className={`chip ${s.settings.sessionMinutes === m ? "selected" : ""}`} aria-pressed={s.settings.sessionMinutes === m} onClick={() => update((x) => ({ ...x, settings: { ...x.settings, sessionMinutes: m } }))}>
              {m ? `${m} min` : "Unrestricted"}
            </button>
          ))}
          <button className="btn primary" onClick={() => nav("/session")}>
            Start session
          </button>
        </div>
      </div>

      <div className="grid two">
        <div className="card">
          <div className="row between">
            <h2 style={{ margin: 0 }}>Reviews due</h2>
            <span className="badge blue">{due.length}</span>
          </div>
          <p className="small muted">{due.length ? "Short retrieval questions, interleaved across topics." : "Nothing due right now. Items come back as they start to fade."}</p>
          <Link className={`btn ${due.length ? "primary" : ""}`} to="/review" aria-disabled={!due.length}>
            {due.length ? "Review now" : "See schedule"}
          </Link>
        </div>
        <div className="card">
          <h2>Quick practice</h2>
          <div className="row">
            <Link className="btn" to="/speed">
              Two-question speed round
            </Link>
            <Link className="btn" to="/cases">
              Patient encounter
            </Link>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="row between">
          <h2 style={{ margin: 0 }}>Current mastery</h2>
          <Link to="/progress" className="small">
            Details and evidence
          </Link>
        </div>
        <div className="stack" style={{ marginTop: 8 }}>
          {SKILLS.map((k) => (
            <div key={k}>
              <div className="row between small">
                <span>{SKILL_LABELS[k]}</span>
                <StatusBadge status={skills[k].status} />
              </div>
              <Bar value={skills[k].status === "unassessed" ? 0 : skills[k].mean} label={`${SKILL_LABELS[k]} estimate`} tone={skills[k].status === "demonstrated" ? "green" : "teal"} />
            </div>
          ))}
        </div>
      </div>

      {recentStars.length > 0 && (
        <div className="card">
          <h2>Recent stars</h2>
          {recentStars.map((st) => (
            <div key={`${st.moduleId}-${st.star}`} className="row between small" style={{ padding: "4px 0" }}>
              <Link to={`/learn/${st.moduleId}`}>{MODULE_BY_ID.get(st.moduleId)?.title}</Link>
              <span className="row">
                <Stars stars={s.stars.filter((x) => x.moduleId === st.moduleId)} />
                <span className="muted">{st.how}</span>
              </span>
            </div>
          ))}
        </div>
      )}
      <Disclaimer compact />
    </div>
  );
}
