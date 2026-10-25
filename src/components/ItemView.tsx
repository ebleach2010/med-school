import { useEffect, useMemo, useRef, useState } from "react";
import type { AssessmentItem, Attempt, Confidence, NeuraxisRegion } from "../../shared/types";
import { gradeItem, REGION_LABELS, type ItemGrade, type ItemResponse } from "../../shared/grading";
import { suggestSlip, bySkill } from "../../shared/mastery";
import { now } from "../../shared/clock";
import { recordAttempt, setSelfReport, getState } from "../lib/store";
import { Inline, RichText } from "./RichText";
import { Schematic } from "./Schematic";
import { ProvenanceLine } from "./Provenance";
import { STANDALONE } from "../lib/platform";

const REGION_GROUPS: { label: string; regions: NeuraxisRegion[] }[] = [
  { label: "Brain", regions: ["cortex-left", "cortex-right", "subcortical-left", "subcortical-right", "cerebellum"] },
  { label: "Brainstem", regions: ["midbrain", "pons", "medulla"] },
  { label: "Spinal cord", regions: ["cord-cervical", "cord-thoracic", "cord-lumbosacral", "anterior-horn"] },
  { label: "Peripheral", regions: ["root", "plexus", "peripheral-nerve", "nmj", "muscle"] },
];

function shuffleOnce<T>(arr: T[], seed: string): T[] {
  // Deterministic per item so options do not jump around on re-render.
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) | 0;
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) | 0;
    const j = Math.abs(h) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export interface ItemResult {
  attempt: Attempt;
  grade: ItemGrade;
}

