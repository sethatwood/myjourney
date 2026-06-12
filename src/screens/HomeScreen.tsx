import { cal, greeting } from "../lib/calendar";
import type { Navigate } from "../lib/nav";
import { openTaskCount, store, useMJ } from "../store/store";
import { AppBar } from "../components/AppBar";
import { BottomNav } from "../components/BottomNav";
import { CardPills } from "../components/CardPills";
import { Ic, type IconName } from "../components/Ic";
import { PillBtn } from "../components/PillBtn";
import { SectionLabel } from "../components/SectionLabel";
import mark from "../assets/mark.png";

/* Home is one dataset under two cognitive modalities: Action Center
   answers "what do I do next?", Journey answers "where am I in the
   arc of my therapy?". The toggle remembers the visitor's preference. */

function ModeToggle() {
  const s = useMJ();
  return (
    <div className="mj-modetoggle" role="tablist" aria-label="Home view">
      <button
        type="button"
        role="tab"
        aria-selected={s.homeMode === "action"}
        className={"mj-mode" + (s.homeMode === "action" ? " on" : "")}
        onClick={() => store.set({ homeMode: "action" })}
      >
        <Ic name="list-checks" size={15} />
        Action Center
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={s.homeMode === "journey"}
        className={"mj-mode" + (s.homeMode === "journey" ? " on" : "")}
        onClick={() => store.set({ homeMode: "journey" })}
      >
        <Ic name="route" size={15} />
        Journey
      </button>
    </div>
  );
}

/* ---------- Action Center ---------- */

const quickActions: { icon: IconName; label: string; target: Parameters<Navigate>[0] }[] = [
  { icon: "calendar-clock", label: "Schedule", target: "refill" },
  { icon: "pill", label: "Meds", target: "meds" },
  { icon: "package", label: "Orders", target: "orders" },
  { icon: "message-circle", label: "Ask Sam", target: "support" },
];

function ActionHome({ navigate }: { navigate: Navigate }) {
  const s = useMJ();
  const openCount = openTaskCount(s);
  return (
    <div>
      {!s.refill.scheduled ? (
        <div className="mj-hero-blue">
          <CardPills />
          <p className="mj-hero-eyebrow">Refill window open</p>
          <h2 className="mj-hero-title">Velmira 20&nbsp;mg is ready to schedule</h2>
          <p className="mj-hero-sub">Schedule by {cal.scheduleBy} to stay on track.</p>
          <PillBtn variant="white" onClick={() => navigate("refill")}>
            Schedule refill
          </PillBtn>
        </div>
      ) : (
        <div className="mj-hero-navy">
          <CardPills />
          <p className="mj-hero-eyebrow" style={{ color: "var(--oj-blue)" }}>
            Refill scheduled
          </p>
          <h2 className="mj-hero-title">Next shipment arrives {s.refill.deliveryLabel}</h2>
          <p className="mj-hero-sub">Temperature-controlled packaging. We&rsquo;ll text you tracking updates.</p>
          <PillBtn variant="blue" onClick={() => navigate("orders")}>
            View order
          </PillBtn>
        </div>
      )}

      <SectionLabel>Care activities</SectionLabel>
      <div className="mj-stack">
        {!s.tasks.checkin ? (
          <button type="button" className="mj-taskcard tap" onClick={() => navigate("checkin")}>
            <span className="mj-taskicon">
              <Ic name="clipboard-list" size={20} color="#fff" />
            </span>
            <div className="mj-taskmeta">
              <p className="mj-tasktitle">MS Symptom Check-In</p>
              <p className="mj-tasksub">Due {cal.checkinDue} &middot; 3 min</p>
            </div>
            <Ic name="chevron-right" size={18} color="var(--oj-gray)" />
          </button>
        ) : (
          <div className="mj-taskcard done">
            <span className="mj-taskicon graycheck">
              <Ic name="check" size={18} color="#fff" />
            </span>
            <div className="mj-taskmeta">
              <p className="mj-tasktitle">MS Symptom Check-In</p>
              <p className="mj-tasksub">Completed today &middot; shared with your care team</p>
            </div>
          </div>
        )}
        {!s.tasks.copay ? (
          <button type="button" className="mj-taskcard tap" onClick={() => navigate("copay")}>
            <span className="mj-taskicon">
              <Ic name="credit-card" size={20} color="#fff" />
            </span>
            <div className="mj-taskmeta">
              <p className="mj-tasktitle">Confirm co-pay assistance renewal</p>
              <p className="mj-tasksub">2 min &middot; keeps your co-pay at $0</p>
            </div>
            <Ic name="chevron-right" size={18} color="var(--oj-gray)" />
          </button>
        ) : (
          <div className="mj-taskcard done">
            <span className="mj-taskicon graycheck">
              <Ic name="check" size={18} color="#fff" />
            </span>
            <div className="mj-taskmeta">
              <p className="mj-tasktitle">Co-pay assistance renewed</p>
              <p className="mj-tasksub">Through {cal.copayThrough} &middot; co-pay stays $0</p>
            </div>
          </div>
        )}
        <div className="mj-taskcard done">
          <span className="mj-taskicon graycheck">
            <Ic name="check" size={18} color="#fff" />
          </span>
          <div className="mj-taskmeta">
            <p className="mj-tasktitle">Annual consent form</p>
            <p className="mj-tasksub">Signed {cal.consentSigned}</p>
          </div>
        </div>
      </div>

      <SectionLabel>Quick actions</SectionLabel>
      <div className="mj-grid4">
        {quickActions.map((q) => (
          <button key={q.label} type="button" className="mj-quicktile tap" onClick={() => navigate(q.target)}>
            <span className="mj-quickicon">
              <Ic name={q.icon} size={20} color="#fff" />
            </span>
            <span className="mj-quicklabel">{q.label}</span>
          </button>
        ))}
      </div>
      {openCount === 0 && (
        <div className="mj-alldone">
          <Ic name="circle-check" size={18} color="var(--oj-blue)" />
          <span>You&rsquo;re all caught up. Next dose {cal.nextDose}.</span>
        </div>
      )}
    </div>
  );
}

