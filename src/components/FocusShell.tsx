import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "./Icon";

interface FocusCtx {
  setProgress: (v: number | null) => void;
  setCount: (s: string | null) => void;
  scrollTop: () => void;
}
const Ctx = createContext<FocusCtx | null>(null);

/** Lets a runner inside a FocusShell drive the top progress bar. No-op outside a shell. */
export function useFocusProgress(value: number, count?: string) {
  const ctx = useContext(Ctx);
  useEffect(() => {
    ctx?.setProgress(value);
    ctx?.setCount(count ?? null);
  }, [ctx, value, count]);
}

export function useFocusScroll() {
  return useContext(Ctx)?.scrollTop ?? (() => window.scrollTo(0, 0));
}

/**
 * Full-screen frame for lessons and quizzes: close button, progress bar, scrolling body.
 * The bottom action bar is rendered by the content (ItemView or a step) as `.check-bar`.
 */
export function FocusShell({ children, progress, count, closeTo = "/", closeLabel = "Close and save progress", top }: { children: ReactNode; progress?: number; count?: string; closeTo?: string; closeLabel?: string; top?: ReactNode }) {
  const nav = useNavigate();
  const [inner, setInner] = useState<number | null>(null);
  const [innerCount, setInnerCount] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [ctx] = useState<FocusCtx>(() => ({ setProgress: setInner, setCount: setInnerCount, scrollTop: () => scroller.current?.scrollTo({ top: 0 }) }));
  const value = progress ?? inner ?? 0;
  const label = count ?? innerCount;

  useEffect(() => {
    // The page behind should not scroll while the focus frame is open.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <Ctx.Provider value={ctx}>
      <div className="focus">
        <div className="focus-top">
          <button className="icon-btn" onClick={() => nav(closeTo)} aria-label={closeLabel}>
            <Icon name="x" />
          </button>
          {top ?? (
            <>
              <div className="bar" role="progressbar" aria-label="Progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)}>
                <span style={{ width: `${Math.max(value > 0 ? 4 : 0, Math.round(value * 100))}%` }} />
              </div>
              {label && <span className="focus-count">{label}</span>}
            </>
          )}
        </div>
        <div className="focus-scroll" ref={scroller}>
          <div className="focus-body">{children}</div>
        </div>
      </div>
    </Ctx.Provider>
  );
}

/** Fixed bottom bar for a non-question step: one big button. */
export function ContinueBar({ label = "Continue", onClick, disabled, secondary }: { label?: string; onClick: () => void; disabled?: boolean; secondary?: ReactNode }) {
  return (
    <div className="check-bar">
      <div className="check-inner">
        <div className="check-row">
          {secondary}
          <button className="btn primary lg" onClick={onClick} disabled={disabled}>
            {label}
          </button>
        </div>
      </div>
    </div>
  );
}
