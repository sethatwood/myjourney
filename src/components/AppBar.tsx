import { openTaskCount, useMJ } from "../store/store";
import { Ic } from "./Ic";
import mark from "../assets/mark.png";

export function AppBar({ onInfo, onBell }: { onInfo: () => void; onBell: () => void }) {
  const s = useMJ();
  const open = openTaskCount(s);
  return (
    <div className="mj-appbar">
      <div className="mj-appbar-brand">
        <span className="mj-mark">
          <img src={mark} alt="" />
        </span>
        <span className="mj-appname">MyJourney</span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="mj-bell" type="button" aria-label="About this prototype" onClick={onInfo}>
          <Ic name="info" size={20} color="var(--oj-navy)" />
        </button>
        <button className="mj-bell" type="button" aria-label="Notifications" onClick={onBell}>
          <Ic name="bell" size={20} color="var(--oj-navy)" />
          {open > 0 && <span className="mj-bell-dot" />}
        </button>
      </div>
    </div>
  );
}
