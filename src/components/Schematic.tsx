import type { Schematic as S } from "../../shared/types";
import { BrainAxial, TERRITORY_INFO } from "../animations/VascularTerritories";
import { EyePair, gazeFor } from "../animations/EyeMovements";

/** Build an SVG path from a function sampled across [0, width]. */
export function wavePath(fn: (x: number) => number, width: number, baseline: number, step = 1): string {
  let d = `M 0 ${baseline - fn(0)}`;
  for (let x = step; x <= width; x += step) d += ` L ${x} ${(baseline - fn(x)).toFixed(2)}`;
  return d;
}

const gauss = (x: number, mu: number, sigma: number) => Math.exp(-((x - mu) ** 2) / (2 * sigma * sigma));

/** Simplified compound muscle action potential: a biphasic bump. */
export function cmap(x: number, latency: number, amp: number, width: number): number {
  return amp * (gauss(x, latency + width * 0.5, width * 0.35) - 0.55 * gauss(x, latency + width * 1.4, width * 0.5));
}

function Ncs({ pattern }: { pattern: "normal" | "demyelinating" | "axonal" | "conduction-block" }) {
  const p = {
    normal: { dl: 20, da: 40, pl: 45, pa: 38, pw: 18, dw: 16 },
    demyelinating: { dl: 40, da: 32, pl: 110, pa: 16, pw: 42, dw: 22 },
    axonal: { dl: 21, da: 10, pl: 47, pa: 9, pw: 18, dw: 16 },
    "conduction-block": { dl: 21, da: 38, pl: 50, pa: 12, pw: 20, dw: 16 },
  }[pattern];
  return (
    <svg viewBox="0 0 320 170" role="img" aria-label={`Schematic nerve conduction traces, ${pattern} pattern`}>
      <text x="4" y="14" fontSize="10" fill="currentColor">Distal stimulation</text>
      <path d={wavePath((x) => cmap(x, p.dl, p.da, p.dw), 320, 60)} fill="none" stroke="var(--blue)" strokeWidth="2" />
      <text x="4" y="98" fontSize="10" fill="currentColor">Proximal stimulation</text>
      <path d={wavePath((x) => cmap(x, p.pl, p.pa, p.pw), 320, 145)} fill="none" stroke="var(--teal)" strokeWidth="2" />
      <line x1="0" y1="165" x2="320" y2="165" stroke="var(--border)" />
      <text x="250" y="162" fontSize="9" fill="currentColor">time →</text>
    </svg>
  );
}

function Rns({ pattern }: { pattern: "normal" | "decrement" | "increment" }) {
  const amps = Array.from({ length: 10 }, (_, i) => {
    if (pattern === "normal") return 40;
    if (pattern === "decrement") return 40 * (1 - 0.35 * Math.min(1, i / 4)) + (i > 5 ? 2 : 0);
    return i < 5 ? 10 : 30;
  });
  return (
    <svg viewBox="0 0 320 120" role="img" aria-label={`Schematic repetitive nerve stimulation, ${pattern}`}>
      {amps.map((a, i) => (
        <path key={i} d={wavePath((x) => cmap(x, 2, a, 8), 26, 70)} transform={`translate(${8 + i * 30} 0)`} fill="none" stroke={pattern === "increment" && i >= 5 ? "var(--green)" : "var(--blue)"} strokeWidth="2" />
      ))}
      {pattern === "increment" && <text x="160" y="112" fontSize="10" fill="currentColor">after 10 s exercise →</text>}
      {pattern !== "increment" && <text x="8" y="112" fontSize="10" fill="currentColor">3 Hz stimulation, responses 1 to 10</text>}
    </svg>
  );
}

const EEG_CHANNELS = ["Fp1-F7", "F7-T3", "T3-T5", "T5-O1", "Fp2-F8", "F8-T4", "T4-T6", "T6-O2"];

