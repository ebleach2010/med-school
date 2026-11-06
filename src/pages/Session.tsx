import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLearner, setResume } from "../lib/store";
import { MODULES, LESSONS, LESSON_BY_ID } from "../lib/content";
import { recommendNext } from "../../shared/recommend";
import { dueEntries } from "../../shared/scheduler";
import { now } from "../../shared/clock";
import { ReviewRunner } from "./Review";
import { SpeedRunner } from "./Speed";
import { LessonPlayer } from "./LessonPlayer";
import { ContinueBar, FocusShell } from "../components/FocusShell";
import { Icon } from "../components/Icon";

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
  const nav = useNavigate();
  const plan = useMemo(() => {
    const t = now();
    const rec = recommendNext(MODULES, LESSONS, s, t);
    const lessonId = rec.kind === "lesson" ? rec.route.split("/").pop()! : null;
    return planSession(s.settings.sessionMinutes, dueEntries(s.reviews, t).length, lessonId, lessonId ? LESSON_BY_ID.get(lessonId)!.minutes : 0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0);

  useEffect(() => setResume("/session", "Study session"), []);

  const step = plan[i];
  const label = (st: Step) => (st.kind === "review" ? `Review ${st.count}` : st.kind === "lesson" ? "Lesson" : `${st.count} speed cases`);

  return (
    <FocusShell closeTo="/" closeLabel="Pause session">
      {step && plan.length > 1 && (
        <div className="row small" style={{ gap: 6, marginBottom: 10 }} aria-label="Session plan">
          {plan.map((st, k) => (
            <span key={k} className={`badge ${k === i ? "blue" : k < i ? "green" : "gray"}`}>
              {k < i && <Icon name="check" size={12} />}
              {label(st)}
            </span>
          ))}
        </div>
      )}
      {!step && (
        <>
          <div className="done-screen">
            <div className="big-ico">
              <Icon name="check" />
            </div>
            <h1>Session complete</h1>
            <p className="muted">Nice work. Everything is saved.</p>
          </div>
          <ContinueBar onClick={() => nav("/")} />
        </>
      )}
      {step?.kind === "review" && <ReviewRunner key={i} limit={step.count} onFinish={() => setI(i + 1)} />}
      {step?.kind === "lesson" && <LessonPlayer key={i} lesson={LESSON_BY_ID.get(step.id)!} onFinish={() => setI(i + 1)} />}
      {step?.kind === "speed" && <SpeedRunner key={i} count={step.count} onNext={() => setI(i + 1)} />}
      {step && (
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <button className="linkish small" onClick={() => setI(i + 1)}>
            Skip this part
          </button>
        </div>
      )}
    </FocusShell>
  );
}
