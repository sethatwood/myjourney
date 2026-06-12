import type { Navigate, Route } from "../lib/nav";
import { Ic, type IconName } from "./Ic";

const items: { id: Route; icon: IconName; label: string }[] = [
  { id: "home", icon: "house", label: "Home" },
  { id: "meds", icon: "pill", label: "Meds" },
  { id: "orders", icon: "package", label: "Orders" },
  { id: "support", icon: "message-circle", label: "Support" },
];

export function BottomNav({ active, onNavigate }: { active: Route; onNavigate: Navigate }) {
  return (
    <div className="mj-bottomnav">
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          className={"mj-nav-item" + (it.id === active ? " on" : "")}
          onClick={() => onNavigate(it.id)}
        >
          <Ic name={it.icon} size={22} />
          <span>{it.label}</span>
        </button>
      ))}
    </div>
  );
}
