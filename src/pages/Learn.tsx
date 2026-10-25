import { Link } from "react-router-dom";
import { useLearner } from "../lib/store";
import { DOMAINS, MODULES, MODULE_BY_ID } from "../lib/content";
import { buildPath, type PathEntry } from "../../shared/recommend";
import { now } from "../../shared/clock";
import type { LearnerState, Module } from "../../shared/types";
import { Stars } from "../components/Bits";
import { Icon, Ring } from "../components/Icon";

/** Share of a module's lessons finished; tested-out modules count as complete. */
export function moduleProgress(m: Module, s: LearnerState): number {
  if (s.testedOut.includes(m.id)) return 1;
  if (!m.lessons.length) return 0;
  return m.lessons.filter((id) => s.lessonProgress[id]?.completedAt).length / m.lessons.length;
}

export function pathLine(p: PathEntry, m: Module): string {
  switch (p.status) {
    case "done":
      return "Complete";
    case "tested-out":
      return "Tested out";
    case "can-skip":
      return "Placement says you can skip this";
    case "remediate":
      return "Placement found a gap";
    case "locked":
      return `After ${m.prerequisites.map((x) => MODULE_BY_ID.get(x)?.title).filter(Boolean)[0] ?? "prerequisites"}`;
    default:
      return m.lessons.length ? `${m.lessons.length} lesson${m.lessons.length === 1 ? "" : "s"} · ${m.minutes} min` : "Practice questions; lessons coming";
  }
}

export function ModuleRow({ m, p, s, current }: { m: Module; p: PathEntry; s: LearnerState; current?: boolean }) {
  const prog = moduleProgress(m, s);
  return (
    <Link to={`/learn/${m.id}`} className={`list-row ${p.status === "locked" ? "dim" : ""} ${current ? "current" : ""}`}>
      <Ring value={prog} size={40} stroke={4} icon={p.status === "locked" ? "lock" : p.status === "tested-out" ? "skip" : "book"} />
      <div className="grow">
        <div className="title">{m.title}</div>
        <div className="sub" style={p.status === "remediate" ? { color: "var(--red)", fontWeight: 700 } : undefined}>
          {current ? "Up next · " : ""}
          {pathLine(p, m)}
        </div>
      </div>
      <Stars stars={s.stars.filter((x) => x.moduleId === m.id)} size={14} />
    </Link>
  );
}

export function Learn() {
  const s = useLearner();
  const t = now();
  const path = buildPath(MODULES, s, t);
  const order = new Map(path.map((p, i) => [p.moduleId, i]));
  const pathBy = new Map(path.map((p) => [p.moduleId, p]));
  const live = MODULES.filter((m) => m.status !== "planned");
  const planned = MODULES.filter((m) => m.status === "planned");
  const recommended = path.find((p) => p.status === "remediate") ?? path.find((p) => p.status === "next");
  const overall = live.reduce((a, m) => a + moduleProgress(m, s), 0) / Math.max(1, live.length);

  const units = DOMAINS.map((d) => ({
    d,
    mods: live.filter((m) => m.domain === d.id).sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0)),
  }))
    .filter((u) => u.mods.length)
    .sort((a, b) => Math.min(...a.mods.map((m) => order.get(m.id) ?? 0)) - Math.min(...b.mods.map((m) => order.get(m.id) ?? 0)));

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Neurology</h1>
          <div className="small faint">
            {live.length} modules ready · {planned.length} coming
          </div>
        </div>
        <Ring value={overall} size={52} stroke={6} label={`${Math.round(overall * 100)} percent complete`} />
      </div>

      {units.map(({ d, mods }, i) => {
        const done = mods.filter((m) => moduleProgress(m, s) >= 1).length;
        const hasRec = mods.some((m) => m.id === recommended?.moduleId);
        return (
          <details key={d.id} className="unit" open={hasRec || i === 0}>
            <summary>
              <Ring value={done / mods.length} size={36} stroke={4} />
              <div className="grow">
                <div className="sub" style={{ fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", fontSize: "0.7rem" }}>
                  Unit {i + 1}
                </div>
                <div className="title">{d.title}</div>
                <div className="sub">
                  {done} of {mods.length} done
                </div>
              </div>
              <span className="chev">
                <Icon name="chevron" />
              </span>
            </summary>
            <div className="unit-body">
              {mods.map((m) => (
                <ModuleRow key={m.id} m={m} p={pathBy.get(m.id)!} s={s} current={m.id === recommended?.moduleId} />
              ))}
            </div>
          </details>
        );
      })}

      <details className="unit" style={{ marginTop: 10 }}>
        <summary>
          <span className="ico gray sm">
            <Icon name="clock" />
          </span>
          <div className="grow">
            <div className="title">Coming soon</div>
            <div className="sub">{planned.length} planned modules. Scope is listed; lessons are not written yet.</div>
          </div>
          <span className="chev">
            <Icon name="chevron" />
          </span>
        </summary>
        <div className="unit-body">
          {planned.map((m) => (
            <Link key={m.id} to={`/learn/${m.id}`} className="list-row dim" style={{ minHeight: 48 }}>
              <div className="grow">
                <div className="title" style={{ fontWeight: 600 }}>{m.title}</div>
                <div className="sub">{DOMAINS.find((d) => d.id === m.domain)?.title}</div>
              </div>
              <span className="chev">
                <Icon name="chevron" />
              </span>
            </Link>
          ))}
        </div>
      </details>

      <div className="list" style={{ marginTop: 14 }}>
        <Link to="/animations" className="list-row">
          <span className="ico teal sm">
            <Icon name="film" />
          </span>
          <div className="grow title">Interactive models</div>
          <span className="chev">
            <Icon name="chevron" />
          </span>
        </Link>
        <Link to="/reference?tab=coverage" className="list-row">
          <span className="ico gray sm">
            <Icon name="list" />
          </span>
          <div className="grow title">What is covered and reviewed</div>
          <span className="chev">
            <Icon name="chevron" />
          </span>
        </Link>
      </div>
    </div>
  );
}
