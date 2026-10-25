import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLearner, update, setResume, testOut } from "../lib/store";
import { ITEMS, ITEM_BY_ID, SCREENING_IDS, MODULES, MODULE_BY_ID, LESSONS } from "../lib/content";
import { nextPlacementItem, placementReport, PLACEMENT_MAX_ITEMS } from "../../shared/placement";
import { recommendNext } from "../../shared/recommend";
import { now } from "../../shared/clock";
import { SKILL_LABELS } from "../../shared/types";
import { ItemView } from "../components/ItemView";
import { Bar, StatusBadge } from "../components/Bits";
import { Disclaimer } from "./Today";

export function Placement() {
  const s = useLearner();
  const p = s.placement;
  const placementAttempts = s.attempts.filter((a) => a.context === "placement");

  useEffect(() => {
    if (p?.status === "in-progress") setResume("/placement", "Placement assessment");
  }, [p?.status]);

  if (!p) {
    return (
      <div className="stack">
        <h1>Placement assessment</h1>
        <div className="card">
          <p>A short adaptive check of nine abilities: terminology, localization, mechanisms, history and examination, differential diagnosis, choosing investigations, interpreting results, emergencies, and reasoning under uncertainty.</p>
          <ul className="small">
            <li>It starts with a 9-question screen, then asks more only where your level is unclear.</li>
            <li>Usually 15 to 30 questions. Stop any time; it resumes where you left off.</li>
            <li>Choose "I don't know" freely. Guessing makes the estimate worse, not better.</li>
            <li>One right answer never counts as mastery. Topics need several independent correct answers, including a different presentation.</li>
          </ul>
          <Disclaimer />
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn primary" onClick={() => update((x) => ({ ...x, placement: { status: "in-progress", startedAt: now(), answered: [] } }))}>
              Start placement
            </button>
            <Link className="btn ghost" to="/learn">
              Skip and explore freely
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (p.status === "in-progress") {
    // Pin the current question in state so recording an answer cannot swap the item mid-question.
    const computed = p.current && !p.answered.includes(p.current) ? null : nextPlacementItem(p, placementAttempts, ITEMS, SCREENING_IDS, now());
    const pick = p.current && !p.answered.includes(p.current) ? { itemId: p.current, phase: p.answered.length < SCREENING_IDS.length ? ("screen" as const) : ("branch" as const), reason: p.answered.length < SCREENING_IDS.length ? "Screening block: one question per ability." : "Gathering more evidence where your estimate is still uncertain." } : computed;
    if (pick && p.current !== pick.itemId) setTimeout(() => update((x) => (x.placement && !x.placement.current ? { ...x, placement: { ...x.placement, current: pick.itemId } } : x)), 0);
    if (!pick) {
      // Nothing left to ask: finish.
      setTimeout(() => update((x) => ({ ...x, placement: { ...x.placement!, status: "complete", finishedAt: now() }, resume: null })), 0);
      return <p>Finishing...</p>;
    }
    const item = ITEM_BY_ID.get(pick.itemId)!;
    return (
      <div className="stack">
        <div className="row between">
          <h1 style={{ margin: 0 }}>Placement</h1>
          <span className="small muted">
            Question {p.answered.length + 1} {pick.phase === "screen" ? `of ${SCREENING_IDS.length} (screening)` : `(focused, max ${PLACEMENT_MAX_ITEMS})`}
          </span>
        </div>
        <Bar value={p.answered.length / Math.max(SCREENING_IDS.length, Math.min(PLACEMENT_MAX_ITEMS, p.answered.length + 6))} label="Placement progress" tone="blue" />
        <p className="small muted">{pick.reason}</p>
        <div className="card">
          <ItemView
            item={item}
            context="placement"
            showFeedback={false}
            nextLabel="Next question"
            onDone={() => update((x) => ({ ...x, placement: { ...x.placement!, answered: [...x.placement!.answered, item.id], current: undefined } }))}
          />
        </div>
        <div className="row">
          <Link to="/" className="btn ghost">
            Pause (resume later)
          </Link>
          <button className="btn ghost" onClick={() => update((x) => ({ ...x, placement: { ...x.placement!, status: "complete", finishedAt: now(), endedEarly: true }, resume: null }))}>
            Finish now
          </button>
        </div>
      </div>
    );
  }

  return <PlacementReportView />;
}

function PlacementReportView() {
  const s = useLearner();
  const t = now();
  const placementAttempts = s.attempts.filter((a) => a.context === "placement");
  const r = placementReport(placementAttempts, MODULES, t);
  const rec = recommendNext(MODULES, LESSONS, s, t);
  const testOuts = r.modules.filter((m) => m.verdict === "test-out");
  const gaps = r.modules.filter((m) => m.verdict === "gap");
  const more = r.modules.filter((m) => m.verdict === "needs-assessment");

  return (
    <div className="stack">
      <h1>Your placement results</h1>
      <p className="small muted">
        Based on {r.itemsAnswered} questions{s.placement?.endedEarly ? " (ended early, so more areas need assessment)" : ""}. {r.idkCount ? `You chose "I don't know" ${r.idkCount} times, which keeps the estimates honest.` : ""}
      </p>
      <Disclaimer />

      <div className="card teal">
        <div className="small muted">Recommended starting point</div>
        <h2>{rec.title}</h2>
        <p className="small">{rec.why}</p>
        <Link className="btn primary" to={rec.route}>
          Start
        </Link>
      </div>

      <div className="card">
        <h2>Abilities</h2>
        <table className="data">
          <thead>
            <tr>
              <th>Ability</th>
              <th>Status</th>
              <th>Evidence</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(r.skills).map(([k, e]) => (
              <tr key={k}>
                <td>{SKILL_LABELS[k as keyof typeof SKILL_LABELS]}</td>
                <td>
                  <StatusBadge status={e.status} />
                </td>
                <td className="small muted">
                  {e.why} {e.independent ? `(${e.independent} items, estimate ${Math.round(e.mean * 100)}% ± ${Math.round(e.sd * 100)})` : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid two">
        <div className="card green">
          <h2>Demonstrated strengths</h2>
          {r.strengths.length ? (
            <ul className="small">
              {r.strengths.map((k) => (
                <li key={k}>{SKILL_LABELS[k]}</li>
              ))}
            </ul>
          ) : (
            <p className="small muted">No ability met the bar yet: several independent correct answers across different presentations.</p>
          )}
        </div>
        <div className="card">
          <h2>Topics you can test out of</h2>
          {testOuts.length ? (
            <>
              {testOuts.map((m) => (
                <div key={m.moduleId} className="row between small" style={{ padding: "4px 0" }}>
                  <span>{MODULE_BY_ID.get(m.moduleId)?.title}</span>
                  {s.testedOut.includes(m.moduleId) ? (
                    <span className="badge green">Skipped</span>
                  ) : (
                    <button className="btn small" onClick={() => testOut(m.moduleId, MODULE_BY_ID.get(m.moduleId)!.challengeItems)}>
                      Skip it
                    </button>
                  )}
                </div>
              ))}
              <p className="tiny muted">Skipped modules still get occasional retention checks.</p>
            </>
          ) : (
            <p className="small muted">None yet. You can still challenge any module from the Learn map.</p>
          )}
        </div>
        <div className="card danger">
          <h2>Gaps that need instruction</h2>
          {gaps.length ? (
            gaps.map((m) => (
              <div key={m.moduleId} className="row between small" style={{ padding: "4px 0" }}>
                <Link to={`/learn/${m.moduleId}`}>{MODULE_BY_ID.get(m.moduleId)?.title}</Link>
                <span className="muted">{m.why}</span>
              </div>
            ))
          ) : (
            <p className="small muted">No clear gaps found in the modules sampled.</p>
          )}
        </div>
        <div className="card warn">
          <h2>Needs more assessment</h2>
          {more.length || r.needsMore.length ? (
            <>
              {more.map((m) => (
                <div key={m.moduleId} className="small">
                  {MODULE_BY_ID.get(m.moduleId)?.title}: <span className="muted">{m.why}</span>
                </div>
              ))}
              {r.needsMore.length > 0 && <p className="small muted">Abilities still uncertain: {r.needsMore.map((k) => SKILL_LABELS[k]).join(", ")}.</p>}
            </>
          ) : (
            <p className="small muted">Nothing outstanding.</p>
          )}
        </div>
      </div>
      <div className="row">
        <Link to="/learn" className="btn">
          Open the curriculum map
        </Link>
        <button className="btn ghost" onClick={() => update((x) => ({ ...x, placement: { ...x.placement!, status: "in-progress", endedEarly: false } }))}>
          Continue assessing
        </button>
      </div>
    </div>
  );
}
