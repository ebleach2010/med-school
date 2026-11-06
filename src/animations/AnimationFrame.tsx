import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "../lib/hooks";

export interface FrameState {
  /** Seconds of model time. Advances while playing; jumps in steps when reduced motion is on. */
  t: number;
  playing: boolean;
  reduced: boolean;
  speed: number;
}

/**
 * Shared controls for every teaching animation: play/pause, replay, speed, step, captions,
 * reduced-motion support, and a standing label that the model is schematic.
 */
export function AnimationFrame({
  title,
  caption,
  stepSeconds = 0.5,
  autoplay = false,
  controls,
  children,
}: {
  title: string;
  caption: string;
  stepSeconds?: number;
  autoplay?: boolean;
  controls?: ReactNode;
  children: (f: FrameState) => ReactNode;
}) {
  const reduced = useReducedMotion();
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(autoplay && !reduced);
  const [speed, setSpeed] = useState(1);
  const [captions, setCaptions] = useState(true);
  const last = useRef<number | null>(null);

  useEffect(() => {
    if (!playing || reduced) return;
    let raf = 0;
    const loop = (ts: number) => {
      if (last.current !== null) setT((x) => x + ((ts - last.current!) / 1000) * speed);
      last.current = ts;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      last.current = null;
    };
  }, [playing, reduced, speed]);

  useEffect(() => {
    if (reduced) setPlaying(false);
  }, [reduced]);

  return (
    <section className="anim" aria-label={title}>
      <div className="anim-stage">{children({ t, playing, reduced, speed })}</div>
      {controls && <div className="anim-controls">{controls}</div>}
      <div className="anim-controls" role="group" aria-label="Playback controls">
        {reduced ? (
          <>
            <button className="btn small" onClick={() => setT((x) => Math.max(0, x - stepSeconds))}>
              Step back
            </button>
            <button className="btn small primary" onClick={() => setT((x) => x + stepSeconds)}>
              Step forward
            </button>
            <span className="tiny muted">Reduced motion: stepping frame by frame.</span>
          </>
        ) : (
          <button className="btn small primary" onClick={() => setPlaying((p) => !p)} aria-pressed={playing}>
            {playing ? "Pause" : "Play"}
          </button>
        )}
        <button className="btn small" onClick={() => setT(0)}>
          Replay
        </button>
        <label className="row small">
          <span>Speed</span>
          <select className="input" style={{ minHeight: 36, width: "auto" }} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} aria-label="Animation speed">
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
          </select>
        </label>
        <button className="btn small ghost" onClick={() => setCaptions((c) => !c)} aria-pressed={captions}>
          Captions {captions ? "on" : "off"}
        </button>
      </div>
      {captions && (
        <div className="anim-caption" aria-live="polite">
          {caption}
        </div>
      )}
      <div className="anim-label">Simplified schematic model for teaching. Not a recording or image from a patient.</div>
    </section>
  );
}
