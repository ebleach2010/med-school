import { useState } from "react";
import { AnimationFrame } from "./AnimationFrame";

// Schematic axial slice. Patient's left is drawn on the screen left (radiology images use
// the opposite convention, which the caption states).

export const TERRITORY_INFO: Record<string, { name: string; dominant: string[]; nondominant: string[] }> = {
  mca: {
    name: "Middle cerebral artery",
    dominant: ["Contralateral face and arm more than leg weakness and sensory loss", "Aphasia", "Gaze deviation toward the lesion", "Contralateral homonymous hemianopia (large infarcts)"],
    nondominant: ["Contralateral face and arm more than leg weakness and sensory loss", "Neglect and anosognosia", "Gaze deviation toward the lesion", "Contralateral homonymous hemianopia (large infarcts)"],
  },
  aca: {
    name: "Anterior cerebral artery",
    dominant: ["Contralateral leg more than arm weakness", "Abulia (apathy)", "Urinary incontinence", "Transcortical motor aphasia possible"],
    nondominant: ["Contralateral leg more than arm weakness", "Abulia (apathy)", "Urinary incontinence"],
  },
  pca: {
    name: "Posterior cerebral artery",
    dominant: ["Contralateral homonymous hemianopia, often macular sparing", "Alexia without agraphia possible", "Memory impairment if medial temporal"],
    nondominant: ["Contralateral homonymous hemianopia, often macular sparing", "Visual neglect possible", "Contralateral sensory loss if thalamus involved"],
  },
  lacunar: {
    name: "Lacunar (penetrating artery)",
    dominant: ["Pure motor hemiparesis: face, arm, and leg equally", "No aphasia, neglect, or field loss"],
    nondominant: ["Pure motor hemiparesis: face, arm, and leg equally", "No aphasia, neglect, or field loss"],
  },
  basilar: {
    name: "Basilar artery (posterior fossa)",
    dominant: ["Crossed or bilateral signs", "Reduced consciousness", "Diplopia, dysarthria, ataxia", "Can progress to locked-in syndrome"],
    nondominant: ["Crossed or bilateral signs", "Reduced consciousness", "Diplopia, dysarthria, ataxia", "Can progress to locked-in syndrome"],
  },
  "left-mca": { name: "Left middle cerebral artery", dominant: [], nondominant: [] },
  "right-mca": { name: "Right middle cerebral artery", dominant: [], nondominant: [] },
  "left-aca": { name: "Left anterior cerebral artery", dominant: [], nondominant: [] },
  "left-pca": { name: "Left posterior cerebral artery", dominant: [], nondominant: [] },
  "lacunar-left-ic": { name: "Left internal capsule lacune", dominant: [], nondominant: [] },
};

const LEFT_PATHS: Record<string, string> = {
  aca: "M150 24 Q122 26 106 62 L120 140 L150 150 Z",
  mca: "M106 62 Q46 92 42 170 Q46 238 96 266 L126 230 L120 140 Z",
  pca: "M150 150 L120 140 L126 230 L96 266 Q120 294 150 298 Z",
};
const mirrorPath = (d: string) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_m, x, y) => `${300 - Number(x)} ${y}`);

export function BrainAxial({ highlight, label, onSelect, core = 0, penumbra = 0 }: { highlight?: string; label?: string; onSelect?: (key: string) => void; core?: number; penumbra?: number }) {
  const regions: { key: string; d: string }[] = [];
  for (const side of ["left", "right"] as const) {
    for (const [t, d] of Object.entries(LEFT_PATHS)) regions.push({ key: `${side}-${t}`, d: side === "left" ? d : mirrorPath(d) });
  }
  const isHi = (k: string) => highlight === k || (highlight === "lacunar-left-ic" && k === "left-lacunar");
  return (
    <svg viewBox="0 0 300 340" role="img" aria-label={`Schematic axial brain map${label ? `, ${label} highlighted` : ""}`}>
      <text x="8" y="14" fontSize="10" fill="currentColor">Patient's left</text>
      <text x="222" y="14" fontSize="10" fill="currentColor">Patient's right</text>
      <ellipse cx="150" cy="162" rx="112" ry="142" fill="var(--surface)" stroke="var(--border)" strokeWidth="2" />
      {regions.map((r) => (
        <path
          key={r.key}
          d={r.d}
          fill={isHi(r.key) ? (r.key.endsWith("mca") ? "var(--blue)" : r.key.endsWith("aca") ? "var(--teal)" : "var(--green)") : "var(--surface-2)"}
          fillOpacity={isHi(r.key) ? 0.55 : 1}
          stroke="var(--border)"
          onClick={() => onSelect?.(r.key)}
          style={{ cursor: onSelect ? "pointer" : "default" }}
        >
          <title>{r.key.replace("-", " ").toUpperCase()}</title>
        </path>
      ))}
      <line x1="150" y1="22" x2="150" y2="300" stroke="var(--border)" />
      {(["left", "right"] as const).map((side) => (
        <circle key={side} cx={side === "left" ? 128 : 172} cy="152" r="8" fill={isHi(`${side}-lacunar`) ? "var(--red)" : "var(--surface)"} stroke="var(--text-3)" onClick={() => onSelect?.(`${side}-lacunar`)} style={{ cursor: onSelect ? "pointer" : "default" }}>
          <title>{side} internal capsule (lacunar)</title>
        </circle>
      ))}
      {core > 0 && highlight?.endsWith("mca") && (
        <g pointerEvents="none">
          <circle cx={highlight.startsWith("left") ? 80 : 220} cy="170" r={20 + penumbra * 40} fill="var(--amber)" fillOpacity="0.35" />
          <circle cx={highlight.startsWith("left") ? 80 : 220} cy="170" r={10 + core * 45} fill="var(--red)" fillOpacity="0.6" />
        </g>
      )}
      <rect x="120" y="306" width="60" height="28" rx="8" fill={highlight === "basilar" ? "var(--blue)" : "var(--surface-2)"} fillOpacity={highlight === "basilar" ? 0.55 : 1} stroke="var(--border)" onClick={() => onSelect?.("basilar")} style={{ cursor: onSelect ? "pointer" : "default" }} />
      <text x="128" y="324" fontSize="9" fill="currentColor">brainstem</text>
    </svg>
  );
}

