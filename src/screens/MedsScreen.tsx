import { cal } from "../lib/calendar";
import type { Navigate } from "../lib/nav";
import { useMJ } from "../store/store";
import { AppBar } from "../components/AppBar";
import { BottomNav } from "../components/BottomNav";
import { Ic } from "../components/Ic";
import { Ring } from "../components/Ring";
import { SectionLabel } from "../components/SectionLabel";

export function MedsScreen({ navigate, onInfo, onBell }: { navigate: Navigate; onInfo: () => void; onBell: () => void }) {
  const s = useMJ();
  const doseHistory: [string, string, string][] = [
    ["Dose 13", cal.dose13, "On time"],
    ["Dose 12", cal.dose12, "On time"],
    ["Dose 11", cal.dose11, "On time"],
    ["Dose 10", cal.dose10, "1 day late"],
  ];
  return (
    <div className="mj-screen">
      <AppBar onInfo={onInfo} onBell={onBell} />
      <div className="mj-body scroll">
        <h1 className="mj-greet">Medications</h1>
        <p className="mj-greet-sub">Managed by ONE Journey Specialty Pharmacy</p>
        <div className="mj-medcard" style={{ marginBottom: 12 }}>
          <div className="mj-medtop">
            <div>
              <p className="mj-medeyebrow">Specialty therapy</p>
              <h2 className="mj-medname">Velmira 20&nbsp;mg</h2>
              <p className="mj-medsub">Autoinjector &middot; every 2 weeks</p>
              <div className="mj-nextdose">
                <Ic name="syringe" size={15} color="var(--oj-blue)" />
                <span>
                  Next dose <strong>{cal.nextDose}</strong>
                </span>
              </div>
            </div>
            <Ring pct={92} />
          </div>
          <div className="mj-medfoot">
            <span className={"mj-statuschip" + (s.refill.scheduled ? " ok" : " warn")}>
              {s.refill.scheduled ? "Refill scheduled · arrives " + s.refill.deliveryLabel : "Refill window open"}
            </span>
            {!s.refill.scheduled && (
              <a
                className="mj-seeall"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("refill");
                }}
              >
                Schedule
              </a>
            )}
          </div>
        </div>

        <SectionLabel>Dose history</SectionLabel>
        <div className="mj-stack" style={{ marginBottom: 20 }}>
          {doseHistory.map(([dose, date, note]) => (
            <div key={dose} className="mj-taskcard slim">
              <span className="mj-taskicon graycheck" style={{ width: 32, height: 32 }}>
                <Ic name="check" size={15} color="#fff" />
              </span>
              <div className="mj-taskmeta">
                <p className="mj-tasktitle">
                  {dose} &middot; {date}
                </p>
                <p className="mj-tasksub">{note}</p>
              </div>
            </div>
          ))}
        </div>

        <SectionLabel>Prescriber</SectionLabel>
        <div className="mj-taskcard">
          <span className="mj-taskicon">
            <Ic name="stethoscope" size={19} color="#fff" />
          </span>
          <div className="mj-taskmeta">
            <p className="mj-tasktitle">Dr. A. Chen — Neurology</p>
            <p className="mj-tasksub">Lakeview Neurology Group &middot; sees your check-ins</p>
          </div>
        </div>
      </div>
      <BottomNav active="meds" onNavigate={navigate} />
    </div>
  );
}
