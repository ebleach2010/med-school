import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MODULE_BY_ID, ITEM_BY_ID, ITEMS } from "../lib/content";
import { update, testOut } from "../lib/store";
import { now } from "../../shared/clock";
import { ItemView, type ItemResult } from "../components/ItemView";
import { FocusShell } from "../components/FocusShell";
import { Icon } from "../components/Icon";

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
      <div>
        <Link to={`/learn/${m.id}`} className="crumb">
          <Icon name="back" /> {m.title}
        </Link>
        <div className="done-screen" style={{ paddingBottom: 8 }}>
          <div className="big-ico" style={{ background: "var(--blue-soft)", color: "var(--blue)" }}>
            <Icon name="skip" />
          </div>
          <h1>Test out</h1>
          <p className="muted">
            {items.length} questions on {m.title}, including one on a new presentation. Pass and the module is marked done.
          </p>
        </div>
        <div className="callout">
          <span className="ico sm gray">
            <Icon name="info" />
          </span>
          <div className="grow">To pass: average 80 percent or more, no "I don't know", and the application question right. Answers are revealed at the end. Skipped modules still get retention checks later.</div>
        </div>
        <button className="btn primary block lg" style={{ marginTop: 16 }} onClick={() => setStarted(true)}>
          Begin
        </button>
      </div>
    );

  if (i < items.length) {
    return (
      <FocusShell closeTo={`/learn/${m.id}`} progress={i / items.length} count={`${i + 1}/${items.length}`}>
        <ItemView
          key={items[i].id}
          item={items[i]}
          context="challenge"
          showFeedback={false}
          label={`Test out · ${m.title}`}
          nextLabel={i === items.length - 1 ? "See result" : "Continue"}
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
      </FocusShell>
    );
  }

  const passed = challengePassed(results);
  const avg = results.reduce((t, r) => t + r.grade.score, 0) / Math.max(1, results.length);
  return (
    <div>
      <div className="done-screen">
        <div className={`big-ico ${passed ? "" : "amber"}`}>
          <Icon name={passed ? "check" : "target"} />
        </div>
        <h1>{passed ? "You tested out" : "Not yet"}</h1>
        <p className="muted">{passed ? `${m.title} is marked done. Retention checks will show up in your reviews.` : "Some answers showed gaps. The lessons will fill them quickly, and missed questions come back in review."}</p>
        <div className="score-row">
          <div className="score">
            <div className="v">{Math.round(avg * 100)}%</div>
            <div className="l">Average</div>
          </div>
          <div className="score">
            <div className="v">
              {results.filter((r) => r.grade.score >= 0.8).length}/{results.length}
            </div>
            <div className="l">Right</div>
          </div>
        </div>
        <Link className="btn primary block lg" to={passed ? "/learn" : `/learn/${m.id}`}>
          {passed ? "Back to the course" : "Go to the lessons"}
        </Link>
      </div>
      <div className="section-title">
        <h2>Answers</h2>
      </div>
      <div className="list">
        {results.map((r, k) => (
          <div key={k} className="list-row" style={{ cursor: "default", alignItems: "flex-start" }}>
            <span className={`ico sm ${r.grade.score >= 0.8 ? "green" : r.grade.score > 0 ? "amber" : "red"}`}>
              <Icon name={r.grade.score >= 0.8 ? "check" : "x"} />
            </span>
            <div className="grow small">
              <div>{r.grade.feedback}</div>
              <div className="sub">Expected: {r.grade.keySummary}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
