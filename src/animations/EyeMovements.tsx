import { useEffect, useState } from "react";
import { AnimationFrame } from "./AnimationFrame";

// Eyes are drawn facing the viewer: the patient's RIGHT eye is on the screen LEFT.
// Gaze coordinates are from the patient's point of view: x > 0 means looking to the
// patient's right, y > 0 means looking up.

export interface EyeState {
  x: number;
  y: number;
  ptosis: number;
  pupil: number;
}
export interface Gaze {
  right: EyeState;
  left: EyeState;
  nystagmus?: "right" | "left";
  note: string;
}

export type Lesion = "normal" | "left-ino" | "right-cn6" | "right-cn3" | "left-cn4";

export const LESION_LABELS: Record<Lesion, string> = {
  normal: "Normal",
  "left-ino": "Left INO (MLF)",
  "right-cn6": "Right CN VI",
  "right-cn3": "Right CN III (compressive)",
  "left-cn4": "Left CN IV",
};

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function computeGaze(lesion: Lesion, gx: number, gy: number): Gaze {
  const right: EyeState = { x: gx, y: gy, ptosis: 0, pupil: 1 };
  const left: EyeState = { x: gx, y: gy, ptosis: 0, pupil: 1 };
  let nystagmus: Gaze["nystagmus"];
  let note = "Eyes move together. No double vision.";
  switch (lesion) {
    case "right-cn6":
      // Right lateral rectus weak: right eye cannot abduct (toward patient's right).
      right.x = clamp(gx, -1, 0.05) - 0.12;
      note = gx > 0.2 ? "Right eye fails to abduct. Horizontal diplopia, worst looking right." : "Mild inward deviation of the right eye at rest.";
      break;
    case "right-cn3":
      right.x = Math.max(gx, 0.45);
      right.y = clamp(gy, -0.55, -0.35);
      right.ptosis = 0.8;
      right.pupil = 1.8;
      note = "Right eye down and out, with ptosis and a dilated pupil. Adduction, elevation, and depression fail.";
      break;
    case "left-cn4":
      // Left superior oblique weak: left eye rides high, worst when looking down and to the patient's right.
      left.y = gy + 0.12 + (gx > 0 ? 0.12 : 0) + (gy < 0 && gx > 0 ? 0.18 : 0);
      note = "Left eye higher than the right. Vertical diplopia, worst looking down and to the right.";
      break;
    case "left-ino":
      if (gx > 0.15) {
        left.x = clamp(gx, -1, 0.08);
        nystagmus = "right";
        note = "Looking right: the left eye fails to adduct and the right eye shows abducting nystagmus.";
      } else note = "Looking left or ahead: movements look normal. Convergence is often preserved.";
      break;
  }
  return { right, left, nystagmus, note };
}

/** Static gaze for schematic figures. */
export function gazeFor(finding: string, view: "left" | "primary" | "right"): Gaze {
  const map: Record<string, Lesion> = { "left-ino": "left-ino", "right-cn6": "right-cn6", "right-cn3": "right-cn3", "left-cn4": "left-cn4", normal: "normal" };
  const gx = view === "right" ? 0.9 : view === "left" ? -0.9 : 0;
  return computeGaze(map[finding] ?? "normal", gx, 0);
}

function Eye({ cx, s, wobble }: { cx: number; s: EyeState; wobble: number }) {
  const ix = cx - s.x * 18 + wobble; // patient's right gaze moves irises toward screen left
  const iy = 50 - s.y * 12;
  return (
    <g>
      <ellipse cx={cx} cy="50" rx="34" ry="20" fill="#fff" stroke="var(--text-3)" />
      <circle cx={ix} cy={iy} r="11" fill="#4b6a88" />
      <circle cx={ix} cy={iy} r={3.4 * s.pupil} fill="#111" />
      {s.ptosis > 0 && <path d={`M${cx - 35} 50 Q${cx} ${30 - 4} ${cx + 35} 50 L${cx + 35} ${30 + s.ptosis * 22} Q${cx} ${30 + s.ptosis * 30} ${cx - 35} ${30 + s.ptosis * 22} Z`} fill="var(--surface-2)" stroke="var(--text-3)" />}
    </g>
  );
}

export function EyePair({ gaze, t = 0 }: { gaze: Gaze; t?: number }) {
  const wob = (side: "right" | "left") => (gaze.nystagmus === side ? Math.sin(t * 18) * 3 : 0);
  return (
    <svg viewBox="0 0 240 100" role="img" aria-label={gaze.note}>
      <Eye cx={70} s={gaze.right} wobble={wob("right")} />
      <Eye cx={170} s={gaze.left} wobble={wob("left")} />
      <text x="44" y="96" fontSize="9" fill="currentColor">patient's right eye</text>
      <text x="146" y="96" fontSize="9" fill="currentColor">patient's left eye</text>
    </svg>
  );
}

const TARGETS: [number, number, string][] = [
  [0.9, 0.8, "up right"], [0, 0.8, "up"], [-0.9, 0.8, "up left"],
  [0.9, 0, "right"], [0, 0, "ahead"], [-0.9, 0, "left"],
  [0.9, -0.8, "down right"], [0, -0.8, "down"], [-0.9, -0.8, "down left"],
];

export function EyeMovements() {
  const [lesion, setLesion] = useState<Lesion>("left-ino");
  const [target, setTarget] = useState<[number, number]>([0, 0]);
  const [pos, setPos] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.target instanceof HTMLElement) || !e.target.closest("[data-eye-sim]")) return;
      const d: Record<string, [number, number]> = { ArrowLeft: [0.9, 0], ArrowRight: [-0.9, 0], ArrowUp: [0, 0.8], ArrowDown: [0, -0.8] };
      if (d[e.key]) {
        e.preventDefault();
        setTarget((t) => [clamp(t[0] + d[e.key][0], -0.9, 0.9), clamp(t[1] + d[e.key][1], -0.8, 0.8)]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div data-eye-sim>
      <AnimationFrame
        title="Eye movement simulator"
        caption={computeGaze(lesion, target[0], target[1]).note}
        autoplay
        stepSeconds={0.2}
        controls={
          <div className="stack" style={{ width: "100%" }}>
            <div className="row" role="group" aria-label="Lesion">
              {(Object.keys(LESION_LABELS) as Lesion[]).map((l) => (
                <button key={l} className={`chip ${lesion === l ? "selected" : ""}`} aria-pressed={lesion === l} onClick={() => setLesion(l)}>
                  {LESION_LABELS[l]}
                </button>
              ))}
            </div>
            <div>
              <div className="small muted">Gaze target (patient's perspective; arrow keys also work)</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 120px))", gap: 4 }}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
                  const [x, y, name] = TARGETS[i];
                  // Order the grid as the viewer sees the patient: patient's right on screen left.
                  return (
                    <button key={name} className={`btn small ${target[0] === x && target[1] === y ? "selected" : ""}`} onClick={() => setTarget([x, y])} aria-label={`Look ${name}`}>
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        }
      >
        {(f) => {
          // Smoothly approach the target (instant under reduced motion).
          const k = f.reduced ? 1 : 0.18;
          if (Math.abs(pos[0] - target[0]) > 0.01 || Math.abs(pos[1] - target[1]) > 0.01) setTimeout(() => setPos([pos[0] + (target[0] - pos[0]) * k, pos[1] + (target[1] - pos[1]) * k]), 16);
          return <EyePair gaze={computeGaze(lesion, pos[0], pos[1])} t={f.t} />;
        }}
      </AnimationFrame>
    </div>
  );
}
