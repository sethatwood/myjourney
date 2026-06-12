import { useState } from "react";
import type { Navigate } from "../lib/nav";
import { store } from "../store/store";
import { Ic } from "../components/Ic";
import { PillBtn } from "../components/PillBtn";
import { SubBar } from "../components/SubBar";

const questions = [
  { q: "How has your fatigue been compared to your usual week?", opts: ["Better", "About the same", "Worse", "Much worse"] },
  { q: "Any changes in mobility or balance?", opts: ["No changes", "Slight changes", "Noticeable changes"] },
  { q: "Any reaction at your last injection site?", opts: ["None", "Mild redness", "Swelling", "Pain"] },
  { q: "Overall, how confident do you feel about your treatment right now?", opts: ["Very", "Mostly", "Unsure", "Struggling"] },
];

/* Four questions, one tap each; answers land in the store on the last tap. */
export function CheckinFlow({ navigate }: { navigate: Navigate }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  function pick(opt: string) {
    const next = answers.slice();
    next[idx] = opt;
    setAnswers(next);
    setTimeout(() => {
      if (idx < questions.length - 1) {
        setIdx(idx + 1);
      } else {
        store.set((s) => ({ tasks: { ...s.tasks, checkin: true }, checkinAnswers: next }));
        setDone(true);
      }
    }, 220);
  }

  return (
    <div className="mj-screen">
      <SubBar title="MS Symptom Check-In" onBack={() => (!done && idx > 0 ? setIdx(idx - 1) : navigate("home"))} />
      {!done && (
        <div className="mj-progress">
          <div className="mj-progress-fill" style={{ width: ((idx + 1) / questions.length) * 100 + "%" }} />
        </div>
      )}
      <div className="mj-body scroll">
        {!done ? (
          <div className="mj-fade" key={idx}>
            <p className="mj-qcount">
              Question {idx + 1} of {questions.length}
            </p>
            <h2 className="mj-flowtitle">{questions[idx].q}</h2>
            <div className="mj-stack">
              {questions[idx].opts.map((opt) => {
                const on = answers[idx] === opt;
                return (
                  <button key={opt} type="button" className={"mj-optcard" + (on ? " on" : "")} onClick={() => pick(opt)}>
                    <span className={"mj-radio" + (on ? " on" : "")}>{on && <span />}</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
            <p className="mj-privnote">
              <Ic name="lock" size={13} color="var(--oj-gray)" style={{ verticalAlign: "-2px", marginRight: 5 }} />
              Your answers are shared only with your care team.
            </p>
          </div>
        ) : (
          <div className="mj-fade mj-success">
            <span className="mj-successring">
              <Ic name="check" size={34} color="#fff" />
            </span>
            <h2 className="mj-flowtitle" style={{ textAlign: "center" }}>
              Check-in sent
            </h2>
            <p className="mj-successsub">
              Shared with your care team. Sam, PharmD reviews every check-in and will reach out if anything needs
              attention.
            </p>
            <PillBtn onClick={() => navigate("home")} style={{ width: "100%" }}>
              Back to home
            </PillBtn>
          </div>
        )}
      </div>
    </div>
  );
}
