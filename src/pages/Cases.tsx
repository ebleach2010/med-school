import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { CaseSummary, EncounterMode } from "../../shared/types";
import { api } from "../lib/api";
import { useLearner, update } from "../lib/store";
import { now } from "../../shared/clock";
import { ReviewBadge } from "../components/Provenance";
import { ErrorNote } from "../components/Bits";
import type { EncounterView } from "../lib/encounterTypes";

const MODE_INFO: Record<Exclude<EncounterMode, "speed">, { label: string; text: string }> = {
  full: { label: "Full workup", text: "No question limit. Graded on localization, differential, investigations, prioritization, and interpretation." },
  emergency: { label: "Emergency", text: "The clock runs. Stabilize and act on time-critical steps; investigations and treatment can run in parallel." },
  uncertainty: { label: "Diagnostic uncertainty", text: "The right endpoint may be a syndrome, a ranked differential, or further evaluation." },
  longitudinal: { label: "Longitudinal clinic", text: "Follow a patient across visits with evolving symptoms, treatment responses, and adverse effects." },
};

export function Cases() {
  const s = useLearner();
  const nav = useNavigate();
  const [cases, setCases] = useState<CaseSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<Exclude<EncounterMode, "speed">>("full");

  useEffect(() => {
    api<CaseSummary[]>("/api/cases").then(setCases).catch((e) => setError(e.message));
  }, []);

  const start = async (c: CaseSummary) => {
    try {
      const m = c.modes.includes(mode) ? mode : (c.modes.find((x) => x !== "speed") as EncounterMode);
      const v = await api<EncounterView>("/api/encounters", { method: "POST", json: { caseId: c.id, mode: m, profileId: s.profileId } });
      update((x) => ({ ...x, encounters: { ...x.encounters, [v.id]: { caseLabel: c.label, mode: m, startedAt: now(), submitted: false } } }));
      nav(`/encounter/${v.id}`);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const inProgress = Object.entries(s.encounters).filter(([, e]) => !e.submitted && e.mode !== "speed");
  const list = (cases ?? []).filter((c) => c.modes.includes(mode));

  return (
    <div className="stack">
      <h1>Cases</h1>
      <div className="card teal row between">
        <div>
          <h2 style={{ margin: 0 }}>Two-question speed round</h2>
          <p className="small muted" style={{ margin: 0 }}>A brief presentation, two requests, then your diagnosis. No hints.</p>
        </div>
        <Link className="btn primary" to="/speed">
          Play
        </Link>
      </div>

      {inProgress.length > 0 && (
        <div className="card accent">
          <h2>Resume</h2>
          {inProgress.map(([id, e]) => (
            <div key={id} className="row between small">
              <span>
                {e.caseLabel} <span className="badge gray">{e.mode}</span>
              </span>
              <Link to={`/encounter/${id}`}>Continue</Link>
            </div>
          ))}
        </div>
      )}

      <div className="tabs" role="tablist" aria-label="Encounter mode">
        {(Object.keys(MODE_INFO) as (keyof typeof MODE_INFO)[]).map((k) => (
          <button key={k} role="tab" aria-selected={mode === k} onClick={() => setMode(k)}>
            {MODE_INFO[k].label}
          </button>
        ))}
      </div>
      <p className="small muted">{MODE_INFO[mode].text} Case titles never reveal the diagnosis.</p>
      <ErrorNote error={error} />
      {!cases && !error && <p className="muted">Loading cases...</p>}
      <div className="grid two">
        {list.map((c) => (
          <div key={c.id} className="card">
            <div className="row between">
              <strong>{c.label}</strong>
              <ReviewBadge provenance={c.provenance} status={c.review} />
            </div>
            <p className="small" style={{ margin: "6px 0" }}>
              {c.age}-year-old {c.sex}, {c.setting}. {c.chiefComplaint}
            </p>
            <div className="row between">
              <span className="badge gray">Difficulty {c.difficulty}</span>
              <button className="btn small primary" onClick={() => start(c)}>
                Start
              </button>
            </div>
          </div>
        ))}
        {cases && !list.length && <p className="small muted">No cases in this mode yet.</p>}
      </div>
      <p className="tiny muted">All patients here are synthetic teaching simulations, not real people. No real patient records are used.</p>
    </div>
  );
}
