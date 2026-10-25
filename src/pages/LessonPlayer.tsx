import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { ExplainLayers, Lesson } from "../../shared/types";
import { useLearner, update, setResume } from "../lib/store";
import { LESSON_BY_ID, ITEM_BY_ID, MODULE_BY_ID } from "../lib/content";
import { schedule } from "../../shared/scheduler";
import { now } from "../../shared/clock";
import { RichText } from "../components/RichText";
import { ItemView } from "../components/ItemView";
import { Animation } from "../animations";
import { Sheet } from "../components/Sheet";
import { TutorChat } from "../components/TutorChat";
import { ProvenanceLine } from "../components/Provenance";

const LAYER_LABELS: Record<keyof ExplainLayers, string> = {
  simpler: "Explain more simply",
  mechanism: "Show the mechanism",
  compare: "Compare the closest alternatives",
  deeper: "Go deeper",
};

export function LessonPage() {
  const { lessonId } = useParams();
  const nav = useNavigate();
  const lesson = LESSON_BY_ID.get(lessonId ?? "");
  useEffect(() => {
    if (lesson) setResume(`/lesson/${lesson.id}`, lesson.title);
  }, [lesson]);
  if (!lesson) return <p>Lesson not found.</p>;
  return (
    <div className="stack">
      <div className="small">
        <Link to="/learn">Learn</Link> / <Link to={`/learn/${lesson.moduleId}`}>{MODULE_BY_ID.get(lesson.moduleId)?.title}</Link>
      </div>
      <LessonPlayer lesson={lesson} onFinish={() => nav(`/learn/${lesson.moduleId}`)} />
    </div>
  );
}

export function LessonPlayer({ lesson, onFinish }: { lesson: Lesson; onFinish: () => void }) {
  const s = useLearner();
  const saved = s.lessonProgress[lesson.id];
  const [step, setStep] = useState(() => (saved && !saved.completedAt ? Math.min(saved.step, lesson.steps.length - 1) : 0));
  const [answered, setAnswered] = useState<Set<number>>(new Set());
  const [layer, setLayer] = useState<keyof ExplainLayers | null>(null);
  const [askAI, setAskAI] = useState(false);
  const cur = lesson.steps[step];
  const furthest = saved?.completedAt ? lesson.steps.length : saved?.step ?? 0;

  const go = (n: number) => {
    setStep(n);
    setLayer(null);
    update((x) => ({ ...x, lessonProgress: { ...x.lessonProgress, [lesson.id]: { ...x.lessonProgress[lesson.id], step: Math.max(n, x.lessonProgress[lesson.id]?.step ?? 0), lessonVersion: lesson.meta.version } } }));
  };

  const finish = () => {
    const t = now();
    update((x) => {
      const reviews = { ...x.reviews };
      if (cur.kind === "summary") {
        for (const id of cur.reviewItemIds) if (!reviews[id] && ITEM_BY_ID.has(id)) reviews[id] = schedule(id, lesson.moduleId, "lesson", t, 1);
      }
      return { ...x, reviews, resume: null, lessonProgress: { ...x.lessonProgress, [lesson.id]: { step: lesson.steps.length - 1, completedAt: t, lessonVersion: lesson.meta.version } } };
    });
    onFinish();
  };

  const isQuestion = cur.kind === "predict" || cur.kind === "apply";
  const canNext = !isQuestion || answered.has(step) || step < furthest;

  return (
    <div className="stack">
      <div className="row between">
        <h1 style={{ margin: 0 }}>{lesson.title}</h1>
        <span className="small muted">
          Step {step + 1} of {lesson.steps.length}
        </span>
      </div>
      <div className="dots" aria-hidden="true">
        {lesson.steps.map((_, i) => (
          <span key={i} className={i === step ? "on" : i < Math.max(step, furthest) ? "done" : ""} />
        ))}
      </div>

      <div className="card">
        <h2>{cur.title}</h2>
        {cur.kind === "hook" && (
          <div className="card tight teal">
            <RichText text={cur.body} />
          </div>
        )}
        {cur.kind === "explain" && (
          <>
            <RichText text={cur.body} />
            {cur.layers && (
              <div className="row" role="group" aria-label="Other ways to explain">
                {(Object.keys(LAYER_LABELS) as (keyof ExplainLayers)[])
                  .filter((k) => cur.layers?.[k])
                  .map((k) => (
                    <button key={k} className="chip" onClick={() => { setLayer(k); setAskAI(false); }}>
                      {LAYER_LABELS[k]}
                    </button>
                  ))}
              </div>
            )}
          </>
        )}
        {cur.kind === "animation" && (
          <div className="stack">
            {cur.task && <p className="small"><strong>Try:</strong> {cur.task}</p>}
            <Animation id={cur.animation} preset={cur.preset} />
            <p className="small muted">{cur.caption}</p>
          </div>
        )}
        {isQuestion && (
          <ItemView
            key={cur.itemId}
            item={ITEM_BY_ID.get(cur.itemId)!}
            context="lesson"
            nextLabel={step === lesson.steps.length - 1 ? "Finish" : "Next step"}
            onDone={() => {
              setAnswered((a) => new Set(a).add(step));
              go(step + 1);
            }}
          />
        )}
        {cur.kind === "summary" && (
          <>
            <ul>
              {cur.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className="small muted">Finishing schedules {cur.reviewItemIds.length} retrieval questions for spaced review. Stars come from correct answers, not from finishing.</p>
          </>
        )}
      </div>

      <div className="row between">
        <button className="btn" disabled={step === 0} onClick={() => go(step - 1)}>
          Back
        </button>
        {cur.kind === "summary" ? (
          <button className="btn primary" onClick={finish}>
            Finish lesson
          </button>
        ) : (
          !isQuestion || canNext ? (
            <button className="btn primary" disabled={!canNext} onClick={() => go(step + 1)}>
              Next
            </button>
          ) : (
            <span className="small muted">Answer to continue</span>
          )
        )}
      </div>
      <ProvenanceLine meta={lesson.meta} />

      {layer && cur.kind === "explain" && cur.layers?.[layer] && (
        <Sheet title={LAYER_LABELS[layer]} onClose={() => setLayer(null)}>
          <RichText text={cur.layers[layer]!} />
          <div className="divider" />
          {askAI ? (
            <TutorChat kind="lesson" lessonId={lesson.id} mode={layer} starter={`${LAYER_LABELS[layer]}: ${cur.title}`} />
          ) : (
            <button className="btn small" onClick={() => setAskAI(true)}>
              Ask the AI tutor for a personalized version
            </button>
          )}
          <p className="tiny muted">Your place in the lesson is kept. Close this panel to return.</p>
        </Sheet>
      )}
    </div>
  );
}
