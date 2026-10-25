import { Link, useParams } from "react-router-dom";
import { useLearner } from "../lib/store";
import { MODULE_BY_ID, LESSON_BY_ID, ITEM_BY_ID, MODULES } from "../lib/content";
import { buildPath } from "../../shared/recommend";
import { byModule } from "../../shared/mastery";
import { moduleRetention } from "../../shared/scheduler";
import { starsFor } from "../../shared/stars";
import { now } from "../../shared/clock";
import { Stars, StatusBadge } from "../components/Bits";
import { ProvenanceLine } from "../components/Provenance";
import { Icon, Ring } from "../components/Icon";
import { moduleProgress, pathLine } from "./Learn";

const STAR_LABELS = ["Understand and recognize", "Apply to a new case", "Remember it days later"];

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
  const nextIdx = nextLesson ? lessons.indexOf(nextLesson) : -1;
  const challengeAvailable = m.challengeItems.filter((id) => ITEM_BY_ID.has(id)).length >= 3;
  const testedOut = s.testedOut.includes(m.id);

  return (
    <div>
      <Link to="/learn" className="crumb">
        <Icon name="back" /> Learn
      </Link>
      <div className="mod-head">
        <Ring value={moduleProgress(m, s)} size={60} stroke={6} icon={m.status === "planned" ? "clock" : "book"} />
        <div className="grow">
          <h1>{m.title}</h1>
          <div className="row small faint" style={{ gap: 6 }}>
            <span style={{ textTransform: "capitalize" }}>{m.level}</span>
            {m.minutes > 0 && <span>· {m.minutes} min</span>}
            {m.status !== "planned" && <span>· {pathLine(path, m)}</span>}
          </div>
        </div>
      </div>

      <p className="muted">{m.summary}</p>

      {m.status === "planned" ? (
        <div className="callout">
          <span className="ico sm gray">
            <Icon name="clock" />
          </span>
          <div className="grow">Coming soon. The scope below is listed so the course map is honest about what is not written yet. Related material may appear in cases and the glossary.</div>
        </div>
      ) : (
        <div className="stack-sm">
          {nextLesson ? (
            <Link className="btn primary block lg" to={`/lesson/${nextLesson.id}`}>
              {s.lessonProgress[nextLesson.id] ? "Continue" : nextIdx === 0 ? "Start" : `Start lesson ${nextIdx + 1}`}
            </Link>
          ) : (
            lessons.length > 0 && (
              <Link className="btn primary block lg" to="/cases">
                Practice on a patient case
              </Link>
            )
          )}
          {challengeAvailable && !testedOut && (
            <Link className="btn block" to={`/challenge/${m.id}`}>
              <Icon name="skip" /> Already know this? Test out
            </Link>
          )}
        </div>
      )}

      {lessons.length > 0 && (
        <>
          <div className="section-title">
            <h2>Lessons</h2>
          </div>
          <div className="list">
            {lessons.map((l, i) => {
              const lp = s.lessonProgress[l.id];
              const done = !!lp?.completedAt;
              const frac = done ? 1 : lp ? (lp.step + 1) / l.steps.length : 0;
              return (
                <Link key={l.id} to={`/lesson/${l.id}`} className={`list-row ${l.id === nextLesson?.id ? "current" : ""}`}>
                  <Ring value={frac} size={36} stroke={4} />
                  <div className="grow">
                    <div className="title">
                      {i + 1}. {l.title}
                    </div>
                    <div className="sub">{done ? "Done" : lp ? `Step ${lp.step + 1} of ${l.steps.length}` : `${l.minutes} min · ${l.concept}`}</div>
                  </div>
                  <span className="chev">
                    <Icon name="chevron" />
                  </span>
                </Link>
              );
            })}
          </div>
        </>
      )}

      <div className="section-title">
        <h2>What you will be able to do</h2>
      </div>
      <div className="card tight">
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }} className="stack-sm">
          {m.objectives.map((o) => (
            <li key={o.id} className="row nowrap" style={{ alignItems: "flex-start", gap: 10 }}>
              <span style={{ color: "var(--teal)", flex: "none", marginTop: 2 }}>
                <Icon name="check" size={18} />
              </span>
              <span className="small">{o.text}</span>
            </li>
          ))}
        </ul>
        {m.prerequisites.length > 0 && (
          <div className="row small" style={{ marginTop: 12 }}>
            <span className="faint">Builds on</span>
            {m.prerequisites.map((p) => (
              <Link key={p} to={`/learn/${p}`} className="chip" style={{ textDecoration: "none" }}>
                {MODULE_BY_ID.get(p)?.title}
              </Link>
            ))}
          </div>
        )}
      </div>

      {m.status !== "planned" && (
        <>
          <div className="section-title">
            <h2>Your standing</h2>
          </div>
          <div className="card tight">
            <div className="row between">
              <Stars stars={stars} size={22} />
              <StatusBadge status={est.status} />
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "10px 0 0" }} className="stack-sm small">
              {[1, 2, 3].map((n) => {
                const st = stars.find((x) => x.star === n);
                return (
                  <li key={n} className="row nowrap between">
                    <span className={st ? "" : "faint"}>
                      Star {n}: {STAR_LABELS[n - 1]}
                    </span>
                    <span className="tiny faint">{st ? new Date(st.earnedAt).toLocaleDateString() : "Not yet"}</span>
                  </li>
                );
              })}
            </ul>
            <div className="divider" />
            <div className="small faint">
              {est.why} {ret === null ? "" : `Estimated retention now: ${Math.round(ret * 100)}%.`} Stars stay once earned.
            </div>
          </div>
        </>
      )}
      <ProvenanceLine meta={m.meta} />
    </div>
  );
}
