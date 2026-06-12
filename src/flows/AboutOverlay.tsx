import { store } from "../store/store";

/* The meta-narrative: what this is, what's real, how it would ship. */
export function AboutOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="mj-sheetwrap" onClick={onClose}>
      <div className="mj-sheet tall" onClick={(e) => e.stopPropagation()}>
        <div className="mj-sheethandle" />
        <h3 className="mj-sheettitle">About this prototype</h3>
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
            scenario always reads current. Auth, APIs, and the patient are simulated; the &ldquo;smart
            scheduling&rdquo; recommendation shows where dose-calendar + transit-time logic would live.
          </p>
          <p className="mj-aboutfoot">
            Built by Seth Atwood on the ONE Journey design language &middot; reset demo data below.
          </p>
        </div>
        <button
          type="button"
          className="mj-ghostbtn"
          onClick={() => {
            store.reset();
            onClose();
          }}
        >
          Reset demo data
        </button>
      </div>
    </div>
  );
}
