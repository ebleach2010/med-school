import { useState } from "react";
import { AnimationFrame } from "./AnimationFrame";
import { cmap, wavePath } from "../components/Schematic";

type Mode = "normal" | "mg" | "lems" | "botulism";

const MODES: Record<Mode, { label: string; release: number; receptors: number; text: string }> = {
  normal: { label: "Normal", release: 1, receptors: 1, text: "Each impulse releases far more acetylcholine than needed. Even as release falls during a train, every fiber still reaches threshold: no decrement." },
  mg: { label: "Myasthenia gravis", release: 1, receptors: 0.62, text: "Antibodies remove postsynaptic receptors. The first response is near normal, but as release naturally falls over the first few impulses, fibers drop below threshold: decrement and fatigable weakness." },
  lems: { label: "Lambert-Eaton", release: 0.4, receptors: 1, text: "Antibodies to presynaptic calcium channels cut release. The resting response is small. Brief exercise lets calcium build up, boosting release: facilitation." },
  botulism: { label: "Botulism", release: 0.22, receptors: 1, text: "Toxin cleaves the proteins that release vesicles. Very little acetylcholine is released, so weakness is severe and acute; high-rate stimulation can give a modest increment." },
};

/** Fraction of muscle fibers reaching threshold for a given endplate potential. */
export function fibersFiring(epp: number): number {
  // Fiber thresholds ~ normal(mean 0.45, sd 0.06); erf approximation.
  const z = (epp - 0.45) / 0.06;
  const erf = (x: number) => {
    const s = Math.sign(x);
    const a = Math.abs(x) / Math.SQRT2;
    const t = 1 / (1 + 0.3275911 * a);
    const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
    return s * y;
  };
  return Math.max(0, Math.min(1, 0.5 * (1 + erf(z))));
}

/** Release falls over the first few impulses of a train (vesicle depletion). */
export const depletion = (n: number) => 1 - 0.25 * (1 - Math.exp(-n / 1.5));

export function trainAmplitudes(mode: Mode, facilitation = 1): number[] {
  const m = MODES[mode];
  return Array.from({ length: 10 }, (_, n) => fibersFiring(m.release * facilitation * depletion(n) * m.receptors));
}

export function NMJ() {
  const [mode, setMode] = useState<Mode>("mg");
  const [exercisedAt, setExercisedAt] = useState<number | null>(null);
  const m = MODES[mode];

  return (
    <AnimationFrame
      title="Neuromuscular junction comparator"
      caption={m.text}
      autoplay
      stepSeconds={0.8}
      controls={
        <div className="row" role="group" aria-label="Mechanism">
          {(Object.keys(MODES) as Mode[]).map((k) => (
            <button key={k} className={`chip ${mode === k ? "selected" : ""}`} aria-pressed={mode === k} onClick={() => { setMode(k); setExercisedAt(null); }}>
              {MODES[k].label}
            </button>
          ))}
          <button className="btn small teal" onClick={() => setExercisedAt(-1)}>
            10 seconds of exercise
          </button>
        </div>
      }
    >
      {(f) => {
        const pulse = Math.floor(f.t / 0.8);
        const n = pulse % 10;
        const phase = (f.t % 0.8) / 0.8;
        const exT = exercisedAt === -1 ? f.t : exercisedAt;
        if (exercisedAt === -1) setTimeout(() => setExercisedAt(f.t), 0);
        const since = exT === null ? Infinity : f.t - exT;
        const boost = mode === "lems" ? 2.5 : mode === "botulism" ? 1.8 : 1;
        const facil = since < 12 ? 1 + (boost - 1) * Math.exp(-since / 6) : 1;
        const release = m.release * facil * depletion(n);
        const epp = release * m.receptors;
        const amps = trainAmplitudes(mode, facil);
        const vesicles = Math.round(10 * release);
        const receptorCount = Math.round(10 * m.receptors);
        return (
          <svg viewBox="0 0 360 300" role="img" aria-label={`Schematic synapse, ${m.label}, impulse ${n + 1} of 10`}>
            {/* presynaptic terminal */}
            <path d="M60 20 h240 v60 q0 30 -30 30 h-180 q-30 0 -30 -30 z" fill="var(--surface)" stroke="var(--border)" />
            <text x="70" y="36" fontSize="10" fill="currentColor">Nerve terminal</text>
            {[90, 150, 210, 270].map((x, i) => (
              <rect key={i} x={x - 5} y="104" width="10" height="8" rx="2" fill={mode === "lems" ? "var(--red)" : "var(--teal)"} opacity={mode === "lems" ? 0.5 : 1}>
                <title>Voltage-gated calcium channel</title>
              </rect>
            ))}
            {Array.from({ length: 10 }, (_, i) => (
              <circle key={i} cx={85 + i * 21} cy={70} r="7" fill="var(--blue-soft)" stroke="var(--blue)" opacity={i < vesicles ? 1 : 0.25} />
            ))}
            {/* ACh crossing the cleft */}
            {Array.from({ length: vesicles }, (_, i) => (
              <circle key={i} cx={85 + i * 21} cy={114 + phase * 60} r="2.6" fill="var(--blue)" opacity={phase < 0.95 ? 1 : 0} />
            ))}
            {/* postsynaptic membrane */}
            <path d="M40 186 h280 v30 h-280 z" fill="var(--surface)" stroke="var(--border)" />
            <text x="48" y="208" fontSize="10" fill="currentColor">Muscle endplate</text>
            {Array.from({ length: 10 }, (_, i) => (
              <path key={i} d={`M${80 + i * 21} 186 q5 -10 10 0`} fill="none" stroke={i < receptorCount ? (phase > 0.7 && i < vesicles ? "var(--green)" : "var(--text-2)") : "var(--red)"} strokeWidth="2.5" strokeDasharray={i < receptorCount ? "" : "2 2"}>
                <title>{i < receptorCount ? "Acetylcholine receptor" : "Receptor lost to antibody attack"}</title>
              </path>
            ))}
            {/* EPP meter */}
            <g transform="translate(330 120)">
              <rect x="-8" y="0" width="16" height="100" fill="var(--surface-2)" stroke="var(--border)" />
              <rect x="-8" y={100 - Math.min(100, epp * 100)} width="16" height={Math.min(100, epp * 100)} fill={epp >= 0.45 ? "var(--green)" : "var(--amber)"} />
              <line x1="-12" x2="12" y1={100 - 45} y2={100 - 45} stroke="var(--red)" strokeDasharray="3 2" />
              <text x="-28" y="-6" fontSize="9" fill="currentColor">endplate</text>
            </g>
            {/* repetitive stimulation trace */}
            <text x="10" y="238" fontSize="10" fill="currentColor">Responses to a slowed 3 Hz train (schematic)</text>
            {amps.map((a, i) => (
              <path key={i} d={wavePath((x) => cmap(x, 2, a * 30, 8), 26, 280)} transform={`translate(${10 + i * 32} 0)`} fill="none" stroke={i === n ? "var(--blue)" : "var(--text-3)"} strokeWidth={i === n ? 2.4 : 1.4} />
            ))}
          </svg>
        );
      }}
    </AnimationFrame>
  );
}
