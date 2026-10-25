import { useMemo, useState } from "react";
import { AnimationFrame } from "./AnimationFrame";

// Schematic neuraxis. Patient's LEFT is drawn on the screen LEFT here (labels say so),
// unlike radiological images. Tracts are polylines in conduction direction; each point may
// carry a region tag that a lesion can block.

type Pt = [number, number, string?];
interface Tract {
  id: string;
  kind: "motor" | "dc" | "stt";
  body: "R" | "L";
  limb: "arm" | "leg";
  pts: Pt[];
}

const mirrorTag = (tag?: string) => (tag ? tag.replace(/-L(\b|-)/, "-X$1").replace(/-R(\b|-)/, "-L$1").replace(/-X(\b|-)/, "-R$1") : tag);
const mirror = (pts: Pt[]): Pt[] => pts.map(([x, y, tag]) => [360 - x, y, mirrorTag(tag)]);

const R_TRACTS: Tract[] = [
  {
    id: "motor-R-arm", kind: "motor", body: "R", limb: "arm",
    pts: [[110, 42, "ctx-L"], [140, 100, "cap-L"], [160, 160, "mb-L"], [160, 200, "pons-L"], [160, 236, "med-L"], [200, 262], [206, 286, "cc-R"], [206, 300], [214, 304, "ah-R-arm"], [270, 304, "nerve-R-arm"], [318, 304, "nmj-R-arm"], [336, 304, "mus-R-arm"]],
  },
  {
    id: "motor-R-leg", kind: "motor", body: "R", limb: "leg",
    pts: [[110, 42, "ctx-L"], [140, 100, "cap-L"], [160, 160, "mb-L"], [160, 200, "pons-L"], [160, 236, "med-L"], [200, 262], [206, 286, "cc-R"], [206, 366, "tc-R"], [206, 430], [214, 434, "ah-R-leg"], [270, 470, "nerve-R-leg"], [318, 470, "nmj-R-leg"], [336, 470, "mus-R-leg"]],
  },
  {
    id: "dc-R-arm", kind: "dc", body: "R", limb: "arm",
    pts: [[300, 314, "nerve-R-arm"], [214, 314], [214, 290, "cc-R"], [214, 246, "med-R"], [168, 230], [168, 200, "teg-L"], [168, 160, "mb-L"], [150, 112, "thal-L"], [118, 46, "ctx-L"]],
  },
  {
    id: "dc-R-leg", kind: "dc", body: "R", limb: "leg",
    pts: [[300, 480, "nerve-R-leg"], [214, 444], [214, 370, "tc-R"], [214, 290, "cc-R"], [214, 246, "med-R"], [168, 230], [168, 200, "teg-L"], [168, 160, "mb-L"], [150, 112, "thal-L"], [118, 46, "ctx-L"]],
  },
  {
    id: "stt-R-arm", kind: "stt", body: "R", limb: "arm",
    pts: [[300, 322, "nerve-R-arm"], [200, 322], [152, 316], [152, 290, "cc-L"], [154, 240, "med-L"], [154, 200, "teg-L"], [156, 160, "mb-L"], [144, 112, "thal-L"], [104, 46, "ctx-L"]],
  },
  {
    id: "stt-R-leg", kind: "stt", body: "R", limb: "leg",
    pts: [[300, 488, "nerve-R-leg"], [200, 448], [152, 442], [152, 370, "tc-L"], [152, 290, "cc-L"], [154, 240, "med-L"], [154, 200, "teg-L"], [156, 160, "mb-L"], [144, 112, "thal-L"], [104, 46, "ctx-L"]],
  },
];

const TRACTS: Tract[] = [...R_TRACTS, ...R_TRACTS.map((t) => ({ ...t, id: t.id.replace("-R-", "-L-"), body: "L" as const, pts: mirror(t.pts) }))];

export interface LesionDef {
  id: string;
  label: string;
  x: number;
  y: number;
  tags: string[];
  findings: { weakness: string; tone: string; reflexes: string; plantar: string; lmn: string; sensory: string; other: string };
  side: "right" | "left" | "both";
  type: "UMN" | "LMN" | "NMJ" | "Muscle";
}

