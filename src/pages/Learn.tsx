import { useState } from "react";
import { Link } from "react-router-dom";
import { useLearner } from "../lib/store";
import { DOMAINS, MODULES, MODULE_BY_ID } from "../lib/content";
import { buildPath } from "../../shared/recommend";
import { moduleRetention } from "../../shared/scheduler";
import { now } from "../../shared/clock";
import { Stars, StatusBadge } from "../components/Bits";

export function Learn() {
  const s = useLearner();
  const t = now();
  const [showPlanned, setShowPlanned] = useState(true);
  const [view, setView] = useState<"map" | "path">("path");
  const path = buildPath(MODULES, s, t);
  const pathBy = new Map(path.map((p) => [p.moduleId, p]));
  const counts = { complete: MODULES.filter((m) => m.status === "complete").length, partial: MODULES.filter((m) => m.status === "partial").length, planned: MODULES.filter((m) => m.status === "planned").length };
  const recommended = path.find((p) => p.status === "remediate") ?? path.find((p) => p.status === "next");
  const reviews = Object.values(s.reviews);

  const tile = (id: string) => {
    const m = MODULE_BY_ID.get(id)!;
    const p = pathBy.get(id)!;
    const ret = moduleRetention(reviews, id, t);
    return (
      <Link key={id} to={`/learn/${id}`} className={`card tight module-tile ${m.status === "planned" ? "planned" : ""}`} aria-label={`${m.title}, ${m.status}`}>
        <div className="row between">
          <strong>{m.title}</strong>
          <Stars stars={s.stars.filter((x) => x.moduleId === id)} size={14} />
        </div>
        <div className="row">
          <StatusBadge status={m.status} />
          {m.status !== "planned" && <StatusBadge status={p.status} />}
          {recommended?.moduleId === id && <span className="badge blue">Recommended</span>}
          {ret !== null && <span className="badge gray">Retention {Math.round(ret * 100)}%</span>}
        </div>
        {m.prerequisites.length > 0 && <span className="tiny muted">After: {m.prerequisites.map((x) => MODULE_BY_ID.get(x)?.title).join(", ")}</span>}
      </Link>
    );
  };

  return (
    <div className="stack">
      <div className="row between">
        <h1 style={{ margin: 0 }}>Learn</h1>
        <div className="tabs" role="tablist" style={{ margin: 0, border: 0 }}>
          <button role="tab" aria-selected={view === "path"} onClick={() => setView("path")}>
            Your path
          </button>
          <button role="tab" aria-selected={view === "map"} onClick={() => setView("map")}>
            Full map
          </button>
        </div>
      </div>
      <p className="small muted">
        {counts.complete} modules complete, {counts.partial} partial, {counts.planned} planned. Planned modules show their scope but have no lessons yet. You can open any module; the path only recommends an order.
      </p>

      {view === "path" && (
        <div className="stack">
          {path
            .filter((p) => p.status !== "planned")
            .map((p, i) => {
              const m = MODULE_BY_ID.get(p.moduleId)!;
              return (
                <Link key={p.moduleId} to={`/learn/${p.moduleId}`} className={`card tight module-tile ${recommended?.moduleId === p.moduleId ? "accent" : ""}`} style={{ minHeight: 0 }}>
                  <div className="row between">
                    <span>
                      <span className="muted small">{i + 1}. </span>
                      <strong>{m.title}</strong>
                    </span>
                    <Stars stars={s.stars.filter((x) => x.moduleId === p.moduleId)} size={14} />
                  </div>
                  <div className="row small">
                    <StatusBadge status={p.status} />
                    <span className="muted">{p.reason}</span>
                  </div>
                </Link>
              );
            })}
        </div>
      )}

      {view === "map" && (
        <>
          <label className="row small">
            <input type="checkbox" checked={showPlanned} onChange={(e) => setShowPlanned(e.target.checked)} /> Show planned modules
          </label>
          {DOMAINS.map((d) => {
            const mods = MODULES.filter((m) => m.domain === d.id && (showPlanned || m.status !== "planned"));
            if (!mods.length) return null;
            return (
              <section key={d.id} className="map-domain" aria-label={d.title}>
                <h2>{d.title}</h2>
                <div className="module-grid">{mods.map((m) => tile(m.id))}</div>
              </section>
            );
          })}
        </>
      )}
      <p className="small">
        <Link to="/animations">Browse all interactive models</Link> · <Link to="/reference?tab=coverage">Content coverage and review status</Link>
      </p>
    </div>
  );
}
