import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { CaseSummary, EncounterMode } from "../../shared/types";
import { api } from "../lib/api";
import { useLearner, update } from "../lib/store";
import { now } from "../../shared/clock";
import { Icon } from "../components/Icon";
import { ErrorNote } from "../components/Bits";
import type { EncounterView } from "../lib/encounterTypes";
import { useAIStatus } from "../lib/hooks";
import { DOMAINS, MODULES, MODULE_BY_ID } from "../lib/content";
import { defaultPracticeModule } from "./Practice";

type GenMode = "full" | "emergency" | "speed";
const GEN_MODES: [GenMode, string][] = [
  ["full", "Workup"],
  ["emergency", "Emergency"],
  ["speed", "Speed"],
];

/** Ask AI for a brand-new case on any topic. Every case is checked before it can be played. */
function CaseGenerator({ onReady }: { onReady: (c: CaseSummary) => void }) {
  const s = useLearner();
  const [moduleId, setModuleId] = useState(() => defaultPracticeModule(s));
  const [mode, setMode] = useState<GenMode>("full");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const go = async () => {
    setBusy(true);
    setError(null);
    try {
      onReady(await api<CaseSummary>("/api/generate/case", { method: "POST", json: { moduleId, mode } }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <div className="section-title">
        <h2>Make a new case</h2>
      </div>
      <div className="card stack-sm">
        {busy ? (
          <div className="row nowrap" style={{ gap: 14 }} aria-live="polite">
            <span className="ico green pulse">
              <Icon name="sparkle" />
            </span>
            <div className="grow small">
              <strong>Writing a case on {MODULE_BY_ID.get(moduleId)?.title}</strong>
              <div className="faint">Usually one to three minutes. Each case is checked for consistency and answer leaks before you see it. Keep this page open.</div>
            </div>
          </div>
        ) : (
          <>
            <label className="sr-only" htmlFor="gen-topic">Topic</label>
            <select id="gen-topic" className="input" value={moduleId} onChange={(e) => setModuleId(e.target.value)}>
              {DOMAINS.map((d) => {
                const mods = MODULES.filter((m) => m.domain === d.id);
                return mods.length ? (
                  <optgroup key={d.id} label={d.title}>
                    {mods.map((m) => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </optgroup>
                ) : null;
              })}
            </select>
            <div className="row nowrap">
              <div className="seg grow" role="group" aria-label="Case type" style={{ display: "flex" }}>
                {GEN_MODES.map(([k, l]) => (
                  <button key={k} style={{ flex: 1 }} aria-pressed={mode === k} onClick={() => setMode(k)}>
                    {l}
                  </button>
                ))}
              </div>
              <button className="btn green small" style={{ minHeight: 40 }} onClick={go}>
                <Icon name="sparkle" /> Make
              </button>
            </div>
            <div className="tiny faint">Written by AI on request and not reviewed. Playing it never counts toward stars or mastery.</div>
          </>
        )}
        <ErrorNote error={error} />
      </div>
    </>
  );
}

const MODE_INFO: Record<Exclude<EncounterMode, "speed">, { label: string; text: string }> = {
  full: { label: "Workup", text: "No question limit. Graded on localization, differential, investigations, prioritization, and interpretation." },
  emergency: { label: "Emergency", text: "The clock runs. Stabilize and act on time-critical steps; investigations and treatment can run in parallel." },
  uncertainty: { label: "Uncertain", text: "The right endpoint may be a syndrome, a ranked differential, or further evaluation." },
  longitudinal: { label: "Clinic", text: "Follow a patient across visits with evolving symptoms, treatment responses, and adverse effects." },
};

export function Cases() {
  const s = useLearner();
  const nav = useNavigate();
  const [cases, setCases] = useState<CaseSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<Exclude<EncounterMode, "speed">>("full");
  const ai = useAIStatus();

  useEffect(() => {
    api<CaseSummary[]>("/api/cases").then(setCases).catch((e) => setError(e.message));
  }, []);

  const start = async (c: CaseSummary, forced?: EncounterMode) => {
    try {
      const m = forced ?? (c.modes.includes(mode) ? mode : (c.modes.find((x) => x !== "speed") as EncounterMode));
      const v = await api<EncounterView>("/api/encounters", { method: "POST", json: { caseId: c.id, mode: m, profileId: s.profileId } });
      update((x) => ({ ...x, encounters: { ...x.encounters, [v.id]: { caseLabel: c.label, mode: m, startedAt: now(), submitted: false } } }));
      nav(`/encounter/${v.id}`);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const inProgress = Object.entries(s.encounters).filter(([, e]) => !e.submitted && e.mode !== "speed");
  const list = (cases ?? []).filter((c) => !c.generated && c.modes.includes(mode));
  const generated = (cases ?? []).filter((c) => c.generated);
  const play = (c: CaseSummary) => (c.modes.includes("speed") ? nav(`/speed?case=${c.id}`) : void start(c, c.modes[0]));

  return (
    <div>
      <div className="page-head">
        <h1>Cases</h1>
      </div>

      <div className="list">
        <Link to="/speed" className="list-row">
          <span className="ico amber">
            <Icon name="bolt" />
          </span>
          <div className="grow">
            <div className="title">Speed round</div>
            <div className="sub">Brief presentation, two requests, then your diagnosis</div>
          </div>
          <span className="chev">
            <Icon name="chevron" />
          </span>
        </Link>
        {inProgress.map(([id, e]) => (
          <Link key={id} to={`/encounter/${id}`} className="list-row current">
            <span className="ico">
              <Icon name="play" />
            </span>
            <div className="grow">
              <div className="title">{e.caseLabel}</div>
              <div className="sub">In progress · {MODE_INFO[e.mode as keyof typeof MODE_INFO]?.label ?? e.mode}</div>
            </div>
            <span className="chev">
              <Icon name="chevron" />
            </span>
          </Link>
        ))}
      </div>

      {ai?.mode === "live" && <CaseGenerator onReady={(c) => { setCases((x) => [c, ...(x ?? [])]); play(c); }} />}

      {generated.length > 0 && (
        <>
          <div className="section-title">
            <h2>Generated for you</h2>
          </div>
          <div className="list">
            {generated.slice(0, 8).map((c) => (
              <button key={c.id} className="list-row" onClick={() => play(c)}>
                <span className="ico green">
                  <Icon name="sparkle" />
                </span>
                <div className="grow">
                  <div className="title">{c.label}</div>
                  <div className="sub">
                    {c.modes.includes("speed") ? "Speed round" : MODE_INFO[c.modes[0] as keyof typeof MODE_INFO]?.label} · {c.age} {c.sex === "female" ? "F" : "M"} · {c.chiefComplaint}
                  </div>
                </div>
                <span className="chev">
                  <Icon name="chevron" />
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      <div className="section-title">
        <h2>Patient encounters</h2>
      </div>
      <div className="seg block" role="tablist" aria-label="Encounter mode">
        {(Object.keys(MODE_INFO) as (keyof typeof MODE_INFO)[]).map((k) => (
          <button key={k} role="tab" aria-selected={mode === k} onClick={() => setMode(k)}>
            {MODE_INFO[k].label}
          </button>
        ))}
      </div>
      <p className="small faint" style={{ margin: "8px 2px 12px" }}>{MODE_INFO[mode].text}</p>
      <ErrorNote error={error} />
      {!cases && !error && <p className="muted">Loading cases...</p>}
      {list.length > 0 && (
        <div className="list">
          {list.map((c) => (
            <button key={c.id} className="list-row" onClick={() => start(c)}>
              <span className="ico teal">
                <Icon name="steth" />
              </span>
              <div className="grow">
                <div className="title">{c.label}</div>
                <div className="sub">
                  {c.age} {c.sex === "female" ? "F" : "M"} · {c.setting} · {c.chiefComplaint}
                </div>
              </div>
              <span className="row nowrap" style={{ gap: 3 }} role="img" aria-label={`Difficulty ${c.difficulty} of 3`}>
                {[1, 2, 3].map((n) => (
                  <span key={n} style={{ width: 6, height: 14, borderRadius: 3, background: n <= c.difficulty ? "var(--teal)" : "var(--surface-3)" }} />
                ))}
              </span>
            </button>
          ))}
        </div>
      )}
      {cases && !list.length && <p className="small muted">No cases in this mode yet.</p>}
      <p className="tiny faint" style={{ marginTop: 12 }}>Every patient here is a synthetic teaching simulation. Case titles never reveal the diagnosis.</p>
    </div>
  );
}
