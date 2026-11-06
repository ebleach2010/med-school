import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ExplainLayers, Lesson, LessonStep } from "../../shared/types";
import { useLearner, update, setResume } from "../lib/store";
import { LESSON_BY_ID, ITEM_BY_ID } from "../lib/content";
import { schedule } from "../../shared/scheduler";
import { now } from "../../shared/clock";
import { RichText } from "../components/RichText";
import { ItemView } from "../components/ItemView";
import { Animation } from "../animations";
import { Sheet } from "../components/Sheet";
import { TutorChat } from "../components/TutorChat";
import { ProvenanceLine } from "../components/Provenance";
import { ContinueBar, FocusShell, useFocusProgress, useFocusScroll } from "../components/FocusShell";
import { Icon } from "../components/Icon";

const LAYER_LABELS: Record<keyof ExplainLayers, string> = {
  simpler: "Simpler",
  mechanism: "Mechanism",
  compare: "Compare",
  deeper: "Go deeper",
};
const LAYER_TITLES: Record<keyof ExplainLayers, string> = {
  simpler: "Explained more simply",
  mechanism: "The mechanism",
  compare: "Compared with the closest alternatives",
  deeper: "Going deeper",
};

const KIND_LABEL: Record<LessonStep["kind"], string> = {
  hook: "Warm-up",
  explain: "Concept",
  animation: "Interactive model",
  predict: "Predict",
  apply: "Apply it",
  summary: "Recap",
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
    <FocusShell closeTo={`/learn/${lesson.moduleId}`}>
      <LessonPlayer lesson={lesson} onFinish={() => nav(`/learn/${lesson.moduleId}`)} />
    </FocusShell>
  );
}

export function LessonPlayer({ lesson, onFinish }: { lesson: Lesson; onFinish: () => void }) {
  const s = useLearner();
  const saved = s.lessonProgress[lesson.id];
  const [step, setStep] = useState(() => (saved && !saved.completedAt ? Math.min(saved.step, lesson.steps.length - 1) : 0));
  const [layer, setLayer] = useState<keyof ExplainLayers | null>(null);
  const [askAI, setAskAI] = useState(false);
  const [finished, setFinished] = useState(false);
  const cur = lesson.steps[step];
  const furthest = saved?.completedAt ? lesson.steps.length : saved?.step ?? 0;
  const n = lesson.steps.length;
  const scrollTop = useFocusScroll();
  useFocusProgress(finished ? 1 : step / n, finished ? undefined : `${step + 1}/${n}`);

  const go = (k: number) => {
    setStep(k);
    setLayer(null);
    scrollTop();
    update((x) => ({ ...x, lessonProgress: { ...x.lessonProgress, [lesson.id]: { ...x.lessonProgress[lesson.id], step: Math.max(k, x.lessonProgress[lesson.id]?.step ?? 0), lessonVersion: lesson.meta.version } } }));
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
    setFinished(true);
    scrollTop();
  };

  if (finished) {
    const scheduled = cur.kind === "summary" ? cur.reviewItemIds.length : 0;
    return (
      <>
        <div className="done-screen">
          <div className="big-ico">
            <Icon name="check" />
          </div>
          <h1>Lesson complete</h1>
          <p className="muted">{lesson.title}</p>
          <div className="score-row">
            <div className="score">
              <div className="v">{n}</div>
              <div className="l">Steps</div>
            </div>
            <div className="score">
              <div className="v">{scheduled}</div>
              <div className="l">Reviews set</div>
            </div>
          </div>
          <p className="small faint">Review questions come back as they start to fade. Stars come from correct answers, not from finishing.</p>
        </div>
        <ContinueBar onClick={onFinish} />
      </>
    );
  }

  const isQuestion = cur.kind === "predict" || cur.kind === "apply";
  const back =
    step > 0 ? (
      <button className="btn ghost" onClick={() => go(step - 1)}>
        Back
      </button>
    ) : undefined;

  return (
    <div>
      {isQuestion ? (
        <ItemView
          key={cur.itemId}
          item={ITEM_BY_ID.get(cur.itemId)!}
          context="lesson"
          label={KIND_LABEL[cur.kind]}
          nextLabel="Continue"
          onSkip={step < furthest ? () => go(step + 1) : undefined}
          onDone={() => go(step + 1)}
        />
      ) : (
        <>
          <div className="focus-label">{KIND_LABEL[cur.kind]}</div>
          <h1 className="q">{cur.title}</h1>
          {cur.kind === "hook" && (
            <div className="card prose">
              <RichText text={cur.body} />
            </div>
          )}
          {cur.kind === "explain" && (
            <>
              <div className="prose">
                <RichText text={cur.body} />
              </div>
              {cur.layers && (
                <div className="section">
                  <div className="small faint" style={{ marginBottom: 6 }}>Need another angle?</div>
                  <div className="row" role="group" aria-label="Other ways to explain">
                    {(Object.keys(LAYER_LABELS) as (keyof ExplainLayers)[])
                      .filter((k) => cur.layers?.[k])
                      .map((k) => (
                        <button key={k} className="chip" onClick={() => { setLayer(k); setAskAI(false); }}>
                          {LAYER_LABELS[k]}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
          {cur.kind === "animation" && (
            <div className="stack">
              {cur.task && (
                <div className="callout">
                  <span className="ico sm teal">
                    <Icon name="target" />
                  </span>
                  <div className="grow">{cur.task}</div>
                </div>
              )}
              <Animation id={cur.animation} preset={cur.preset} />
              <p className="small muted">{cur.caption}</p>
            </div>
          )}
          {cur.kind === "summary" && (
            <div className="card">
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }} className="stack">
                {cur.points.map((p) => (
                  <li key={p} className="row nowrap" style={{ alignItems: "flex-start", gap: 10 }}>
                    <span style={{ color: "var(--green)", flex: "none", marginTop: 2 }}>
                      <Icon name="check" size={18} />
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {step === n - 1 && <ProvenanceLine meta={lesson.meta} />}
          <ContinueBar label={cur.kind === "summary" ? "Finish lesson" : "Continue"} onClick={cur.kind === "summary" ? finish : () => go(step + 1)} secondary={back} />
        </>
      )}

      {layer && cur.kind === "explain" && cur.layers?.[layer] && (
        <Sheet title={LAYER_TITLES[layer]} onClose={() => setLayer(null)}>
          <div className="prose">
            <RichText text={cur.layers[layer]!} />
          </div>
          <div className="divider" />
          {askAI ? (
            <TutorChat kind="lesson" lessonId={lesson.id} mode={layer} starter={`${LAYER_TITLES[layer]}: ${cur.title}`} />
          ) : (
            <button className="btn small" onClick={() => setAskAI(true)}>
              <Icon name="sparkle" /> Ask the AI tutor
            </button>
          )}
        </Sheet>
      )}
    </div>
  );
}
