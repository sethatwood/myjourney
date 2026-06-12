import type { CSSProperties } from "react";
import {
  ArrowUp,
  Bell,
  CalendarClock,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  FlaskConical,
  House,
  Info,
  ListChecks,
  Lock,
  MessageCircle,
  Package,
  PackageCheck,
  Pill,
  Route,
  Sparkles,
  Stethoscope,
  Syringe,
  ThermometerSnowflake,
  Truck,
  UserRound,
} from "lucide-react";

const icons = {
  "arrow-up": ArrowUp,
  bell: Bell,
  "calendar-clock": CalendarClock,
  check: Check,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "circle-check": CircleCheck,
  "clipboard-check": ClipboardCheck,
  "clipboard-list": ClipboardList,
  "credit-card": CreditCard,
  "flask-conical": FlaskConical,
  house: House,
  info: Info,
  "list-checks": ListChecks,
  lock: Lock,
  "message-circle": MessageCircle,
  package: Package,
  "package-check": PackageCheck,
  pill: Pill,
  route: Route,
  sparkles: Sparkles,
  stethoscope: Stethoscope,
  syringe: Syringe,
  "thermometer-snowflake": ThermometerSnowflake,
  truck: Truck,
  "user-round": UserRound,
} as const;

export type IconName = keyof typeof icons;

interface IcProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: CSSProperties;
}

/** Lucide line icon in the brand's sizing wrapper (stroke-width 2 per the DS). */
export function Ic({ name, size = 20, color, style }: IcProps) {
  const Icon = icons[name];
  return (
    <span className="ic" style={{ width: size, height: size, color, ...style }}>
      <Icon size={size} strokeWidth={2} aria-hidden="true" />
    </span>
  );
}
