import { cal } from "../lib/calendar";
import { store, useMJ } from "../store/store";
import { Ic } from "../components/Ic";
import { PillBtn } from "../components/PillBtn";

/* Bottom sheet: renew co-pay assistance in one tap. */
export function CopaySheet({ onClose }: { onClose: () => void }) {
  const s = useMJ();
  const renewed = s.tasks.copay;
  return (
    <div className="mj-sheetwrap" onClick={onClose}>
      <div className="mj-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="mj-sheethandle" />
        {!renewed ? (
          <div>
            <h3 className="mj-sheettitle">Renew co-pay assistance</h3>
            <p className="mj-sheetsub">
              Your manufacturer co-pay program covers <strong>$240 per fill</strong>. It expires {cal.copayExpires} —
              renew now and your co-pay stays <strong>$0</strong> for the next 12 months.
            </p>
            <div className="mj-reviewcard" style={{ marginBottom: 18 }}>
              <div className="mj-reviewrow">
                <span className="mj-reviewkey">Program</span>
                <span className="mj-reviewval">Velmira Copay Support</span>
              </div>
              <div className="mj-reviewrow">
                <span className="mj-reviewkey">Member ID</span>
                <span className="mj-reviewval">VLM-30412-MT</span>
              </div>
              <div className="mj-reviewrow total">
                <span className="mj-reviewkey">Your co-pay</span>
                <span className="mj-reviewval">
                  <strong>$0.00</strong>
                </span>
              </div>
            </div>
            <PillBtn style={{ width: "100%" }} onClick={() => store.set((st) => ({ tasks: { ...st.tasks, copay: true } }))}>
              Renew — takes 2 seconds
            </PillBtn>
          </div>
        ) : (
          <div className="mj-success" style={{ paddingTop: 6 }}>
            <span className="mj-successring">
              <Ic name="check" size={34} color="#fff" />
            </span>
            <h3 className="mj-sheettitle" style={{ textAlign: "center" }}>
              Renewed through {cal.copayThrough}
            </h3>
            <p className="mj-successsub">Nothing else to do — it applies automatically to every order.</p>
            <PillBtn style={{ width: "100%" }} onClick={onClose}>
              Done
            </PillBtn>
          </div>
        )}
      </div>
    </div>
  );
}
