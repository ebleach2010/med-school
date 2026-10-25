import { Link, useNavigate } from "react-router-dom";
import { useLearner, update } from "../lib/store";
import { MODULES, LESSONS } from "../lib/content";
import { recommendNext } from "../../shared/recommend";
import { dueEntries } from "../../shared/scheduler";
import { now, dayKey, DAY_MS } from "../../shared/clock";
import { Icon } from "../components/Icon";

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <p className={compact ? "tiny muted" : "small muted"} style={{ margin: 0 }}>
      Educational tool only. Completing it does not confer a degree, license, or qualification to practice, and its assessments do not establish clinical competence.
    </p>
  );
}

const LENGTHS: { m: 3 | 5 | 10 | 20 | 0; label: string }[] = [
  { m: 3, label: "3 min" },
  { m: 5, label: "5" },
  { m: 10, label: "10" },
  { m: 20, label: "20" },
  { m: 0, label: "Open" },
];

export function Today() {
  const s = useLearner();
  const nav = useNavigate();
  const t = now();
  const rec = recommendNext(MODULES, LESSONS, s, t);
  const due = dueEntries(s.reviews, t).length;
  const resume = s.resume && s.resume.route !== rec.route ? s.resume : null;

  // Monday-first week strip, like most habit trackers.
  const today = new Date(t);
  const mondayOffset = (today.getDay() + 6) % 7;
  const week = Array.from({ length: 7 }, (_, i) => {
    const ts = t + (i - mondayOffset) * DAY_MS;
    const k = dayKey(ts);
    return { k, d: "MTWTFSS"[i], on: (s.activity[k]?.items ?? 0) > 0, today: i === mondayOffset };
  });

  return (
    <div>
      {!s.settings.noticeAcknowledged && (
        <div className="callout" role="note" style={{ marginTop: 8 }}>
          <span className="ico sm gray">
            <Icon name="info" />
          </span>
          <div className="grow">
            <Disclaimer compact />
          </div>
          <button className="linkish small" onClick={() => update((x) => ({ ...x, settings: { ...x.settings, noticeAcknowledged: true } }))}>
            Got it
          </button>
        </div>
      )}

      <div className="hero" style={{ marginTop: 12 }}>
        <div className="eyebrow">{rec.kind === "placement" ? "Start here" : "Up next"}</div>
        <h2>{rec.title}</h2>
        <p>{rec.why}</p>
        <div className="row between">
          <span className="meta">
            <Icon name="clock" size={16} /> {rec.minutes} min
          </span>
          <Link className="btn" to={rec.route}>
            {rec.kind === "placement" && s.placement ? "Resume" : "Start"}
          </Link>
        </div>
      </div>

      {resume && (
        <div className="list" style={{ marginTop: 10 }}>
          <Link to={resume.route} className="list-row">
            <span className="ico sm">
              <Icon name="play" />
            </span>
            <div className="grow">
              <div className="sub" style={{ marginTop: 0 }}>Pick up where you stopped</div>
              <div className="title">{resume.label}</div>
            </div>
            <span className="chev">
              <Icon name="chevron" />
            </span>
          </Link>
        </div>
      )}

      <div className="section-title">
        <h2>Practice</h2>
      </div>
      <div className="tiles">
        <Link to="/review" className="tile">
          <span className="ico">
            <Icon name="refresh" />
          </span>
          <span className="t">Review</span>
          <span className="d">{due ? `${due} due now` : "All caught up"}</span>
        </Link>
        <Link to="/speed" className="tile">
          <span className="ico amber">
            <Icon name="bolt" />
          </span>
          <span className="t">Speed round</span>
          <span className="d">Two asks, one diagnosis</span>
        </Link>
        <Link to="/cases" className="tile">
          <span className="ico teal">
            <Icon name="steth" />
          </span>
          <span className="t">Patient case</span>
          <span className="d">Full workup</span>
        </Link>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="row between" style={{ marginBottom: 10 }}>
          <div>
            <h3 style={{ margin: 0 }}>Timed session</h3>
            <div className="tiny faint">Reviews first, then your next lesson, then speed cases.</div>
          </div>
        </div>
        <div className="row nowrap">
          <div className="seg grow" role="group" aria-label="Session length in minutes" style={{ display: "flex" }}>
            {LENGTHS.map(({ m, label }) => (
              <button key={m} style={{ flex: 1, padding: 0 }} aria-pressed={s.settings.sessionMinutes === m} onClick={() => update((x) => ({ ...x, settings: { ...x.settings, sessionMinutes: m } }))}>
                {label}
              </button>
            ))}
          </div>
          <button className="btn primary small" style={{ minHeight: 40 }} onClick={() => nav("/session")}>
            Go
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="row between" style={{ marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>This week</h3>
          <Link to="/progress" className="small" style={{ fontWeight: 700 }}>
            Progress
          </Link>
        </div>
        <div className="week" aria-label={`Studied on ${week.filter((w) => w.on).length} of 7 days this week`}>
          {week.map((w) => (
            <div key={w.k}>
              <div className="d">{w.d}</div>
              <div className={`c ${w.on ? "on" : ""} ${w.today ? "today" : ""}`}>{w.on ? <Icon name="flame" /> : null}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