/* ---------- Journey Timeline ---------- */

interface TLItemProps {
  state: "past" | "now" | "next";
  icon: IconName;
  date: string;
  title: string;
  sub: string;
  cta?: string;
  onCta?: () => void;
}

function TLItem({ state, icon, date, title, sub, cta, onCta }: TLItemProps) {
  return (
    <div className={"mj-tl-item " + state}>
      <div className="mj-tl-rail">
        <span className="mj-tl-node">
          {state === "past" && <Ic name="check" size={12} color="#fff" />}
          {state === "now" && <span className="mj-tl-nowdot" />}
        </span>
      </div>
      <div className={"mj-tl-card" + (state === "now" ? " elevated" : "")}>
        <p className="mj-tl-date">{date}</p>
        <div className="mj-tl-row">
          <span className={"mj-tl-icon" + (state === "now" ? " blue" : "")}>
            <Ic name={icon} size={18} color={state === "now" ? "#fff" : "var(--oj-blue)"} />
          </span>
          <div>
            <p className="mj-tl-title">{title}</p>
            <p className="mj-tl-sub">{sub}</p>
          </div>
        </div>
        {cta && (
          <div style={{ marginTop: 14 }}>
            <PillBtn onClick={onCta}>{cta}</PillBtn>
          </div>
        )}
      </div>
    </div>
  );
}

function JourneyHome({ navigate }: { navigate: Navigate }) {
  const s = useMJ();
  return (
    <div>
      <div className="mj-journeychip">
        <span className="mj-mark sm">
          <img src={mark} alt="" />
        </span>
        <span>
          <strong>Velmira 20&nbsp;mg</strong> &middot; Month 6 of therapy &middot; On track
        </span>
      </div>
      <div className="mj-timeline">
        <TLItem state="past" icon="syringe" date={cal.dose6} title="Dose 6 taken" sub="Logged on time · streak: 6" />
        <TLItem state="past" icon="package-check" date={cal.delivered1038} title="Shipment delivered" sub="Order #1038 · signed by M. Torres" />
        {s.tasks.checkin && (
          <TLItem state="past" icon="clipboard-check" date={"Today, " + cal.todayShort} title="MS Symptom Check-In sent" sub="Shared with your care team" />
        )}
        {!s.refill.scheduled ? (
          <TLItem
            state="now"
            icon="calendar-clock"
            date={"Today, " + cal.todayShort}
            title="Refill window open"
            sub={"Schedule your next shipment by " + cal.scheduleByShort + "."}
            cta="Schedule refill"
            onCta={() => navigate("refill")}
          />
        ) : (
          <TLItem
            state="now"
            icon="package"
            date={"Arrives " + s.refill.deliveryLabel}
            title="Shipment scheduled"
            sub="Order #1043 · temperature-controlled"
            cta="View order"
            onCta={() => navigate("orders")}
          />
        )}
        {!s.tasks.checkin && (
          <TLItem
            state="next"
            icon="clipboard-list"
            date={"Due " + cal.checkinDue}
            title="MS Symptom Check-In"
            sub="3 minutes · shared with your care team"
            cta="Start check-in"
            onCta={() => navigate("checkin")}
          />
        )}
        <TLItem state="next" icon="syringe" date={cal.nextDose} title="Next dose due" sub="A reminder will arrive that morning." />
        <TLItem state="next" icon="flask-conical" date={cal.labWork} title="Quarterly lab work" sub="Order will be sent to your lab." />
      </div>
    </div>
  );
}

export function HomeScreen({ navigate, onInfo, onBell }: { navigate: Navigate; onInfo: () => void; onBell: () => void }) {
  const s = useMJ();
  const open = openTaskCount(s);
  return (
    <div className="mj-screen">
      <AppBar onInfo={onInfo} onBell={onBell} />
      <div className="mj-body scroll">
        <h1 className="mj-greet">{greeting()}, Maya</h1>
        <p className="mj-greet-sub">
          {open > 0
            ? "You have " + open + " thing" + (open > 1 ? "s" : "") + " to take care of this week."
            : "Nothing needs your attention right now."}
        </p>
        <ModeToggle />
        {s.homeMode === "action" ? <ActionHome navigate={navigate} /> : <JourneyHome navigate={navigate} />}
      </div>
      <BottomNav active="home" onNavigate={navigate} />
    </div>
  );
}
