import { cal } from "../lib/calendar";
import type { Navigate } from "../lib/nav";
import { useMJ } from "../store/store";
import { AppBar } from "../components/AppBar";
import { BottomNav } from "../components/BottomNav";
import { Ic } from "../components/Ic";
import { SectionLabel } from "../components/SectionLabel";
import { Stepper } from "../components/Stepper";

export function OrdersScreen({ navigate, onInfo }: { navigate: Navigate; onInfo: () => void }) {
  const s = useMJ();
  const history: [string, string, string][] = [
    ["#1038", "Delivered " + cal.delivered1038, "Signed by M. Torres"],
    ["#1034", "Delivered " + cal.delivered1034, "Signed by M. Torres"],
    ["#1029", "Delivered " + cal.delivered1029, "Left with front desk"],
  ];
  return (
    <div className="mj-screen">
      <AppBar onInfo={onInfo} />
      <div className="mj-body scroll">
        <h1 className="mj-greet">Orders</h1>
        <p className="mj-greet-sub">Shipments from ONE Journey Specialty Pharmacy</p>

        {s.refill.scheduled && (
          <div className="mj-ordercard">
            <div className="mj-orderhead">
              <p className="mj-ordertitle">Shipment #1043</p>
              <span className="mj-orderchip">Arrives {s.refill.deliveryLabel}</span>
            </div>
            <Stepper doneCount={1} />
          </div>
        )}

        <div className="mj-ordercard">
          <div className="mj-orderhead">
            <p className="mj-ordertitle">Shipment #1042</p>
            <span className="mj-orderchip">Arrives {cal.transitArrives}</span>
          </div>
          <Stepper doneCount={3} />
          <div className="mj-trackrow">
            <Ic name="truck" size={15} color="var(--oj-blue-deep)" />
            <span>In transit &middot; left regional facility 6:40 AM &middot; signature required</span>
          </div>
        </div>

        <SectionLabel>History</SectionLabel>
        <div className="mj-stack">
          {history.map(([id, when, note]) => (
            <div key={id} className="mj-taskcard slim">
              <span className="mj-taskicon graycheck" style={{ width: 32, height: 32 }}>
                <Ic name="package-check" size={15} color="#fff" />
              </span>
              <div className="mj-taskmeta">
                <p className="mj-tasktitle">
                  {id} &middot; {when}
                </p>
                <p className="mj-tasksub">{note}</p>
              </div>
              <Ic name="chevron-right" size={18} color="var(--oj-gray)" />
            </div>
          ))}
        </div>
      </div>
      <BottomNav active="orders" onNavigate={navigate} />
    </div>
  );
}
