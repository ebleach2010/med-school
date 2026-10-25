import { useEffect, useMemo, useRef, useState } from "react";
import type { AssessmentItem, Attempt, Confidence, NeuraxisRegion } from "../../shared/types";
import { gradeItem, REGION_LABELS, type ItemGrade, type ItemResponse } from "../../shared/grading";
import { suggestSlip, bySkill } from "../../shared/mastery";
import { now } from "../../shared/clock";
import { recordAttempt, setSelfReport, getState } from "../lib/store";
import { Inline, RichText } from "./RichText";
import { Schematic } from "./Schematic";
import { ProvenanceLine } from "./Provenance";
import { Icon } from "./Icon";
import { STANDALONE } from "../lib/platform";

const REGION_GROUPS: { label: string; regions: NeuraxisRegion[] }[] = [
  { label: "Brain", regions: ["cortex-left", "cortex-right", "subcortical-left", "subcortical-right", "cerebellum"] },
  { label: "Brainstem", regions: ["midbrain", "pons", "medulla"] },
  { label: "Spinal cord", regions: ["cord-cervical", "cord-thoracic", "cord-lumbosacral", "anterior-horn"] },
  { label: "Peripheral", regions: ["root", "plexus", "peripheral-nerve", "nmj", "muscle"] },
];

const SURE: { id: Exclude<Confidence, "idk">; label: string }[] = [
  { id: "guess", label: "Guessing" },
  { id: "think", label: "Think so" },
  { id: "sure", label: "Sure" },
];

const SELF_REPORTS = [
  ["didnt-know", "Didn't know"],
  ["slip", "Misread or slip"],
  ["mixed-terms", "Mixed up terms"],
  ["guessed", "Guessed"],
] as const;

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

/**
 * One question in the familiar course-app flow: pick an answer, say how sure you are, Check,
 * then a green or red banner with Continue. "I don't know" is always one tap away.
 */
