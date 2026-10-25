import { useEffect, useRef, type ReactNode } from "react";

/** Side drawer on desktop, bottom sheet on mobile. Keeps the page underneath in place. */
export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [onClose]);
  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
        <div className="sheet-head">
          <h2 style={{ margin: 0 }}>{title}</h2>
          <button className="btn small ghost" onClick={onClose} aria-label="Close">
            Close
          </button>
        </div>
        {children}
      </div>
    </>
  );
}