export function eegSample(pattern: string, ch: number, x: number, t = 0): number {
  const X = x + t;
  const noise = Math.sin(X * 0.9 + ch) * 1.2 + Math.sin(X * 2.3 + ch * 3) * 0.8;
  switch (pattern) {
    case "normal-alpha":
      return noise + (ch % 4 === 3 ? 6 * Math.sin(X * 0.62) : 2 * Math.sin(X * 0.62 + ch));
    case "focal-spikes": {
      const spike = ch === 1 || ch === 2 ? 14 * gauss(((X % 90) + 90) % 90, 45, 1.6) - 5 * gauss(((X % 90) + 90) % 90, 50, 4) : 0;
      return noise + spike;
    }
    case "gspw-3hz": {
      const ph = ((X % 33) + 33) % 33;
      return 16 * gauss(ph, 6, 1.4) - 10 * gauss(ph, 18, 5);
    }
    case "lpds": {
      const ph = ((X % 100) + 100) % 100;
      const amp = ch < 4 ? 14 : 3;
      return noise * 0.6 + amp * gauss(ph, 50, 3) - amp * 0.4 * gauss(ph, 58, 6);
    }
    case "edb":
      return 9 * Math.sin(X * 0.12 + ch * 0.3) + 2.5 * Math.sin(X * 2.4) * (Math.sin(X * 0.12 + ch * 0.3) > 0 ? 1 : 0.3);
    case "diffuse-slowing":
      return 8 * Math.sin(X * 0.18 + ch * 0.5) + noise * 0.5;
    case "seizure-evolution": {
      const prog = Math.min(1, Math.max(0, (x - 60) / 200));
      const freq = 0.9 - prog * 0.5;
      const amp = ch === 1 || ch === 2 ? 4 + prog * 12 : 1 + prog * (ch < 4 ? 8 : 3);
      return noise * (1 - prog * 0.6) + amp * Math.sin(X * freq);
    }
    default:
      return noise;
  }
}

export function EegTraces({ pattern, t = 0, width = 320, highlight }: { pattern: string; t?: number; width?: number; highlight?: number[] }) {
  return (
    <svg viewBox={`0 0 ${width + 50} ${EEG_CHANNELS.length * 26 + 14}`} role="img" aria-label={`Schematic EEG, ${pattern.replace(/-/g, " ")}`}>
      {EEG_CHANNELS.map((name, i) => (
        <g key={name} transform={`translate(0 ${i * 26 + 18})`}>
          <text x="0" y="3" fontSize="8" fill="currentColor">{name}</text>
          <path d={wavePath((x) => eegSample(pattern, i, x, t) * 0.7, width, 0, 1.5)} transform="translate(48 0)" fill="none" stroke={highlight?.includes(i) ? "var(--red)" : "var(--blue)"} strokeWidth="1.1" />
        </g>
      ))}
    </svg>
  );
}

export function Schematic({ s }: { s: S }) {
  let body: React.ReactNode = null;
  if (s.kind === "ncs") body = <Ncs pattern={s.pattern} />;
  else if (s.kind === "rns") body = <Rns pattern={s.pattern} />;
  else if (s.kind === "eeg") body = <EegTraces pattern={s.pattern} />;
  else if (s.kind === "csf-table")
    body = (
      <table className="data">
        <thead>
          <tr>
            <th>CSF</th>
            <th>Result</th>
            <th>Reference</th>
          </tr>
        </thead>
        <tbody>
          {s.rows.map((r) => (
            <tr key={r.analyte}>
              <td>{r.analyte}</td>
              <td className={r.flag ? `flag-${r.flag}` : ""}>
                {r.value} {r.flag ? `(${r.flag})` : ""}
              </td>
              <td className="muted">{r.ref}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  else if (s.kind === "eye-gaze") {
    const views: ("left" | "primary" | "right")[] = ["left", "primary", "right"];
    body = (
      <div className="grid three">
        {views.map((v) => (
          <div key={v} style={{ textAlign: "center" }}>
            <EyePair gaze={gazeFor(s.finding, v)} />
            <div className="tiny muted">Looking {v === "primary" ? "ahead" : v}</div>
          </div>
        ))}
      </div>
    );
  } else if (s.kind === "territory") body = <BrainAxial highlight={s.territory} label={TERRITORY_INFO[s.territory]?.name} />;
  return (
    <figure className="figure" style={{ margin: "8px 0" }}>
      {body}
      <figcaption className="schematic-label">Schematic teaching figure, not a patient study.</figcaption>
    </figure>
  );
}