export function VascularTerritories() {
  const [sel, setSel] = useState("left-mca");
  const [leftDominant, setLeftDominant] = useState(true);
  const [occludedAt, setOccludedAt] = useState<number | null>(null);
  const [reperfusedAt, setReperfusedAt] = useState<number | null>(null);
  const [side, kind] = sel === "basilar" ? ["", "basilar"] : (sel.split("-") as [string, string]);
  const info = TERRITORY_INFO[kind];
  const dominantSide = side === (leftDominant ? "left" : "right");
  const deficits = kind === "basilar" ? info.dominant : dominantSide ? info.dominant : info.nondominant;
  const contra = side === "left" ? "right" : "left";
  const options = [
    ["left-mca", "Left MCA"], ["right-mca", "Right MCA"], ["left-aca", "Left ACA"], ["right-aca", "Right ACA"],
    ["left-pca", "Left PCA"], ["right-pca", "Right PCA"], ["left-lacunar", "Left lacune"], ["basilar", "Basilar"],
  ];
  return (
    <AnimationFrame
      title="Vascular territory map"
      caption={`${info.name}${side ? ` (${side})` : ""}: ${deficits.join("; ").replace(/Contralateral/g, `${contra[0].toUpperCase()}${contra.slice(1)}`)}. Radiology images show the patient's left on the screen right.`}
      stepSeconds={2}
      controls={
        <div className="stack" style={{ width: "100%" }}>
          <div className="row" role="group" aria-label="Territory">
            {options.map(([k, l]) => (
              <button key={k} className={`chip ${sel === k ? "selected" : ""}`} aria-pressed={sel === k} onClick={() => { setSel(k); setOccludedAt(null); setReperfusedAt(null); }}>
                {l}
              </button>
            ))}
          </div>
          <div className="row small">
            <label className="row">
              <input type="checkbox" checked={leftDominant} onChange={(e) => setLeftDominant(e.target.checked)} /> Left hemisphere dominant for language
            </label>
            {kind === "mca" && (
              <>
                <button className="btn small" onClick={() => { setOccludedAt(-1); setReperfusedAt(null); }}>
                  Occlude and watch the penumbra
                </button>
                <button className="btn small teal" disabled={occludedAt === null || reperfusedAt !== null} onClick={() => setReperfusedAt(-1)}>
                  Reperfuse
                </button>
              </>
            )}
          </div>
        </div>
      }
    >
      {(f) => {
        if (occludedAt === -1) setTimeout(() => setOccludedAt(f.t), 0);
        if (reperfusedAt === -1) setTimeout(() => setReperfusedAt(f.t), 0);
        const since = occludedAt !== null && occludedAt >= 0 ? f.t - occludedAt : 0;
        const frozen = reperfusedAt !== null && reperfusedAt >= 0 ? reperfusedAt - (occludedAt ?? 0) : since;
        const core = occludedAt === null ? 0 : Math.min(1, frozen / 20);
        const penumbra = occludedAt === null ? 0 : Math.max(0, 1 - core) * (reperfusedAt !== null ? 0.2 : 1);
        return (
          <div>
            <BrainAxial highlight={sel === "left-lacunar" ? "left-lacunar" : sel} onSelect={(k) => setSel(k)} core={occludedAt === null ? 0 : Math.max(0.05, core)} penumbra={penumbra} />
            {occludedAt !== null && (
              <p className="small" style={{ margin: "6px 4px" }}>
                Core (red) grows into the penumbra (amber) while the artery stays blocked. {reperfusedAt !== null ? "Reperfused: the remaining penumbra is salvaged." : "Reperfuse early to save the penumbra."}
              </p>
            )}
          </div>
        );
      }}
    </AnimationFrame>
  );
}
