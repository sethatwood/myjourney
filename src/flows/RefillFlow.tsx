import { useState } from "react";
import { cal } from "../lib/calendar";
import type { Navigate } from "../lib/nav";
import { store } from "../store/store";
import { Ic } from "../components/Ic";
import { PillBtn } from "../components/PillBtn";
import { SectionLabel } from "../components/SectionLabel";
import { SubBar } from "../components/SubBar";

/* Three steps + success: confirm prescription, choose delivery, review. */
export function RefillFlow({ navigate }: { navigate: Navigate }) {
  const [step, setStep] = useState(0);
  const recommended = cal.deliveryOptions.find((d) => d.note)?.label ?? cal.deliveryOptions[0].label;
  const [date, setDate] = useState(recommended);

  function confirm() {
    store.set({ refill: { scheduled: true, deliveryLabel: date.replace(",", "") } });
    setStep(3);
  }

  return (
    <div className="mj-screen">
      <SubBar title="Schedule refill" onBack={() => (step > 0 && step < 3 ? setStep(step - 1) : navigate("home"))} />
      {step < 3 && (
        <div className="mj-progress">
          <div className="mj-progress-fill" style={{ width: ((step + 1) / 3) * 100 + "%" }} />
        </div>
      )}
      <div className="mj-body scroll">
        {step === 0 && (
          <div className="mj-fade">
            <h2 className="mj-flowtitle">Confirm your prescription</h2>
            <div className="mj-medcard" style={{ marginBottom: 12 }}>
              <p className="mj-medeyebrow">Specialty therapy</p>
              <h2 className="mj-medname">Velmira 20&nbsp;mg</h2>
              <p className="mj-medsub" style={{ marginBottom: 0 }}>
                Autoinjector &middot; 1 device &middot; 28-day supply &middot; Rx #884-2210
              </p>
            </div>
            <div className="mj-smartbox">
              <span className="mj-smarticon">
                <Ic name="sparkles" size={16} color="#fff" />
              </span>
              <div>
                <p className="mj-smarttitle">Smart scheduling</p>
                <p className="mj-smartsub">
                  Your next dose is <strong>{cal.nextDose}</strong>. Based on your dose calendar and carrier transit
                  times, we recommend delivery by <strong>{cal.scheduleBy}</strong>.
                </p>
              </div>
            </div>
            <PillBtn onClick={() => setStep(1)} style={{ width: "100%" }}>
              Continue
            </PillBtn>
          </div>
        )}

        {step === 1 && (
          <div className="mj-fade">
            <h2 className="mj-flowtitle">Choose delivery</h2>
            <SectionLabel>Delivery day</SectionLabel>
            <div className="mj-stack" style={{ marginBottom: 18 }}>
              {cal.deliveryOptions.map((d) => {
                const on = d.label === date;
                return (
                  <button key={d.label} type="button" className={"mj-datecard" + (on ? " on" : "")} onClick={() => setDate(d.label)}>
                    <span className={"mj-radio" + (on ? " on" : "")}>{on && <span />}</span>
                    <span className="mj-datelabel">{d.label}</span>
                    {d.note && <span className="mj-datenote">{d.note}</span>}
                  </button>
                );
              })}
            </div>
            <SectionLabel>Deliver to</SectionLabel>
            <div className="mj-taskcard" style={{ marginBottom: 18 }}>
              <span className="mj-taskicon">
                <Ic name="house" size={19} color="#fff" />
              </span>
              <div className="mj-taskmeta">
                <p className="mj-tasktitle">Home</p>
                <p className="mj-tasksub">214 Bellweather Ln, Apt 3 &middot; signature required</p>
              </div>
              <a className="mj-seeall" href="#" onClick={(e) => e.preventDefault()}>
                Change
              </a>
            </div>
            <div className="mj-coldnote">
              <Ic name="thermometer-snowflake" size={16} color="var(--oj-blue-deep)" />
              <span>Ships in temperature-controlled packaging. Refrigerate on arrival.</span>
            </div>
            <PillBtn onClick={() => setStep(2)} style={{ width: "100%" }}>
              Continue
            </PillBtn>
          </div>
        )}

        {step === 2 && (
          <div className="mj-fade">
            <h2 className="mj-flowtitle">Review &amp; confirm</h2>
            <div className="mj-reviewcard">
              {[
                ["Medication", "Velmira 20 mg autoinjector"],
                ["Supply", "1 device · 28 days"],
                ["Delivery", date + " · Home"],
                ["Prescriber", "Dr. A. Chen, Neurology"],
              ].map(([key, val]) => (
                <div key={key} className="mj-reviewrow">
                  <span className="mj-reviewkey">{key}</span>
                  <span className="mj-reviewval">{val}</span>
                </div>
              ))}
              <div className="mj-reviewrow total">
                <span className="mj-reviewkey">Your co-pay</span>
                <span className="mj-reviewval">
                  <strong>$0.00</strong> <span className="mj-strikethru">$240.00</span>
                </span>
              </div>
              <p className="mj-reviewfoot">Co-pay assistance applied automatically.</p>
            </div>
            <PillBtn onClick={confirm} style={{ width: "100%" }}>
              Confirm refill
            </PillBtn>
          </div>
        )}

        {step === 3 && (
          <div className="mj-fade mj-success">
            <span className="mj-successring">
              <Ic name="check" size={34} color="#fff" />
            </span>
            <h2 className="mj-flowtitle" style={{ textAlign: "center" }}>
              Refill scheduled
            </h2>
            <p className="mj-successsub">
              Order #1043 will arrive <strong>{date}</strong>. We&rsquo;ll text you tracking updates and remind you the
              morning it arrives.
            </p>
            <PillBtn onClick={() => navigate("orders")} style={{ width: "100%", marginBottom: 10 }}>
              View order
            </PillBtn>
            <button type="button" className="mj-ghostbtn" onClick={() => navigate("home")}>
              Back to home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
