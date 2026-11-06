import { useState } from "react";
import { AnimationFrame } from "./AnimationFrame";
import { cmap, wavePath } from "../components/Schematic";

type Mode = "normal" | "demyelinating" | "block" | "axonal";

const MODES: Record<Mode, { label: string; text: string }> = {
  normal: { label: "Normal", text: "Myelinated fibers conduct by jumping between nodes. All five fibers arrive nearly together, so distal and proximal responses look alike." },
  demyelinating: { label: "Demyelination", text: "Stripped segments conduct slowly and unevenly. Fibers arrive late and spread out: prolonged latency, slowed velocity, and a broad, lower proximal response (temporal dispersion)." },
  block: { label: "Conduction block", text: "Some fibers cannot cross the demyelinated segment at all. Stimulating beyond it (distal) gives a normal response; stimulating before it (proximal) gives a much smaller one." },
  axonal: { label: "Axonal loss", text: "Fewer axons survive, but those left conduct at normal speed: low amplitude with near-normal latency and velocity." },
};

const FIBERS = [0, 1, 2, 3, 4];
const SLOW = [0.28, 0.4, 0.33, 0.5, 0.36];
const ZONE: [number, number] = [130, 210];
const PROX = 30;
const DIST = 240;
const MUSCLE = 330;

function alive(mode: Mode, i: number) {
  return !(mode === "axonal" && i >= 2);
}
function blocked(mode: Mode, i: number) {
  return mode === "block" && i <= 2;
}
function velocity(mode: Mode, i: number, x: number) {
  const base = 1 + i * 0.03;
  if ((mode === "demyelinating" || mode === "block") && x >= ZONE[0] && x <= ZONE[1]) return base * SLOW[i];
  return base;
}
/** Time (model units) to travel from x0 to x1 for fiber i. */
export function travelTime(mode: Mode, i: number, x0: number, x1: number) {
  let t = 0;
  for (let x = x0; x < x1; x += 1) t += 1 / velocity(mode, i, x);
  return t;
}
function position(mode: Mode, i: number, t: number) {
  let x = PROX;
  let tt = 0;
  while (x < MUSCLE && tt < t) {
    if (blocked(mode, i) && x >= ZONE[0] + 20) return { x, stopped: true };
    tt += 1 / velocity(mode, i, x);
    x += 1;
  }
  return { x, stopped: false };
}

export function compoundResponse(mode: Mode, from: number) {
  return (t: number) =>
    FIBERS.reduce((sum, i) => {
      if (!alive(mode, i)) return sum;
      if (from < ZONE[0] && blocked(mode, i)) return sum;
      return sum + cmap(t, travelTime(mode, i, from, MUSCLE) / 3, 7, 10);
    }, 0);
}

export function Conduction() {
  const [mode, setMode] = useState<Mode>("demyelinating");
  return (
    <AnimationFrame
      title="Conduction explorer"
      caption={MODES[mode].text}
      autoplay
      stepSeconds={0.4}
      controls={
        <div className="row" role="group" aria-label="Nerve state">
          {(Object.keys(MODES) as Mode[]).map((k) => (
            <button key={k} className={`chip ${mode === k ? "selected" : ""}`} aria-pressed={mode === k} onClick={() => setMode(k)}>
              {MODES[k].label}
            </button>
          ))}
        </div>
      }
    >
      {(f) => {
        const cycle = (f.t * 120) % 520;
        return (
          <svg viewBox="0 0 360 330" role="img" aria-label={`Schematic nerve with five fibers, ${MODES[mode].label}`}>
            <text x="4" y="12" fontSize="10" fill="currentColor">Proximal stimulus</text>
            <text x={DIST - 30} y="12" fontSize="10" fill="currentColor">Distal stimulus</text>
            <text x={MUSCLE - 20} y="12" fontSize="10" fill="currentColor">Muscle</text>
            {(mode === "demyelinating" || mode === "block") && <rect x={ZONE[0]} y="18" width={ZONE[1] - ZONE[0]} height="120" fill="var(--amber-soft)" />}
            {FIBERS.map((i) => {
              const y = 32 + i * 24;
              const p = position(mode, i, cycle);
              return (
                <g key={i} opacity={alive(mode, i) ? 1 : 0.18}>
                  <line x1={PROX} y1={y} x2={MUSCLE} y2={y} stroke="var(--text-3)" strokeWidth="1.5" />
                  {Array.from({ length: 12 }, (_, k) => {
                    const x = PROX + 6 + k * 25;
                    const stripped = (mode === "demyelinating" || mode === "block") && x >= ZONE[0] - 10 && x <= ZONE[1];
                    return stripped ? null : <rect key={k} x={x} y={y - 5} width="19" height="10" rx="5" fill="var(--blue-soft)" stroke="var(--blue)" strokeWidth="0.8" />;
                  })}
                  {alive(mode, i) && <circle cx={p.x} cy={y} r="4" fill={p.stopped ? "var(--red)" : "var(--teal)"} />}
                </g>
              );
            })}
            <text x="4" y="168" fontSize="10" fill="currentColor">Distal stimulation response</text>
            <path d={wavePath(compoundResponse(mode, DIST), 340, 220)} fill="none" stroke="var(--blue)" strokeWidth="2" />
            <text x="4" y="250" fontSize="10" fill="currentColor">Proximal stimulation response</text>
            <path d={wavePath(compoundResponse(mode, PROX), 340, 305)} fill="none" stroke="var(--teal)" strokeWidth="2" />
          </svg>
        );
      }}
    </AnimationFrame>
  );
}
