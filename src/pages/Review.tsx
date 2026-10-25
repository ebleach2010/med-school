import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLearner, setResume } from "../lib/store";
import { ITEM_BY_ID, MODULE_BY_ID } from "../lib/content";
import { dueEntries, whyDue, intervalDays } from "../../shared/scheduler";
import { now, DAY_MS } from "../../shared/clock";
import { ItemView, type ItemResult } from "../components/ItemView";
import { ContinueBar, FocusShell, useFocusProgress, useFocusScroll } from "../components/FocusShell";
import { Icon } from "../components/Icon";

/** Runs due reviews one at a time. Used by the Review page and timed sessions. */
export function ReviewRunner({ limit, onFinish }: { limit?: number; onFinish: () => void }) {
  const s = useLearner();
  // Freeze the queue at start so items answered now do not reshuffle the session.
  const queue = useMemo(() => dueEntries(s.reviews, now()).filter((e) => ITEM_BY_ID.has(e.itemId)).slice(0, limit ?? 50), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0);
  const [results, setResults] = useState<ItemResult[]>([]);
  const [showWhy, setShowWhy] = useState(false);
  const scrollTop = useFocusScroll();
  useFocusProgress(queue.length ? i / queue.length : 1, i < queue.length ? `${i + 1}/${queue.length}` : undefined);

  if (!queue.length || i >= queue.length) {
    const right = results.filter((r) => r.grade.score >= 0.8).length;
    return (
      <>
        <div className="done-screen">
          <div className="big-ico">
            <Icon name={queue.length ? "check" : "refresh"} />
          </div>
          <h1>{queue.length ? "Review done" : "All caught up"}</h1>
          {queue.length > 0 ? (
            <div className="score-row">
              <div className="score">
                <div className="v">{queue.length}</div>
                <div className="l">Reviewed</div>
              </div>
              <div className="score">
                <div className="v">{Math.round((right / Math.max(1, results.length)) * 100)}%</div>
                <div className="l">Correct</div>
              </div>
            </div>
          ) : (
            <p className="muted">Nothing is due. Items come back as they start to fade.</p>
          )}
          {queue.length > 0 && <p className="small faint">Each answer set its next due date. Misses come back sooner.</p>}
        </div>
        <ContinueBar onClick={onFinish} />
      </>
    );
  }
  const e = queue[i];
  const item = ITEM_BY_ID.get(e.itemId)!;
  return (
    <div>
      <div className="row between nowrap" style={{ marginBottom: 2 }}>
        <span className="focus-label" style={{ margin: 0 }}>
          Review · {MODULE_BY_ID.get(e.moduleId)?.title ?? e.moduleId}
        </span>
        <button className="linkish tiny" onClick={() => setShowWhy((w) => !w)} aria-expanded={showWhy}>
          Why now?
        </button>
      </div>
      {showWhy && <div className="notice" style={{ margin: "6px 0 10px" }}>{whyDue(s.reviews[e.itemId] ?? e, now())}</div>}
      <ItemView
        key={`${e.itemId}-${i}`}
        item={item}
        context="review"
        onDone={(r) => {
          setResults((x) => [...x, r]);
          setShowWhy(false);
          setI(i + 1);
          scrollTop();
        }}
      />
    </div>
  );
}

export function ReviewPage() {
  const s = useLearner();
  const nav = useNavigate();
  const t = now();
  const [running, setRunning] = useState(() => dueEntries(s.reviews, t).length > 0);
  useEffect(() => {
    if (running) setResume("/review", "Spaced review");
  }, [running]);

  if (running)
    return (
      <FocusShell closeTo="/">
        <ReviewRunner onFinish={() => { setRunning(false); nav("/"); }} />
      </FocusShell>
    );

  const upcoming = Object.values(s.reviews)
    .filter((e) => e.dueAt > t)
    .sort((a, b) => a.dueAt - b.dueAt)
    .slice(0, 12);
  return (
    <div>
      <div className="page-head">
        <h1>Review</h1>
      </div>
      <div className="callout">
        <span className="ico sm green">
          <Icon name="check" />
        </span>
        <div className="grow">Nothing due right now. Questions come back on a schedule, just before you are likely to forget them.</div>
      </div>
      <div className="section-title">
        <h2>Coming up</h2>
      </div>
      {upcoming.length ? (
        <div className="list">
          {upcoming.map((e) => (
            <div key={e.itemId} className="list-row" style={{ cursor: "default", minHeight: 52 }}>
              <div className="grow">
                <div className="title small">{MODULE_BY_ID.get(e.moduleId)?.title ?? e.moduleId}</div>
                <div className="sub">{intervalDays(e.box)}-day interval</div>
              </div>
              <span className="badge gray">in {Math.max(1, Math.round((e.dueAt - t) / DAY_MS))}d</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="small muted">
          Nothing scheduled yet. Finish a <Link to="/learn">lesson</Link> to add review questions.
        </p>
      )}
    </div>
  );
}
