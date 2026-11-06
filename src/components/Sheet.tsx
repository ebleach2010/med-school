import { useEffect, useRef, type ReactNode } from "react";
import { Icon } from "./Icon";

/** Side drawer on desktop, bottom sheet on mobile. Keeps the page underneath in place. */
export function Sheet({ title, onClose, children, footer }: { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  // Keep the latest handler without re-running the focus effect on every parent render,
  // which would pull focus out of inputs inside the sheet while typing.
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close.current();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, []);
  return (
    <>
      <div className="sheet-backdrop" onClick={() => close.current()} />
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref} style={{ outline: "none" }}>
        <div className="sheet-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={() => close.current()} aria-label="Close">
            <Icon name="x" />
          </button>
        </div>
        {children}
        {footer && <div style={{ position: "sticky", bottom: 0, background: "var(--surface)", padding: "12px 0 4px", marginTop: 8 }}>{footer}</div>}
      </div>
    </>
  );
}
