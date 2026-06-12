import { Ic } from "./Ic";

export function SubBar({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="mj-subbar">
      <button className="mj-backbtn" type="button" onClick={onBack} aria-label="Back">
        <Ic name="chevron-left" size={22} color="var(--oj-navy)" />
      </button>
      <span className="mj-subtitle">{title}</span>
      <span style={{ width: 38 }} />
    </div>
  );
}
