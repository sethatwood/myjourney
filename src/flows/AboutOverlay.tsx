import { useRef } from "react";
import { useDialog } from "../lib/useDialog";
import { Ic } from "../components/Ic";

/* The meta-narrative: what this is, what's real, how it would ship.
   Opens automatically on a first visit; closes via the X, the backdrop,
   or Escape. */
export function AboutOverlay({ onClose, onReset }: { onClose: () => void; onReset: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useDialog(ref, onClose);
  return (
    <div className="mj-sheetwrap" onClick={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mj-about-title"
        className="mj-sheet tall"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mj-sheethandle" />
        <button type="button" className="mj-sheetclose" onClick={onClose} aria-label="Close">
          <Ic name="x" size={18} color="var(--oj-navy)" />
        </button>
        <h3 className="mj-sheettitle" id="mj-about-title">About this prototype</h3>
        <div className="mj-about">
          <p>
            <strong>What this is.</strong> An original take on a specialty-patient coordination app in the CassianRx
            problem space — built quickly as a working conversation-starter, not a spec.
          </p>
          <p>
            <strong>The home screen is intentional.</strong> Two cognitive modalities, one dataset: <em>Action Center</em>{" "}
            answers &ldquo;what do I do next?&rdquo;; <em>Journey</em> answers &ldquo;where am I in the arc of my
            therapy?&rdquo; (GenderMag-style accommodation — the toggle remembers your preference.)
          </p>
          <p>
            <strong>How I&rsquo;d ship it.</strong> This front end is React + TypeScript; production adds a Node/Express
            API and Postgres. Order lifecycle as an explicit state machine (confirmed → filled → shipped → delivered)
            with event-driven notifications; care activities as a task queue evaluated against the clinical pathway;
            FHIR-friendly resource shapes for meds, orders, and questionnaire responses.
          </p>
          <p>
            <strong>What&rsquo;s real here.</strong> All state (refill, check-in, co-pay, messages, view preference)
            persists locally and every flow completes end-to-end. Every date derives from the day you visit, so the
            scenario always reads current. Accessibility is real too: keyboard, screen reader, and reduced-motion
            support throughout, audited in CI. Auth, APIs, and the patient are simulated; the &ldquo;smart
            scheduling&rdquo; recommendation shows where dose-calendar + transit-time logic would live.
          </p>
          <p className="mj-aboutfoot">
            Built by Seth Atwood on the ONE Journey design language &middot; reset demo data below.
          </p>
        </div>
        <button type="button" className="mj-ghostbtn" onClick={onReset}>
          Reset demo data
        </button>
      </div>
    </div>
  );
}