export function ItemView({
  item,
  context,
  onDone,
  showFeedback = true,
  nextLabel = "Continue",
  label,
  onSkip,
}: {
  item: AssessmentItem;
  context: Attempt["context"];
  onDone: (r: ItemResult) => void;
  showFeedback?: boolean;
  nextLabel?: string;
  label?: string;
  /** Offered when the learner already passed this question earlier (revisiting a lesson). */
  onSkip?: () => void;
}) {
  const started = useRef(now());
  const [choice, setChoice] = useState<string | null>(null);
  const [reasonChoice, setReasonChoice] = useState<string | null>(null);
  const [multi, setMulti] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [region, setRegion] = useState<NeuraxisRegion | null>(null);
  const initialOrder = useMemo(() => (item.format === "order-priority" ? shuffleOnce(item.steps.map((s) => s.id), item.id) : []), [item]);
  const [order, setOrder] = useState<string[]>(initialOrder);
  const [sure, setSure] = useState<Exclude<Confidence, "idk">>("think");
  const [result, setResult] = useState<ItemResult | null>(null);
  const [explain, setExplain] = useState(showFeedback);
  const [listening, setListening] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const explainRef = useRef<HTMLDivElement>(null);
  const reasonRef = useRef<HTMLDivElement>(null);
  const hasReasonStep = item.format === "mcq" && !!item.reasoning;

  useEffect(() => {
    started.current = now();
    setChoice(null);
    setReasonChoice(null);
    setMulti([]);
    setText("");
    setRegion(null);
    setOrder(initialOrder);
    setSure("think");
    setResult(null);
    setExplain(showFeedback);
    headingRef.current?.focus({ preventScroll: true });
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
    if (result) return;
    const r: ItemResponse | null = confidence === "idk" ? { kind: "idk" } : response();
    if (!r) return;
    const grade = gradeItem(item, r);
    const attempt = recordAttempt({ item, grade, context, confidence, durationMs: now() - started.current, transfer: item.difficulty >= 2 });
    setResult({ attempt, grade });
  };

  useEffect(() => {
    if (result && explain) setTimeout(() => explainRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }, [result, explain]);

  // The follow-up "which finding supports it" appears below the options; bring it into view.
  useEffect(() => {
    if (hasReasonStep && choice && !reasonChoice) setTimeout(() => reasonRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
  }, [hasReasonStep, choice, reasonChoice]);

  // Number keys choose an MCQ option.
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

  // Correct and wrong markings show only when feedback is on (placement and challenges hold them back).
  const reveal = !!result && explain;
  const tone = result ? (result.grade.verdict === "correct" ? "good" : result.grade.verdict === "idk" ? "neutral" : result.grade.score > 0 ? "partial" : "bad") : "";
  const headline = result
    ? result.grade.verdict === "correct"
      ? "Correct"
      : result.grade.verdict === "idk"
        ? "No problem"
        : result.grade.verdict === "overly-specific"
          ? "Too specific for the evidence"
          : result.grade.score > 0
            ? "Partly right"
            : "Not quite"
    : "";
  const slipSuggested = result && result.grade.score < 0.8 && result.attempt.confidence !== "idk" ? suggestSlip(result.attempt, bySkill(getState().attempts.filter((a) => a.id !== result.attempt.id), now())[item.skill]) : false;
  const optCls = (isCorrect: boolean | undefined, picked: boolean) => (reveal ? (isCorrect ? "correct" : picked ? "wrong" : "") : picked ? "selected" : "");

  return (
    <div>
      {label && <div className="focus-label">{label}</div>}
      {item.vignette && (
        <div className="vignette">
          <Inline text={item.vignette} />
        </div>
      )}
      <h2 className="q" tabIndex={-1} ref={headingRef} style={{ outline: "none" }}>
        <Inline text={item.stem} />
      </h2>
      {item.schematic && (
        <div style={{ marginBottom: 12 }}>
          <Schematic s={item.schematic} />
        </div>
      )}

      {item.format === "mcq" && (
        <div role="radiogroup" aria-label="Answer options">
          {options.map((o, i) => (
            <button key={o.id} role="radio" aria-checked={choice === o.id} className={`option ${optCls(o.correct, choice === o.id)}`} disabled={!!result} onClick={() => setChoice(o.id)}>
              <span className="key">{reveal && o.correct ? <Icon name="check" size={16} /> : i + 1}</span>
              <span>
                <Inline text={o.text} />
              </span>
            </button>
          ))}
          {item.reasoning && choice && (
            <div className="section" ref={reasonRef}>
              <div className="focus-label">Part 2</div>
              <h3>
                <Inline text={item.reasoning.stem} />
              </h3>
              <div role="radiogroup" aria-label="Supporting finding">
                {item.reasoning.options.map((o) => (
                  <button key={o.id} role="radio" aria-checked={reasonChoice === o.id} className={`option ${optCls(o.correct, reasonChoice === o.id)}`} disabled={!!result} onClick={() => setReasonChoice(o.id)}>
                    <span>
                      <Inline text={o.text} />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {item.format === "multi-select" && (
        <div role="group" aria-label="Select all that apply">
          <p className="small faint" style={{ marginTop: -8 }}>Select all that apply.</p>
          {options.map((o) => {
            const on = multi.includes(o.id);
            return (
              <button key={o.id} role="checkbox" aria-checked={on} className={`option ${optCls(o.correct, on)}${reveal && o.correct && !on ? " missed" : ""}`} disabled={!!result} onClick={() => setMulti(on ? multi.filter((x) => x !== o.id) : [...multi, o.id])}>
                <span className="key">{on ? <Icon name="check" size={16} /> : ""}</span>
                <span>
                  <Inline text={o.text} />
                </span>
              </button>
            );
          })}
        </div>
      )}

      {item.format === "free-text" && (
        <div>
          <label className="sr-only" htmlFor={`ft-${item.id}`}>
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
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && ready) submit(sure);
            }}
          />
          {hasVoice && !result && (
            <button className="btn small ghost" onClick={voice} disabled={listening}>
              <Icon name="mic" />
              {listening ? "Listening" : "Dictate"}
            </button>
          )}
        </div>
      )}

      {item.format === "localization" && (
        <div className="stack" role="radiogroup" aria-label="Lesion location">
          {REGION_GROUPS.map((g) => (
            <div key={g.label}>
              <div className="eyebrow" style={{ marginBottom: 6 }}>{g.label}</div>
              <div className="row">
                {g.regions.map((r) => (
                  <button key={r} role="radio" aria-checked={region === r} className={`chip ${optCls(item.correct.includes(r), region === r)}`} disabled={!!result} onClick={() => setRegion(r)}>
                    {REGION_LABELS[r]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {item.format === "select-tests" && (
        <div role="group" aria-label="Investigations">
          <p className="small faint" style={{ marginTop: -8 }}>Choose what you would order now. Unnecessary tests lower the score.</p>
          {testOptions.map((o) => {
            const on = multi.includes(o.id);
            const b = reveal ? result?.grade.breakdown?.find((x) => x.id === o.id) : undefined;
            const cls = b ? (b.outcome === "hit" ? "correct" : b.outcome === "penalty" ? "wrong" : b.outcome === "missed" ? "missed" : "") : on ? "selected" : "";
            return (
              <div key={o.id}>
                <button role="checkbox" aria-checked={on} className={`option ${cls}`} disabled={!!result} onClick={() => setMulti(on ? multi.filter((x) => x !== o.id) : [...multi, o.id])}>
                  <span className="key">{on ? <Icon name="check" size={16} /> : ""}</span>
                  <span className="grow">{o.label}</span>
                  {b && <span className={`badge ${o.category === "necessary" ? "green" : o.category === "reasonable" ? "blue" : o.category === "harmful" ? "red" : "gray"}`}>{o.category}</span>}
                </button>
                {b && <p className="option-note">{o.why}</p>}
              </div>
            );
          })}
        </div>
      )}

      {item.format === "order-priority" && (
        <ol style={{ padding: 0, margin: 0, listStyle: "none" }} aria-label="Reorder steps">
          {order.map((id, i) => {
            const step = item.steps.find((s) => s.id === id)!;
            return (
              <li key={id} className="option" style={{ cursor: "default", marginTop: i ? 10 : 0 }}>
                <span className="key">{i + 1}</span>
                <span className="grow">{step.text}</span>
                {!result && (
                  <span className="row nowrap" style={{ gap: 4 }}>
                    <button className="icon-btn" aria-label={`Move "${step.text}" up`} disabled={i === 0} onClick={() => setOrder((o) => { const n = [...o]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; return n; })}>
                      <Icon name="up" />
                    </button>
                    <button className="icon-btn" aria-label={`Move "${step.text}" down`} disabled={i === order.length - 1} onClick={() => setOrder((o) => { const n = [...o]; [n[i + 1], n[i]] = [n[i], n[i + 1]]; return n; })}>
                      <Icon name="down" />
                    </button>
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      )}

      {result && explain && (
        <div className="explain-box" ref={explainRef} style={{ scrollMarginTop: 12 }}>
          <h3>Explanation</h3>
          <p>{result.grade.feedback}</p>
          <RichText text={item.rationale} />
          <ProvenanceLine meta={item.meta} />
        </div>
      )}

      {result && result.grade.score < 0.8 && result.grade.verdict !== "idk" && (
        <div className="section">
          <div className="small faint" style={{ marginBottom: 6 }}>What happened? This separates gaps from slips.</div>
          <div className="row">
            {SELF_REPORTS.map(([k, l]) => (
              <button key={k} className="chip" aria-pressed={result.attempt.selfReport === k} onClick={() => { setSelfReport(result.attempt.id, k); setResult({ ...result, attempt: { ...result.attempt, selfReport: k } }); }}>
                {l}
              </button>
            ))}
          </div>
          {slipSuggested && <p className="small faint" style={{ marginTop: 6 }}>Your record on this ability is strong, so this may have been a slip.</p>}
        </div>
      )}

      {!result && (
        <div className="check-bar">
          <div className="check-inner">
            <div className="sure">
              <span className="lbl" id={`sure-${item.id}`}>How sure?</span>
              <div className="seg" role="group" aria-labelledby={`sure-${item.id}`}>
                {SURE.map((c) => (
                  <button key={c.id} aria-pressed={sure === c.id} onClick={() => setSure(c.id)}>
                    {c.label}
                  </button>
                ))}
              </div>
              {onSkip && (
                <button className="linkish small" onClick={onSkip}>
                  Skip
                </button>
              )}
            </div>
            <div className="check-row">
              <button className="btn ghost" onClick={() => submit("idk")}>
                I don't know
              </button>
              <button className="btn green lg" disabled={!ready} onClick={() => submit(sure)}>
                {hasReasonStep && choice && !reasonChoice ? "Answer part 2" : "Check"}
              </button>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className={`check-bar ${explain ? tone : "neutral-done"}`} aria-live="polite">
          <div className="check-inner">
            {explain ? (
              <div className="verdict">
                <span className="vi">
                  <Icon name={tone === "good" ? "check" : tone === "neutral" ? "info" : "x"} />
                </span>
                <div className="grow">
                  <strong>{headline}</strong>
                  {result.grade.verdict !== "correct" && <div className="vt">Answer: {result.grade.keySummary}</div>}
                </div>
              </div>
            ) : (
              <div className="row between">
                <strong>Answer saved</strong>
                <button className="linkish small" onClick={() => setExplain(true)}>
                  Show answer
                </button>
              </div>
            )}
            <div className="check-row">
              <button className={`btn lg ${!explain || tone === "good" || tone === "neutral" ? "green" : tone === "partial" ? "primary" : "red"}`} onClick={() => onDone(result)} autoFocus>
                {nextLabel}
              </button>
            </div>
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