export const LESIONS: LesionDef[] = [
  {
    id: "ctx-L", label: "Left motor cortex", x: 110, y: 42, tags: ["ctx-L"], side: "right", type: "UMN",
    findings: { weakness: "Right face and arm more than leg", tone: "Low at first, then spastic", reflexes: "Brisk on the right (after days)", plantar: "Right extensor", lmn: "None", sensory: "Right cortical sensory loss", other: "Aphasia if dominant hemisphere; gaze toward the lesion" },
  },
  {
    id: "cap-L", label: "Left internal capsule", x: 140, y: 100, tags: ["cap-L"], side: "right", type: "UMN",
    findings: { weakness: "Right face, arm, and leg equally", tone: "Low at first, then spastic", reflexes: "Brisk on the right", plantar: "Right extensor", lmn: "None", sensory: "Spared (pure motor lacune)", other: "No cortical signs" },
  },
  {
    id: "pons-L", label: "Left ventral pons", x: 160, y: 200, tags: ["pons-L"], side: "right", type: "UMN",
    findings: { weakness: "Right arm and leg, plus LEFT facial weakness including forehead", tone: "Spastic on the right", reflexes: "Brisk on the right", plantar: "Right extensor", lmn: "Left facial nerve (lower motor neuron)", sensory: "Usually spared", other: "Crossed signs; possible left abducens palsy" },
  },
  {
    id: "cc-R", label: "Right cervical hemicord", x: 210, y: 286, tags: ["cc-R"], side: "right", type: "UMN",
    findings: { weakness: "Right arm and leg; face spared", tone: "Spastic below the lesion", reflexes: "Brisk below the lesion on the right", plantar: "Right extensor", lmn: "Possible at the lesion level", sensory: "Right vibration and position loss; LEFT pain and temperature loss", other: "Brown-Sequard pattern" },
  },
  {
    id: "tc-both", label: "Complete thoracic cord", x: 180, y: 366, tags: ["tc-R", "tc-L"], side: "both", type: "UMN",
    findings: { weakness: "Both legs; arms spared", tone: "Flaccid in spinal shock, then spastic", reflexes: "Absent early, brisk later", plantar: "Bilateral extensor", lmn: "None", sensory: "All modalities lost below a truncal level", other: "Bladder and bowel dysfunction" },
  },
  {
    id: "ah-R-arm", label: "Right anterior horn (arm)", x: 214, y: 304, tags: ["ah-R-arm"], side: "right", type: "LMN",
    findings: { weakness: "Right arm in a myotomal pattern", tone: "Reduced", reflexes: "Reduced in the right arm", plantar: "Flexor", lmn: "Wasting and fasciculations", sensory: "Normal", other: "Pure motor; consider motor neuron disease" },
  },
  {
    id: "nerve-R-arm", label: "Right arm nerve", x: 270, y: 304, tags: ["nerve-R-arm"], side: "right", type: "LMN",
    findings: { weakness: "Muscles supplied by that nerve", tone: "Reduced", reflexes: "Reduced if the reflex arc uses that nerve", plantar: "Flexor", lmn: "Wasting over time", sensory: "Loss in the nerve's territory", other: "Motor and sensory in one nerve distribution" },
  },
  {
    id: "nmj", label: "Neuromuscular junction (all)", x: 318, y: 304, tags: ["nmj-R-arm", "nmj-R-leg", "nmj-L-arm", "nmj-L-leg"], side: "both", type: "NMJ",
    findings: { weakness: "Fatigable, often ocular, bulbar, proximal", tone: "Normal", reflexes: "Normal (MG) or reduced (LEMS)", plantar: "Flexor", lmn: "No wasting early", sensory: "Normal", other: "Fluctuates with use" },
  },
  {
    id: "muscle", label: "Muscle (all)", x: 336, y: 470, tags: ["mus-R-arm", "mus-R-leg", "mus-L-arm", "mus-L-leg"], side: "both", type: "Muscle",
    findings: { weakness: "Proximal and symmetric", tone: "Normal or reduced", reflexes: "Preserved until weakness is severe", plantar: "Flexor", lmn: "No fasciculations", sensory: "Normal", other: "Raised CK in many myopathies" },
  },
];

const PRESETS: Record<string, string[]> = {
  "umn-vs-lmn": ["cap-L", "ah-R-arm", "nerve-R-arm", "nmj", "muscle"],
  level: ["ctx-L", "cap-L", "pons-L", "cc-R", "tc-both"],
};

