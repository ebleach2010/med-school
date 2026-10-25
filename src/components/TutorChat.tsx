import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { streamApi } from "../lib/api";
import { useAIStatus } from "../lib/hooks";
import { STANDALONE } from "../lib/platform";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

/** Streaming AI tutor with cancel. Falls back to a clear message in demo mode. */
export function TutorChat({ kind, encounterId, lessonId, mode = "ask", starter }: { kind: "encounter" | "lesson"; encounterId?: string; lessonId?: string; mode?: string; starter?: string }) {
  const ai = useAIStatus();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState(starter ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<string | null>(null);
  const ctrl = useRef<AbortController | null>(null);

  if (ai && ai.mode !== "live" && STANDALONE) {
    return <div className="notice">The AI tutor runs on your Claude account when this page is open on claude.ai and you are signed in. Prewritten explanations, rule-based patients, and grading all work without it.</div>;
  }
  if (ai && ai.mode !== "live") {
    return (
      <div className="notice">
        The AI tutor needs an API key. You are in demo mode: prewritten explanations, rule-based patients, and rule-based grading all still work. <Link to="/settings">Add a key in Settings</Link>.
      </div>
    );
  }

  const send = (text: string) => {
    if (!text.trim() || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: text.trim() }];
    setMsgs([...next, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    setError(null);
    ctrl.current = streamApi(
      "/api/ai/tutor",
      { kind, encounterId, lessonId, mode, messages: next },
      {
        onText: (t) => setMsgs((m) => [...m.slice(0, -1), { role: "assistant", content: m[m.length - 1].content + t }]),
        onDone: (d) => {
          setBusy(false);
          setMeta(`${d.model}, ${d.usage.inputTokens + d.usage.outputTokens} tokens, about $${(d.cost ?? 0).toFixed(4)}`);
        },
        onError: (e) => {
          setBusy(false);
          setError(e.error);
          setMsgs((m) => (m[m.length - 1]?.content ? m : m.slice(0, -1)));
        },
      },
    );
  };

  return (
    <div className="stack">
      <div className="timeline" aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={`msg ${m.role === "user" ? "learner" : "patient"}`} style={{ whiteSpace: "pre-wrap" }}>
            {m.content || (busy && i === msgs.length - 1 ? "..." : "")}
          </div>
        ))}
      </div>
      {error && (
        <div className="feedback bad" role="alert">
          {error}
        </div>
      )}
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input className="input" style={{ flex: 1 }} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask the tutor" aria-label="Message to tutor" />
        {busy ? (
          <button type="button" className="btn" onClick={() => { ctrl.current?.abort(); setBusy(false); }}>
            Stop
          </button>
        ) : (
          <button className="btn primary" type="submit" disabled={!input.trim()}>
            Send
          </button>
        )}
      </form>
      {meta && <div className="tiny muted">{STANDALONE ? "Answered by Claude on your account." : `AI response: ${meta}.`} AI explanations are not citations; check the listed sources.</div>}
      {STANDALONE && !msgs.length && <div className="tiny muted">The first question asks your permission to use Claude from this page. It uses your own Claude usage.</div>}
    </div>
  );
}
