import { useRef } from "react";
import { cal } from "../lib/calendar";
import type { NavTarget } from "../lib/nav";
import { useDialog } from "../lib/useDialog";
import { useMJ } from "../store/store";
import { Ic, type IconName } from "../components/Ic";

interface NotificationsSheetProps {
  onClose: () => void;
  /** Close the sheet and jump to the item's flow. */
  onOpen: (target: NavTarget) => void;
}

/* The bell dot promises something behind it — this sheet is that something:
   the open items, each one tap away from its flow. */
export function NotificationsSheet({ onClose, onOpen }: NotificationsSheetProps) {
  const s = useMJ();
  const ref = useRef<HTMLDivElement>(null);
  useDialog(ref, onClose);

  const items: { icon: IconName; title: string; sub: string; target: NavTarget }[] = [];
  if (!s.refill.scheduled) {
    items.push({
      icon: "calendar-clock",
      title: "Refill window open",
      sub: `Schedule by ${cal.scheduleBy} to stay on track`,
      target: "refill",
    });
  }
  if (!s.tasks.checkin) {
    items.push({
      icon: "clipboard-list",
      title: "MS Symptom Check-In",
      sub: `Due ${cal.checkinDue} · 3 min`,
      target: "checkin",
    });
  }
  if (!s.tasks.copay) {
    items.push({
      icon: "credit-card",
      title: "Co-pay assistance renewal",
      sub: `Expires ${cal.copayExpires} · keeps your co-pay at $0`,
      target: "copay",
    });
  }

  return (
    <div className="mj-sheetwrap" onClick={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mj-notifs-title"
        className="mj-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mj-sheethandle" />
        <button type="button" className="mj-sheetclose" onClick={onClose} aria-label="Close">
          <Ic name="x" size={18} color="var(--oj-navy)" />
        </button>
        <h3 className="mj-sheettitle" id="mj-notifs-title">Notifications</h3>
        {items.length > 0 ? (
          <div className="mj-stack" style={{ marginBottom: 6 }}>
            {items.map((it) => (
              <button key={it.target} type="button" className="mj-taskcard tap" onClick={() => onOpen(it.target)}>
                <span className="mj-taskicon">
                  <Ic name={it.icon} size={20} color="#fff" />
                </span>
                <div className="mj-taskmeta">
                  <p className="mj-tasktitle">{it.title}</p>
                  <p className="mj-tasksub">{it.sub}</p>
                </div>
                <Ic name="chevron-right" size={18} color="var(--oj-gray)" />
              </button>
            ))}
          </div>
        ) : (
          <div className="mj-alldone" style={{ marginBottom: 6 }}>
            <Ic name="circle-check" size={18} color="var(--oj-blue)" />
            <span>You&rsquo;re all caught up. Next dose {cal.nextDose}.</span>
          </div>
        )}
      </div>
    </div>
  );
}
