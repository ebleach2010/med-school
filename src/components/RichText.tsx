import { Fragment, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { TERM_BY_ID, MODULE_BY_ID } from "../lib/content";
import { Sheet } from "./Sheet";

function speak(text: string) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch {
    // Text to speech is optional.
  }
}

export function TermButton({ id, children }: { id: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const t = TERM_BY_ID.get(id);
  if (!t) return <>{children}</>;
  const mod = t.moduleId ? MODULE_BY_ID.get(t.moduleId) : undefined;
  return (
    <>
      <button type="button" className="term" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={`${typeof children === "string" ? children : t.term}: show definition`}>
        {children}
      </button>
      {open && (
        <Sheet title={t.term} onClose={() => setOpen(false)}>
          <div className="stack">
            {t.pronunciation && (
              <div className="row">
                <span className="muted">Pronounced</span> <strong>{t.pronunciation}</strong>
                {"speechSynthesis" in window && (
                  <button className="btn small" onClick={() => speak(t.term)}>
                    Play
                  </button>
                )}
              </div>
            )}
            <div>
              <h3>In plain words</h3>
              <p>{t.plain}</p>
            </div>
            <div>
              <h3>Medical meaning</h3>
              <p>{t.medical}</p>
            </div>
            <div>
              <h3>Clinical example</h3>
              <p>{t.example}</p>
            </div>
            {t.aliases?.length ? <p className="small muted">Also called: {t.aliases.join(", ")}</p> : null}
            {t.related?.length ? (
              <p className="small">
                Related:{" "}
                {t.related
                  .map((r) => TERM_BY_ID.get(r))
                  .filter(Boolean)
                  .map((r, i) => (
                    <Fragment key={r!.id}>
                      {i > 0 && ", "}
                      <TermButton id={r!.id}>{r!.term}</TermButton>
                    </Fragment>
                  ))}
              </p>
            ) : null}
            {mod && (
              <p className="small">
                Concept: <Link to={`/learn/${mod.id}`}>{mod.title}</Link>
              </p>
            )}
          </div>
        </Sheet>
      )}
    </>
  );
}

const MARKUP = /\[\[([^|\]]+)\|([^\]]+)\]\]/g;

/** Inline text with `[[term-id|shown text]]` glossary markup. */
export function Inline({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(MARKUP)) {
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    out.push(
      <TermButton key={i} id={m[1]}>
        {m[2]}
      </TermButton>,
    );
    last = i + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

/** Paragraphs separated by blank lines. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n\n+/).map((p, i) => (
        <p key={i}>
          <Inline text={p} />
        </p>
      ))}
    </>
  );
}