const COLORS = { motor: "var(--blue)", dc: "var(--teal)", stt: "var(--green)" };

function segLengths(pts: Pt[]) {
  const segs = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    segs.push(l);
    total += l;
  }
  return { segs, total };
}

function pointAt(pts: Pt[], d: number): [number, number] {
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (acc + l >= d) {
      const f = (d - acc) / l;
      return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f];
    }
    acc += l;
  }
  return [pts[pts.length - 1][0], pts[pts.length - 1][1]];
}

/** Distance along the tract where a lesion first blocks it, or null if unaffected. */
function blockDistance(t: Tract, tags: string[]): number | null {
  let acc = 0;
  for (let i = 0; i < t.pts.length; i++) {
    if (i > 0) acc += Math.hypot(t.pts[i][0] - t.pts[i - 1][0], t.pts[i][1] - t.pts[i - 1][1]);
    const tag = t.pts[i][2];
    if (tag && tags.includes(tag)) return acc;
  }
  return null;
}

export function MotorPathway({ preset = "level" }: { preset?: string }) {
  const options = LESIONS.filter((l) => (PRESETS[preset] ?? PRESETS.level).includes(l.id));
  const [lesionId, setLesionId] = useState<string | null>(null);
  const [predict, setPredict] = useState(true);
  const [guess, setGuess] = useState<{ side?: string; type?: string }>({});
  const [revealed, setRevealed] = useState(false);
  const [show, setShow] = useState({ motor: true, dc: preset === "level", stt: preset === "level" });
  const lesion = LESIONS.find((l) => l.id === lesionId) ?? null;
  const geometry = useMemo(() => TRACTS.map((t) => ({ t, ...segLengths(t.pts) })), []);

  const choose = (id: string) => {
    setLesionId(id);
    setGuess({});
    setRevealed(!predict);
  };

  const caption = !lesion
    ? "Impulses run down the corticospinal tract (blue) and up the dorsal columns (teal) and spinothalamic tract (green). Choose a lesion."
    : revealed
      ? `${lesion.label}: ${lesion.findings.weakness}. ${lesion.findings.sensory}. ${lesion.findings.other}.`
      : "Make a prediction, then reveal the findings.";

  return (
    <AnimationFrame
      title="Neuraxis lesion explorer"
      caption={caption}
      autoplay
      controls={
        <div className="stack" style={{ width: "100%" }}>
          <div className="row" role="group" aria-label="Lesion site">
            {options.map((l) => (
              <button key={l.id} className={`chip ${lesionId === l.id ? "selected" : ""}`} aria-pressed={lesionId === l.id} onClick={() => choose(l.id)}>
                {l.label}
              </button>
            ))}
            <button className="chip" onClick={() => setLesionId(null)}>
              No lesion
            </button>
          </div>
          <div className="row small">
            {(["motor", "dc", "stt"] as const).map((k) => (
              <label key={k} className="row">
                <input type="checkbox" checked={show[k]} onChange={(e) => setShow({ ...show, [k]: e.target.checked })} />
                <span style={{ color: COLORS[k] }}>{k === "motor" ? "Corticospinal" : k === "dc" ? "Dorsal columns" : "Spinothalamic"}</span>
              </label>
            ))}
            <label className="row">
              <input type="checkbox" checked={predict} onChange={(e) => setPredict(e.target.checked)} /> Predict before reveal
            </label>
          </div>
          {lesion && !revealed && (
            <div className="card tight">
              <div className="small" style={{ fontWeight: 600 }}>Your prediction</div>
              <div className="row" role="group" aria-label="Side of weakness">
                {["right", "left", "both"].map((s) => (
                  <button key={s} className={`chip ${guess.side === s ? "selected" : ""}`} aria-pressed={guess.side === s} onClick={() => setGuess({ ...guess, side: s })}>
                    Weak: {s}
                  </button>
                ))}
              </div>
              <div className="row" role="group" aria-label="Sign type" style={{ marginTop: 6 }}>
                {["UMN", "LMN", "NMJ", "Muscle"].map((s) => (
                  <button key={s} className={`chip ${guess.type === s ? "selected" : ""}`} aria-pressed={guess.type === s} onClick={() => setGuess({ ...guess, type: s })}>
                    {s}
                  </button>
                ))}
              </div>
              <button className="btn small primary" style={{ marginTop: 8 }} disabled={!guess.side || !guess.type} onClick={() => setRevealed(true)}>
                Reveal findings
              </button>
            </div>
          )}
          {lesion && revealed && (
            <div className="card tight">
              {guess.side && (
                <p className="small">
                  Prediction: side {guess.side === lesion.side ? "correct" : `not quite (${lesion.side})`}; type {guess.type === lesion.type ? "correct" : `not quite (${lesion.type})`}.
                </p>
              )}
              <table className="data">
                <tbody>
                  {Object.entries(lesion.findings).map(([k, v]) => (
                    <tr key={k}>
                      <th style={{ textTransform: "capitalize", width: "34%" }}>{k === "lmn" ? "Wasting and fasciculations" : k}</th>
                      <td>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      }
    >
      {(f) => (
        <svg viewBox="0 0 360 520" role="img" aria-label={`Schematic neuraxis${lesion ? `, lesion at ${lesion.label}` : ""}`}>
          <text x="20" y="14" fontSize="11" fill="currentColor">Patient's left</text>
          <text x="262" y="14" fontSize="11" fill="currentColor">Patient's right</text>
          <ellipse cx="110" cy="58" rx="62" ry="40" fill="var(--surface)" stroke="var(--border)" />
          <ellipse cx="250" cy="58" rx="62" ry="40" fill="var(--surface)" stroke="var(--border)" />
          <rect x="140" y="140" width="80" height="112" rx="16" fill="var(--surface)" stroke="var(--border)" />
          <text x="226" y="164" fontSize="9" fill="currentColor">midbrain</text>
          <text x="226" y="204" fontSize="9" fill="currentColor">pons</text>
          <text x="226" y="240" fontSize="9" fill="currentColor">medulla</text>
          <rect x="146" y="266" width="68" height="190" rx="22" fill="var(--surface)" stroke="var(--border)" />
          <text x="100" y="292" fontSize="9" fill="currentColor">cervical</text>
          <text x="100" y="370" fontSize="9" fill="currentColor">thoracic</text>
          <text x="96" y="436" fontSize="9" fill="currentColor">lumbosacral</text>
          <text x="300" y="296" fontSize="9" fill="currentColor">right arm</text>
          <text x="300" y="462" fontSize="9" fill="currentColor">right leg</text>
          <text x="14" y="296" fontSize="9" fill="currentColor">left arm</text>
          <text x="14" y="462" fontSize="9" fill="currentColor">left leg</text>
          {geometry.map(({ t, total }) => {
            if (!show[t.kind]) return null;
            const block = lesion ? blockDistance(t, lesion.tags) : null;
            const color = COLORS[t.kind];
            const pts = t.pts.map((p) => `${p[0]},${p[1]}`).join(" ");
            const dots = [0, 0.33, 0.66].map((o) => (((f.t * 70) / total + o) % 1) * total);
            return (
              <g key={t.id} opacity={t.body === "R" ? 1 : 0.55}>
                <polyline points={pts} fill="none" stroke={color} strokeWidth="2.2" strokeOpacity="0.35" />
                {dots.map((d, i) => {
                  const blocked = block !== null && d > block;
                  if (blocked) return null;
                  const [x, y] = pointAt(t.pts, d);
                  return <circle key={i} cx={x} cy={y} r="3.2" fill={color} />;
                })}
                {block !== null &&
                  (() => {
                    const [x, y] = pointAt(t.pts, block);
                    return <circle cx={x} cy={y} r="5" fill="none" stroke="var(--red)" strokeWidth="2" />;
                  })()}
              </g>
            );
          })}
          {lesion && (
            <g aria-hidden="true">
              <line x1={lesion.x - 8} y1={lesion.y - 8} x2={lesion.x + 8} y2={lesion.y + 8} stroke="var(--red)" strokeWidth="3" />
              <line x1={lesion.x - 8} y1={lesion.y + 8} x2={lesion.x + 8} y2={lesion.y - 8} stroke="var(--red)" strokeWidth="3" />
            </g>
          )}
        </svg>
      )}
    </AnimationFrame>
  );
}
