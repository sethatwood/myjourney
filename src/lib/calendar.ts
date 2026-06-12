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
  d.setDate(1); // avoid day-of-month overflow when the target month is shorter
  d.setMonth(d.getMonth() + offsetMonths);
  return fmtMonthYear.format(d);
}

/** Couriers deliver on business days: roll weekend offsets forward to Monday. */
export function businessOffset(offsetDays: number): number {
  let o = offsetDays;
  while ([0, 6].includes(dateAt(o).getDay())) o++;
  return o;
}

function nextBusinessOffsets(start: number, count: number): number[] {
  const out: number[] = [];
  let o = start;
  while (out.length < count) {
    o = businessOffset(o);
    out.push(o);
    o += 1;
  }
  return out;
}

/** Time-of-day greeting to match the live clock. */
export function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* Named scenario dates. The therapy is a 14-day autoinjector cycle, six
   months in: dose 13 was taken six days ago, dose 14 lands in eight days,
   and each shipment arrives about three days before the dose it supplies. */

const deliveryOffsets = nextBusinessOffsets(4, 3);

export const cal = {
  todayShort: shortLabel(0), // "Jun 12"
  scheduleBy: dayLabel(3), // refill ordering deadline
  checkinDue: dayLabel(3), // symptom check-in due
  nextDose: dayLabel(8),
  labWork: dayLabel(10), // six-month labs, just past the next dose
  transitArrives: dayLabel(businessOffset(2)), // supplies shipment in transit
  consentSigned: shortLabel(-10),
  copayExpires: shortLabel(18),
  copayThrough: monthYearLabel(12), // renewal horizon
  dose13: dayLabel(-6),
  dose12: dayLabel(-20),
  dose11: dayLabel(-34),
  dose10: dayLabel(-47), // scheduled −48, logged a day late
  delivered1038: dayLabel(-9),
  delivered1034: dayLabel(-23),
  delivered1029: dayLabel(-37),
  /* Refill delivery choices: three business days, the middle one is what
     the scheduling service recommends — landing ahead of the next dose. */
  deliveryOptions: deliveryOffsets.map((o, i) => ({
    label: dayLabel(o),
    note: i === 1 ? "Recommended" : "",
  })),
  deliverBy: dayLabel(deliveryOffsets[1]), // the recommended arrival date
};
