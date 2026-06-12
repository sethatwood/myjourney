import { Ic } from "./Ic";

interface StepperProps {
  /** How many of the steps are complete. */
  doneCount?: number;
  labels?: string[];
}

/** Horizontal order-status stepper. */
export function Stepper({ doneCount = 3, labels }: StepperProps) {
  const steps = labels ?? ["Confirmed", "Filled", "Shipped", "Delivered"];
  return (
    <div className="mj-stepper">
      {steps.map((label, i) => {
        const on = i < doneCount;
        const nextOn = i + 1 < doneCount;
        return (
          <div key={label} className="mj-step">
            <div className="mj-step-toprow">
              {i > 0 ? <span className={"mj-step-line" + (on ? " on" : "")} /> : <span className="mj-step-line ghost" />}
              <span className={"mj-step-dot" + (on ? " on" : "")}>{on && <Ic name="check" size={11} color="#fff" />}</span>
              {i < steps.length - 1 ? <span className={"mj-step-line" + (nextOn ? " on" : "")} /> : <span className="mj-step-line ghost" />}
            </div>
            <span className={"mj-step-label" + (on ? " on" : "")}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
