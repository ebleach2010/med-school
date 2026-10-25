import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLearner, setResume } from "../lib/store";
import { ITEM_BY_ID, MODULE_BY_ID } from "../lib/content";
import { dueEntries, whyDue, intervalDays } from "../../shared/scheduler";
import { now, DAY_MS } from "../../shared/clock";
import { ItemView } from "../components/ItemView";

/** Runs due reviews one at a time. Used by the Review page and timed sessions. */
export function ReviewRunner({ limit, onFinish }: { limit?: number; onFinish?: () => void }) {
  const s = useLearner();
  // Freeze the queue at start so items answered now do not reshuffle the session.
  const queue = useMemo(() => dueEntries(s.reviews, now()).filter((e) => ITEM_BY_ID.has(e.itemId)).slice(0, limit ?? 50), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0);
  const [showWhy, setShowWhy] = useState(false);

  if (!queue.length || i >= queue.length) {
    return (
      <div className="card green">
        <h2>{queue.length ? "Review done" : "Nothing due"}</h2>
        <p className="small muted">{queue.length ? `${queue.length} item${queue.length > 1 ? "s" : ""} reviewed. Each answer updated its next due date.` : "Items return as they start to fade."}</p>
        {onFinish && (
          <button className="btn primary" onClick={onFinish}>
            Continue
          </button>
        )}
      </div>
    );
  }
  const e = queue[i];
  const item = ITEM_BY_ID.get(e.itemId)!;
  return (
    <div className="stack">
      <div className="row between small">
        <span>
          Review {i + 1} of {queue.length} · {MODULE_BY_ID.get(e.moduleId)?.title ?? e.moduleId}
        </span>
        <button className="btn small ghost" onClick={() => setShowWhy((w) => !w)} aria-expanded={showWhy}>
          Why is this due?
        </button>
      </div>
      {showWhy && <div className="notice">{whyDue(s.reviews[e.itemId] ?? e, now())}</div>}
      <div className="card">
        <ItemView key={`${e.itemId}-${i}`} item={item} context="review" nextLabel={i === queue.length - 1 ? "Finish review" : "Next"} onDone={() => { setShowWhy(false); setI(i + 1); }} />
      </div>
    </div>
  );
}

export function ReviewPage() {
  const s = useLearner();
  const t = now();
  useEffect(() => setResume("/review", "Spaced review"), []);
  const upcoming = Object.values(s.reviews)
    .filter((e) => e.dueAt > t)
    .sort((a, b) => a.dueAt - b.dueAt)
    .slice(0, 12);
  return (
    <div className="stack">
      <h1>Spaced review</h1>
      <ReviewRunner />
      <div className="card">
        <h2>Coming up</h2>
        {upcoming.length ? (
          <table className="data">
            <thead>
              <tr>
                <th>Due</th>
                <th>Topic</th>
                <th>Interval</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((e) => (
                <tr key={e.itemId}>
                  <td>in {Math.max(1, Math.round((e.dueAt - t) / DAY_MS))} d</td>
                  <td>{MODULE_BY_ID.get(e.moduleId)?.title ?? e.moduleId}</td>
                  <td className="small muted">{intervalDays(e.box)} day box</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="small muted">
            Nothing scheduled yet. Finish a <Link to="/learn">lesson</Link> to add retrieval questions.
          </p>
        )}
      </div>
    </div>
  );
}
