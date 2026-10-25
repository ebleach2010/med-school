import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLearner, setResume } from "../lib/store";
import { MODULES, LESSONS, LESSON_BY_ID } from "../lib/content";
import { recommendNext } from "../../shared/recommend";
import { dueEntries } from "../../shared/scheduler";
import { now } from "../../shared/clock";
import { ReviewRunner } from "./Review";
import { SpeedRunner } from "./Speed";
import { LessonPlayer } from "./LessonPlayer";

type Step = { kind: "review"; count: number } | { kind: "lesson"; id: string } | { kind: "speed"; count: number };

/** Build a plan that fits the chosen time: due reviews first, then the next lesson, then speed cases. */
export function planSession(minutes: number, dueCount: number, lessonId: string | null, lessonMinutes: number): Step[] {
  const budget = minutes || 30;
  const steps: Step[] = [];
  let left = budget;
  const reviewCount = Math.min(dueCount, Math.max(minutes ? Math.floor((budget * 0.5) / 0.6) : dueCount, dueCount ? 1 : 0));
  if (reviewCount) {
    steps.push({ kind: "review", count: reviewCount });
    left -= reviewCount * 0.6;
  }
  if (lessonId && (left >= lessonMinutes * 0.8 || !minutes)) {
    steps.push({ kind: "lesson", id: lessonId });
    left -= lessonMinutes;
  }
  const speed = Math.floor(left / 1.5);
  if (speed > 0) steps.push({ kind: "speed", count: minutes ? speed : 5 });
  if (!steps.length) steps.push({ kind: "speed", count: Math.max(1, Math.floor(budget / 1.5)) });
  return steps;
}

export function Session() {
  const s = useLearner();
  const plan = useMemo(() => {
    const t = now();
    const rec = recommendNext(MODULES, LESSONS, s, t);
    const lessonId = rec.kind === "lesson" ? rec.route.split("/").pop()! : null;
    return planSession(s.settings.sessionMinutes, dueEntries(s.reviews, t).length, lessonId, lessonId ? LESSON_BY_ID.get(lessonId)!.minutes : 0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0);
  const [started] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => setResume("/session", "Study session"), []);
  useEffect(() => {
    if (!s.settings.showTimers) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 1000);
    return () => clearInterval(id);
  }, [s.settings.showTimers, started]);

  const step = plan[i];
  const label = (st: Step) => (st.kind === "review" ? `Review ${st.count} items` : st.kind === "lesson" ? LESSON_BY_ID.get(st.id)?.title ?? "Lesson" : `${st.count} speed cases`);

  return (
    <div className="stack">
      <div className="row between">
        <h1 style={{ margin: 0 }}>{s.settings.sessionMinutes ? `${s.settings.sessionMinutes}-minute session` : "Open session"}</h1>
        {s.settings.showTimers && <span className="badge gray mono">{Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")}</span>}
      </div>
      <ol className="row small" style={{ listStyle: "none", padding: 0 }} aria-label="Session plan">
        {plan.map((st, k) => (
          <li key={k} className={`badge ${k === i ? "blue" : k < i ? "green" : "gray"}`}>
            {k + 1}. {label(st)}
          </li>
        ))}
      </ol>
      {!step && (
        <div className="card green">
          <h2>Session complete</h2>
          <p className="small muted">Nice work. Everything is saved.</p>
          <Link className="btn primary" to="/">Back to Today</Link>
        </div>
      )}
      {step?.kind === "review" && <ReviewRunner limit={step.count} onFinish={() => setI(i + 1)} />}
      {step?.kind === "lesson" && <LessonPlayer lesson={LESSON_BY_ID.get(step.id)!} onFinish={() => setI(i + 1)} />}
      {step?.kind === "speed" && <SpeedRunner count={step.count} onNext={() => setI(i + 1)} />}
      {step && (
        <div className="row">
          <Link to="/" className="btn ghost">Pause</Link>
          <button className="btn ghost" onClick={() => setI(i + 1)}>Skip this part</button>
        </div>
      )}
    </div>
  );
}
