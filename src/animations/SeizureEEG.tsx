import { useState } from "react";
import { AnimationFrame } from "./AnimationFrame";
import { EegTraces } from "../components/Schematic";

type Mode = "focal" | "absence" | "lpds" | "status";

const MODES: Record<Mode, { label: string; pattern: string; text: string }> = {
  focal: { label: "Focal seizure that spreads", pattern: "seizure-evolution", text: "A left temporal focus begins with low-amplitude rhythmic activity that builds in amplitude and slows in frequency (evolution), then spreads to neighboring and opposite regions." },
  absence: { label: "Absence (3 Hz spike-wave)", pattern: "gspw-3hz", text: "Generalized spike-and-wave at about 3 per second appears in all channels at once: both hemispheres are involved from the start." },
  lpds: { label: "Periodic discharges", pattern: "lpds", text: "Lateralized periodic discharges repeat about once per second over one hemisphere, often after an acute injury. They sit on the ictal-interictal continuum and need clinical context." },
  status: { label: "Status timeline", pattern: "seizure-evolution", text: "As seizures continue, synaptic GABA-A receptors (blue) move inside the cell and NMDA receptors (red) increase at the surface. Benzodiazepines lose targets, so treat early and escalate in stages." },
};

const LOBES: { id: string; d: string; spreadAt: number }[] = [
  { id: "L-temporal", d: "M40 120 Q30 90 60 80 L110 95 L105 140 Q70 150 40 120 Z", spreadAt: 0 },
  { id: "L-frontal", d: "M60 80 Q70 30 140 30 L140 90 L110 95 Z", spreadAt: 0.3 },
  { id: "L-parietal", d: "M110 95 L140 90 L140 150 L105 140 Z", spreadAt: 0.45 },
  { id: "L-occipital", d: "M105 140 L140 150 L140 175 Q100 175 80 150 Z", spreadAt: 0.6 },
];
const mirrorD = (d: string) => d.replace(/(\d+(?:\.\d+)?) (\d+(?:\.\d+)?)/g, (_m, x, y) => `${280 - Number(x)} ${y}`);

/** Simplified probability that a benzodiazepine stops the seizure, falling with duration. */
export function benzoEfficacy(minutes: number): number {
  return Math.max(0.15, 0.85 * Math.exp(-minutes / 25));
}

export function SeizureEEG() {
  const [mode, setMode] = useState<Mode>("focal");
  const [given, setGiven] = useState<{ min: number; label: string; stopped: boolean }[]>([]);
  const m = MODES[mode];

  return (
    <AnimationFrame
      title="Seizure spread and schematic EEG"
      caption={m.text}
      autoplay
      stepSeconds={1}
      controls={
        <div className="row" role="group" aria-label="Pattern">
          {(Object.keys(MODES) as Mode[]).map((k) => (
            <button key={k} className={`chip ${mode === k ? "selected" : ""}`} aria-pressed={mode === k} onClick={() => { setMode(k); setGiven([]); }}>
              {MODES[k].label}
            </button>
          ))}
        </div>
      }
    >
      {(f) => {
        const progress = mode === "focal" ? Math.min(1, (f.t % 16) / 12) : mode === "absence" ? 1 : 0;
        const minutes = mode === "status" ? Math.min(60, f.t * 2) : 0;
        const stopped = given.some((g) => g.stopped);
        const lobeActive = (l: { id: string; spreadAt: number }, mirrored: boolean) => {
          if (mode === "absence") return true;
          if (mode === "lpds") return !mirrored && l.id !== "L-occipital";
          if (mode === "status") return !stopped;
          return mirrored ? progress > 0.8 : progress >= l.spreadAt;
        };
        const gaba = Math.max(2, Math.round(10 * Math.exp(-minutes / 20)));
        const nmda = Math.min(10, 3 + Math.round(minutes / 6));
        return (
          <div>
            <svg viewBox="0 0 280 190" role="img" aria-label={`Schematic brain viewed from above, ${m.label}`}>
              <text x="8" y="14" fontSize="9" fill="currentColor">Left</text>
              <text x="248" y="14" fontSize="9" fill="currentColor">Right</text>
              {LOBES.map((l) => (
                <g key={l.id}>
                  <path d={l.d} fill={lobeActive(l, false) ? "var(--red)" : "var(--surface)"} fillOpacity={lobeActive(l, false) ? 0.45 : 1} stroke="var(--border)" />
                  <path d={mirrorD(l.d)} fill={lobeActive(l, true) ? "var(--red)" : "var(--surface)"} fillOpacity={lobeActive(l, true) ? 0.45 : 1} stroke="var(--border)" />
                </g>
              ))}
            </svg>
            {mode !== "status" && <EegTraces pattern={m.pattern} t={f.t * 40} highlight={mode === "focal" ? [1, 2] : mode === "lpds" ? [0, 1, 2, 3] : undefined} />}
            {mode === "status" && (
              <div className="stack">
                <div className="bar" aria-label={`Seizure duration ${minutes.toFixed(0)} minutes`}>
                  <span style={{ width: `${(minutes / 60) * 100}%`, background: minutes < 5 ? "var(--teal)" : minutes < 20 ? "var(--amber)" : "var(--red)" }} />
                </div>
                <div className="row between small">
                  <span>0 to 5 min: stabilize</span>
                  <span>5 to 20: benzodiazepine</span>
                  <span>20 to 40: second line</span>
                  <span>40+: refractory</span>
                </div>
                <svg viewBox="0 0 280 70" role="img" aria-label={`${gaba} GABA-A and ${nmda} NMDA receptors at the synapse`}>
                  <line x1="10" y1="30" x2="270" y2="30" stroke="var(--text-3)" />
                  {Array.from({ length: gaba }, (_, i) => <rect key={`g${i}`} x={14 + i * 12} y="24" width="8" height="12" rx="2" fill="var(--blue)" />)}
                  {Array.from({ length: nmda }, (_, i) => <rect key={`n${i}`} x={150 + i * 12} y="24" width="8" height="12" rx="2" fill="var(--red)" />)}
                  <text x="14" y="58" fontSize="9" fill="currentColor">GABA-A (inhibitory)</text>
                  <text x="150" y="58" fontSize="9" fill="currentColor">NMDA (excitatory)</text>
                </svg>
                <div className="row">
                  <span className="small">Seizing for {minutes.toFixed(0)} min{stopped ? " (stopped)" : ""}.</span>
                  {["Benzodiazepine", "Second-line drug", "Anesthetic infusion"].map((label, i) => (
                    <button
                      key={label}
                      className="btn small"
                      disabled={stopped}
                      onClick={() => {
                        const p = i === 0 ? benzoEfficacy(minutes) : i === 1 ? 0.5 : 0.75;
                        setGiven((g) => [...g, { min: Math.round(minutes), label, stopped: Math.random() < p }]);
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {given.map((g, i) => (
                  <div key={i} className="small">
                    Minute {g.min}: {g.label}, {g.stopped ? "seizure stopped" : "seizure continues"}.
                    {i === 0 && g.label === "Benzodiazepine" ? ` Modeled chance at this time: ${Math.round(benzoEfficacy(g.min) * 100)}%.` : ""}
                  </div>
                ))}
                <p className="tiny muted">Probabilities are illustrative of the trend, not trial estimates.</p>
              </div>
            )}
          </div>
        );
      }}
    </AnimationFrame>
  );
}
