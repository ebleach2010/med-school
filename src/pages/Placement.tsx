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
import { FocusShell } from "../components/FocusShell";
import { Icon, type IconName } from "../components/Icon";
import { Disclaimer } from "./Today";

const FACTS: [IconName, string][] = [
  ["clock", "About 15 to 30 questions. Stop any time; it picks up where you left off."],
  ["target", "Starts with one question per ability, then asks more only where your level is unclear."],
  ["info", "Tap \"I don't know\" freely. Guessing makes the estimate worse, not better."],
];

export function Placement() {
  const s = useLearner();
  const p = s.placement;
  const placementAttempts = s.attempts.filter((a) => a.context === "placement");

  useEffect(() => {
    if (p?.status === "in-progress") setResume("/placement", "Placement assessment");
  }, [p?.status]);

  if (!p) {
    return (
      <div>
        <div className="done-screen" style={{ paddingBottom: 8 }}>
          <div className="big-ico" style={{ background: "var(--blue-soft)", color: "var(--blue)" }}>
            <Icon name="target" />
          </div>
          <h1>Find your level</h1>
          <p className="muted">A short adaptive check of nine abilities, from terminology and localization to emergencies and reasoning under uncertainty. Your path then skips what you know.</p>
        </div>
        <div className="list">
          {FACTS.map(([icon, text]) => (
            <div key={text} className="list-row" style={{ cursor: "default" }}>
              <span className="ico sm">
                <Icon name={icon} />
              </span>
              <div className="grow small">{text}</div>
            </div>
          ))}
        </div>
        <div className="stack-sm" style={{ marginTop: 16 }}>
          <button className="btn primary block lg" onClick={() => update((x) => ({ ...x, placement: { status: "in-progress", startedAt: now(), answered: [] } }))}>
            Start placement
          </button>
          <Link className="btn ghost block" to="/learn">
            Skip and explore freely
          </Link>
        </div>
        <div style={{ marginTop: 12 }}>
          <Disclaimer compact />
        </div>
      </div>
    );
  }

  if (p.status === "in-progress") {
    // Pin the current question in state so recording an answer cannot swap the item mid-question.
    const computed = p.current && !p.answered.includes(p.current) ? null : nextPlacementItem(p, placementAttempts, ITEMS, SCREENING_IDS, now());
    const pick = p.current && !p.answered.includes(p.current) ? { itemId: p.current, phase: p.answered.length < SCREENING_IDS.length ? ("screen" as const) : ("branch" as const) } : computed;
    if (pick && p.current !== pick.itemId) setTimeout(() => update((x) => (x.placement && !x.placement.current ? { ...x, placement: { ...x.placement, current: pick.itemId } } : x)), 0);
    if (!pick) {
      // Nothing left to ask: finish.
      setTimeout(() => update((x) => ({ ...x, placement: { ...x.placement!, status: "complete", finishedAt: now() }, resume: null })), 0);
      return <p>Finishing...</p>;
    }
    const item = ITEM_BY_ID.get(pick.itemId)!;
    const screening = pick.phase === "screen";
    const total = screening ? SCREENING_IDS.length : Math.min(PLACEMENT_MAX_ITEMS, p.answered.length + 6);
    return (
      <FocusShell closeTo="/" closeLabel="Pause placement" progress={p.answered.length / Math.max(SCREENING_IDS.length, total)} count={`${p.answered.length + 1}${screening ? `/${SCREENING_IDS.length}` : ""}`}>
        <ItemView
          item={item}
          context="placement"
          showFeedback={false}
          label={screening ? "Placement · screening" : "Placement · narrowing down"}
          onDone={() => update((x) => ({ ...x, placement: { ...x.placement!, answered: [...x.placement!.answered, item.id], current: undefined } }))}
        />
        {p.answered.length >= 3 && (
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <button className="linkish small" onClick={() => update((x) => ({ ...x, placement: { ...x.placement!, status: "complete", finishedAt: now(), endedEarly: true }, resume: null }))}>
              Finish now and see results
            </button>
          </div>
        )}
      </FocusShell>
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
    <div>
      <div className="done-screen" style={{ paddingBottom: 4 }}>
        <div className="big-ico">
          <Icon name="check" />
        </div>
        <h1>Placement done</h1>
        <p className="muted small">
          {r.itemsAnswered} questions{s.placement?.endedEarly ? ", ended early" : ""}
          {r.idkCount ? `, ${r.idkCount} honest "I don't know"` : ""}. {r.strengths.length} of 9 abilities clearly demonstrated.
        </p>
      </div>

      <div className="hero">
        <div className="eyebrow">Start here</div>
        <h2>{rec.title}</h2>
        <p>{rec.why}</p>
        <Link className="btn" to={rec.route}>
          Start
        </Link>
      </div>

      <div className="section-title">
        <h2>Abilities</h2>
      </div>
      <div className="list">
        {Object.entries(r.skills).map(([k, e]) => (
          <div key={k} className="list-row" style={{ display: "block", cursor: "default" }}>
            <div className="row between nowrap" style={{ marginBottom: 6 }}>
              <span className="title small">{SKILL_LABELS[k as keyof typeof SKILL_LABELS]}</span>
              <StatusBadge status={e.status} />
            </div>
            <Bar value={e.status === "unassessed" ? 0 : e.mean} label={`${SKILL_LABELS[k as keyof typeof SKILL_LABELS]} estimate`} tone={e.status === "demonstrated" ? "green" : "teal"} />
            {e.independent > 0 && (
              <div className="sub">
                {e.independent} item{e.independent === 1 ? "" : "s"} · estimate {Math.round(e.mean * 100)}% ± {Math.round(e.sd * 100)}
              </div>
            )}
          </div>
        ))}
      </div>

      {testOuts.length > 0 && (
        <>
          <div className="section-title">
            <h2>You can skip</h2>
          </div>
          <div className="list">
            {testOuts.map((m) => (
              <div key={m.moduleId} className="list-row" style={{ cursor: "default" }}>
                <span className="ico sm green">
                  <Icon name="skip" />
                </span>
                <div className="grow title small">{MODULE_BY_ID.get(m.moduleId)?.title}</div>
                {s.testedOut.includes(m.moduleId) ? (
                  <span className="badge green">Skipped</span>
                ) : (
                  <button className="btn small" onClick={() => testOut(m.moduleId, MODULE_BY_ID.get(m.moduleId)!.challengeItems)}>
                    Skip it
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="tiny faint" style={{ marginTop: 6 }}>Skipped modules still get occasional retention checks.</p>
        </>
      )}

      {gaps.length > 0 && (
        <>
          <div className="section-title">
            <h2>Gaps to fill</h2>
          </div>
          <div className="list">
            {gaps.map((m) => (
              <Link key={m.moduleId} to={`/learn/${m.moduleId}`} className="list-row">
                <span className="ico sm red">
                  <Icon name="target" />
                </span>
                <div className="grow">
                  <div className="title small">{MODULE_BY_ID.get(m.moduleId)?.title}</div>
                  <div className="sub">{m.why}</div>
                </div>
                <span className="chev">
                  <Icon name="chevron" />
                </span>
              </Link>
            ))}
          </div>
        </>
      )}

      {(more.length > 0 || r.needsMore.length > 0) && (
        <div className="callout" style={{ marginTop: 16 }}>
          <span className="ico sm amber">
            <Icon name="info" />
          </span>
          <div className="grow">
            <strong>Not enough evidence yet</strong>
            <p style={{ margin: "2px 0 0" }}>
              {[...more.map((m) => MODULE_BY_ID.get(m.moduleId)?.title), ...r.needsMore.map((k) => SKILL_LABELS[k])].filter(Boolean).join(", ")}.{" "}
              <button className="linkish" onClick={() => update((x) => ({ ...x, placement: { ...x.placement!, status: "in-progress", endedEarly: false } }))}>
                Keep assessing
              </button>
            </p>
          </div>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <Disclaimer compact />
      </div>
    </div>
  );
}
