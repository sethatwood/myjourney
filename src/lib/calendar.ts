/* Demo calendar — every date label in the app derives from the visitor's
   actual "today", so the scenario always reads current: the refill window
   opened this morning, the symptom check-in is due in three days, and the
   next dose is eight days out. Offsets are days relative to today. */

const DAY_MS = 86_400_000;

function dateAt(offsetDays: number): Date {
  const d = new Date();
  d.setHours(12, 0, 0, 0); // anchor to noon so DST shifts never move the day
  return new Date(d.getTime() + offsetDays * DAY_MS);
}

const fmtWeekday = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const fmtMonthDay = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const fmtMonthYear = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

/** "Thu, Jun 5" */
export function dayLabel(offsetDays: number): string {
  const d = dateAt(offsetDays);
  return `${fmtWeekday.format(d)}, ${fmtMonthDay.format(d)}`;
}

/** "Jun 5" */
export function shortLabel(offsetDays: number): string {
  return fmtMonthDay.format(dateAt(offsetDays));
}

/** "May 2027" */
export function monthYearLabel(offsetMonths: number): string {
  const d = dateAt(0);
  d.setMonth(d.getMonth() + offsetMonths);
  return fmtMonthYear.format(d);
}

/** Time-of-day greeting to match the live clock. */
export function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* Named scenario dates. The therapy is a 28-day autoinjector cycle;
   dose 6 was taken a week ago and shipments land a few days before
   each dose. */
export const cal = {
  todayShort: shortLabel(0), // "Jun 12"
  scheduleBy: dayLabel(5), // refill deadline
  scheduleByShort: shortLabel(5),
  checkinDue: dayLabel(3), // symptom check-in due
  nextDose: dayLabel(8),
  labWork: dayLabel(26), // quarterly labs
  transitArrives: dayLabel(2), // shipment already in transit
  consentSigned: shortLabel(-10),
  copayExpires: shortLabel(18),
  copayThrough: monthYearLabel(11), // renewal horizon
  dose6: dayLabel(-7),
  dose5: dayLabel(-35),
  dose4: dayLabel(-62), // logged a day late
  dose3: dayLabel(-91),
  delivered1038: dayLabel(-9),
  delivered1034: dayLabel(-37),
  delivered1029: dayLabel(-66),
  /* Refill delivery choices: the middle option is what the scheduling
     service would recommend — landing 3 days before the next dose. */
  deliveryOptions: [
    { label: dayLabel(4), note: "" },
    { label: dayLabel(5), note: "Recommended" },
    { label: dayLabel(6), note: "" },
  ],
};
