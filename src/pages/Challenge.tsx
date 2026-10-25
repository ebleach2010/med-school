import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MODULE_BY_ID, ITEM_BY_ID, ITEMS } from "../lib/content";
import { update, testOut } from "../lib/store";
import { now } from "../../shared/clock";
import { ItemView, type ItemResult } from "../components/ItemView";

/** Pass rule: average at least 80%, no "I don't know", and a correct application item. */
export function challengePassed(results: ItemResult[]): boolean {
  if (!results.length) return false;
  const avg = results.reduce((t, r) => t + r.grade.score, 0) / results.length;
  const noIdk = results.every((r) => r.attempt.confidence !== "idk");
  const transfer = results.some((r) => r.attempt.transfer && r.grade.score >= 0.8);
  return avg >= 0.8 && noIdk && transfer;
}

export function Challenge() {
  const { moduleId } = useParams();
  const m = MODULE_BY_ID.get(moduleId ?? "");
  const [started, setStarted] = useState(false);
  const [i, setI] = useState(0);
  const [results, setResults] = useState<ItemResult[]>([]);
  if (!m) return <p>Module not found.</p>;
  const items = m.challengeItems.map((id) => ITEM_BY_ID.get(id)).filter(Boolean) as NonNullable<ReturnType<typeof ITEM_BY_ID.get>>[];

  if (!started)
    return (
      <div className="stack">
        <div className="small">
          <Link to={`/learn/${m.id}`}>{m.title}</Link> / Challenge
        </div>
        <h1>Challenge: {m.title}</h1>
        <div className="card">
          <p>{items.length} questions, including at least one application to a new presentation. Pass to skip this module. Explanations appear at the end.</p>
          <p className="small muted">Passing needs an average of 80 percent, no "I don't know", and a correct application question. Skipped modules still get retention checks later.</p>
          <button className="btn primary" onClick={() => setStarted(true)}>
            Begin challenge
          </button>
        </div>
      </div>
    );

  if (i < items.length) {
    return (
      <div className="stack">
        <div className="row between">
          <h1 style={{ margin: 0 }}>Challenge</h1>
          <span className="small muted">
            {i + 1} of {items.length}
          </span>
        </div>
        <div className="card">
          <ItemView
            key={items[i].id}
            item={items[i]}
            context="challenge"
            showFeedback={false}
            nextLabel={i === items.length - 1 ? "See result" : "Next"}
            onDone={(r) => {
              const next = [...results, r];
              setResults(next);
              setI(i + 1);
              if (next.length === items.length) {
                const passed = challengePassed(next);
                update((x) => ({ ...x, challenges: { ...x.challenges, [m.id]: { passed, ts: now(), attemptIds: next.map((n) => n.attempt.id) } } }));
                if (passed) {
                  // Retention checks use other reviewable items from the module where available.
                  const others = ITEMS.filter((it) => it.modules.includes(m.id) && it.usage.includes("review") && !m.challengeItems.includes(it.id)).map((it) => it.id);
                  testOut(m.id, (others.length ? others : m.challengeItems).slice(0, 4));
                }
              }
            }}
          />
        </div>
      </div>
    );
  }

  const passed = challengePassed(results);
  return (
    <div className="stack">
      <h1>{passed ? "Challenge passed" : "Not yet"}</h1>
      <div className={`card ${passed ? "green" : "warn"}`}>
        <p>{passed ? `You can skip ${m.title}. Retention checks will appear in your reviews over the coming weeks.` : "Some answers showed gaps. The lessons will fill them quickly, and missed questions come back in review."}</p>
        <Link className="btn primary" to={passed ? "/learn" : `/learn/${m.id}`}>
          {passed ? "Back to the map" : "Go to the lessons"}
        </Link>
      </div>
      <div className="card">
        <h2>Answers and explanations</h2>
        {results.map((r, k) => (
          <div key={k} className="small" style={{ padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
            <strong>{Math.round(r.grade.score * 100)}%</strong> {r.grade.feedback} <span className="muted">Expected: {r.grade.keySummary}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