export function ItemView({
  item,
  context,
  onDone,
  showFeedback = true,
  nextLabel = "Continue",
}: {
  item: AssessmentItem;
  context: Attempt["context"];
  onDone: (r: ItemResult) => void;
  showFeedback?: boolean;
  nextLabel?: string;
}) {
  const started = useRef(now());
  const [choice, setChoice] = useState<string | null>(null);
  const [reasonChoice, setReasonChoice] = useState<string | null>(null);
  const [multi, setMulti] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [region, setRegion] = useState<NeuraxisRegion | null>(null);
  const initialOrder = useMemo(() => (item.format === "order-priority" ? shuffleOnce(item.steps.map((s) => s.id), item.id) : []), [item]);
  const [order, setOrder] = useState<string[]>(initialOrder);
  const [result, setResult] = useState<ItemResult | null>(null);
  const [explain, setExplain] = useState(showFeedback);
  const [listening, setListening] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    started.current = now();
    setChoice(null);
    setReasonChoice(null);
    setMulti([]);
    setText("");
    setRegion(null);
    setOrder(initialOrder);
    setResult(null);
    setExplain(showFeedback);
    headingRef.current?.focus();
  }, [item.id, initialOrder, showFeedback]);

  const options = useMemo(() => (item.format === "mcq" || item.format === "multi-select" ? shuffleOnce(item.options, item.id) : []), [item]);
  const testOptions = useMemo(() => (item.format === "select-tests" ? shuffleOnce(item.options, item.id) : []), [item]);

  const response = (): ItemResponse | null => {
    switch (item.format) {
      case "mcq":
        return choice ? { kind: "mcq", optionId: choice, reasoningOptionId: reasonChoice ?? undefined } : null;
      case "multi-select":
        return multi.length ? { kind: "multi-select", optionIds: multi } : null;
      case "free-text":
        return text.trim() ? { kind: "free-text", text } : null;
      case "localization":
        return region ? { kind: "localization", region } : null;
      case "select-tests":
        return { kind: "select-tests", optionIds: multi };
      case "order-priority":
        return { kind: "order-priority", order };
    }
  };
  const ready = (() => {
    const r = response();
    if (!r) return false;
    if (item.format === "mcq" && item.reasoning && !reasonChoice) return false;
    return true;
  })();

  const submit = (confidence: Confidence) => {
    const r: ItemResponse | null = confidence === "idk" ? { kind: "idk" } : response();
    if (!r) return;
    const grade = gradeItem(item, r);
    const attempt = recordAttempt({ item, grade, context, confidence, durationMs: now() - started.current, transfer: item.difficulty >= 2 });
    setResult({ attempt, grade });
  };

  // Keyboard shortcuts for MCQ: number keys choose, Enter submits as "Think so".
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (result || (e.target instanceof HTMLElement && ["TEXTAREA", "INPUT", "SELECT"].includes(e.target.tagName))) return;
      if (item.format === "mcq" && /^[1-9]$/.test(e.key)) {
        const o = options[Number(e.key) - 1];
        if (o) setChoice(o.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, options, result]);

  const voice = () => {
    const SR = (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-US";
    rec.onresult = (e) => setText((t) => `${t} ${e.results[0][0].transcript}`.trim());
    rec.onend = () => setListening(false);
    setListening(true);
    rec.start();
  };
  const hasVoice = !STANDALONE && typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const verdictClass = result ? (result.grade.verdict === "correct" ? "good" : result.grade.verdict === "idk" ? "neutral" : result.grade.score > 0 ? "partial" : "bad") : "";
  const slipSuggested = result && result.grade.score < 0.8 && result.attempt.confidence !== "idk" ? suggestSlip(result.attempt, bySkill(getState().attempts.filter((a) => a.id !== result.attempt.id), now())[item.skill]) : false;

  return (
    <div className="stack">
      {item.vignette && (
        <div className="card tight teal">
          <Inline text={item.vignette} />
        </div>
      )}
      <h2 tabIndex={-1} ref={headingRef} style={{ outline: "none" }}>
        <Inline text={item.stem} />
      </h2>
      {item.schematic && <Schematic s={item.schematic} />}

      {item.format === "mcq" && (
        <div role="radiogroup" aria-label="Answer options">
          {options.map((o, i) => {
            const cls = result ? (o.correct ? "correct" : choice === o.id ? "wrong" : "") : choice === o.id ? "selected" : "";
            return (
              <button key={o.id} role="radio" aria-checked={choice === o.id} className={`option ${cls}`} disabled={!!result} onClick={() => setChoice(o.id)}>
                <span className="key">{i + 1}</span>
                <span>
                  <Inline text={o.text} />
                </span>
              </button>
            );
          })}
          {item.reasoning && choice && (
            <div className="section">
              <h3>
                <Inline text={item.reasoning.stem} />
              </h3>
              <div role="radiogroup" aria-label="Supporting finding">
                {item.reasoning.options.map((o) => (
                  <button key={o.id} role="radio" aria-checked={reasonChoice === o.id} className={`option ${result ? (o.correct ? "correct" : reasonChoice === o.id ? "wrong" : "") : reasonChoice === o.id ? "selected" : ""}`} disabled={!!result} onClick={() => setReasonChoice(o.id)}>
                    <Inline text={o.text} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {item.format === "multi-select" && (
        <div role="group" aria-label="Select all that apply">
          <p className="small muted">Select all that apply.</p>
          {options.map((o) => {
            const on = multi.includes(o.id);
            const cls = result ? (o.correct ? "correct" : on ? "wrong" : "") : on ? "selected" : "";
            return (
              <button key={o.id} role="checkbox" aria-checked={on} className={`option ${cls}`} disabled={!!result} onClick={() => setMulti(on ? multi.filter((x) => x !== o.id) : [...multi, o.id])}>
                <span className="key">{on ? "✓" : ""}</span>
                <Inline text={o.text} />
              </button>
            );
          })}
        </div>
      )}

      {item.format === "free-text" && (
        <div>
          <label className="field" htmlFor={`ft-${item.id}`}>
            Your answer
          </label>
          <textarea
            id={`ft-${item.id}`}
            className="input"
            value={text}
            placeholder={item.placeholder ?? "Type your answer. Spelling and abbreviations are fine."}
            disabled={!!result}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && ready) submit("think");
            }}
          />
          {hasVoice && !result && (
            <button className="btn small ghost" onClick={voice} disabled={listening}>
              {listening ? "Listening" : "Dictate"}
            </button>
          )}
        </div>
      )}

      {item.format === "localization" && (
        <div className="stack" role="radiogroup" aria-label="Lesion location">
          {REGION_GROUPS.map((g) => (
            <div key={g.label}>
              <div className="small muted">{g.label}</div>
              <div className="row">
                {g.regions.map((r) => {
                  const cls = result ? (item.correct.includes(r) ? "correct" : region === r ? "wrong" : "") : region === r ? "selected" : "";
                  return (
                    <button key={r} role="radio" aria-checked={region === r} className={`chip ${cls === "selected" ? "selected" : ""}`} style={cls === "correct" ? { borderColor: "var(--green)", background: "var(--green-soft)" } : cls === "wrong" ? { borderColor: "var(--red)", background: "var(--red-soft)" } : undefined} disabled={!!result} onClick={() => setRegion(r)}>
                      {REGION_LABELS[r]}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {item.format === "select-tests" && (
        <div role="group" aria-label="Investigations">
          <p className="small muted">Choose what you would order now. Unnecessary tests lower the score.</p>
          {testOptions.map((o) => {
            const on = multi.includes(o.id);
            const b = result?.grade.breakdown?.find((x) => x.id === o.id);
            const cls = b ? (b.outcome === "hit" ? "correct" : b.outcome === "penalty" ? "wrong" : b.outcome === "missed" ? "selected" : "") : on ? "selected" : "";
            return (
              <div key={o.id}>
                <button role="checkbox" aria-checked={on} className={`option ${cls}`} disabled={!!result} onClick={() => setMulti(on ? multi.filter((x) => x !== o.id) : [...multi, o.id])}>
                  <span className="key">{on ? "✓" : ""}</span>
                  <span>{o.label}</span>
                  {b && <span className={`badge ${o.category === "necessary" ? "green" : o.category === "reasonable" ? "blue" : o.category === "harmful" ? "red" : "gray"}`} style={{ marginLeft: "auto" }}>{o.category}</span>}
                </button>
                {b && <p className="small muted" style={{ margin: "4px 0 0 34px" }}>{o.why}</p>}
              </div>
            );
          })}
        </div>
      )}

      {item.format === "order-priority" && (
        <ol style={{ paddingLeft: 0, listStyle: "none" }} aria-label="Reorder steps">
          {order.map((id, i) => {
            const step = item.steps.find((s) => s.id === id)!;
            return (
              <li key={id} className="option" style={{ alignItems: "center" }}>
                <span className="key">{i + 1}</span>
                <span style={{ flex: 1 }}>{step.text}</span>
                {!result && (
                  <span className="row">
                    <button className="btn small" aria-label={`Move "${step.text}" up`} disabled={i === 0} onClick={() => setOrder((o) => { const n = [...o]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; return n; })}>
                      Up
                    </button>
                    <button className="btn small" aria-label={`Move "${step.text}" down`} disabled={i === order.length - 1} onClick={() => setOrder((o) => { const n = [...o]; [n[i + 1], n[i]] = [n[i], n[i + 1]]; return n; })}>
                      Down
                    </button>
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      )}

      {!result && (
        <div className="stack">
          <div className="small muted">Submit with your confidence:</div>
          <div className="row">
            <button className="btn primary" disabled={!ready} onClick={() => submit("sure")}>
              Sure
            </button>
            <button className="btn" disabled={!ready} onClick={() => submit("think")}>
              Think so
            </button>
            <button className="btn" disabled={!ready} onClick={() => submit("guess")}>
              Guessing
            </button>
            <button className="btn ghost" onClick={() => submit("idk")}>
              I don't know
            </button>
          </div>
        </div>
      )}

      {result && (
        <div aria-live="polite">
          {showFeedback || explain ? (
            <div className={`feedback ${verdictClass}`}>
              <strong>
                {result.grade.verdict === "correct" ? "Correct" : result.grade.verdict === "idk" ? "Noted" : result.grade.verdict === "overly-specific" ? "Too specific for the evidence" : result.grade.score > 0 ? "Partly correct" : "Not quite"}
              </strong>
              <p>{result.grade.feedback}</p>
              {result.grade.verdict !== "correct" && (
                <p>
                  <span className="muted">Expected:</span> {result.grade.keySummary}
                </p>
              )}
              <div className="divider" />
              <RichText text={item.rationale} />
              <ProvenanceLine meta={item.meta} />
            </div>
          ) : (
            <div className="feedback neutral row between">
              <span>Answer recorded.</span>
              <button className="btn small ghost" onClick={() => setExplain(true)}>
                Show explanation
              </button>
            </div>
          )}
          {result.grade.score < 0.8 && result.grade.verdict !== "idk" && (
            <div className="section">
              <div className="small muted">What happened? (helps separate gaps from slips)</div>
              <div className="row">
                {(
                  [
                    ["didnt-know", "Didn't know"],
                    ["slip", "Misread or slip"],
                    ["mixed-terms", "Mixed up terms"],
                    ["guessed", "Guessed"],
                  ] as const
                ).map(([k, l]) => (
                  <button key={k} className={`chip ${result.attempt.selfReport === k ? "selected" : ""}`} aria-pressed={result.attempt.selfReport === k} onClick={() => { setSelfReport(result.attempt.id, k); setResult({ ...result, attempt: { ...result.attempt, selfReport: k } }); }}>
                    {l}
                  </button>
                ))}
              </div>
              {slipSuggested && <p className="small muted">Your record on this ability is strong, so this may have been a slip.</p>}
            </div>
          )}
          <div className="section">
            <button className="btn primary" onClick={() => onDone(result)} autoFocus>
              {nextLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface SpeechRecognitionLike {
  lang: string;
  start: () => void;
  onresult: (e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void;
  onend: () => void;
}
