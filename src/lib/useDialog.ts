import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE = "button, a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])";

/** WAI-ARIA dialog behavior: focus moves in on open, Tab cycles inside,
    Escape closes, and focus returns to the opener on close. */
export function useDialog(ref: RefObject<HTMLElement | null>, onClose: () => void) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const el = ref.current;
    const focusables = () => (el ? Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)) : []);
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
    // mount-only: the dialog exists exactly once per open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
