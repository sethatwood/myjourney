import { expect } from "chai";
import { cal, dayLabel, greeting, monthYearLabel, shortLabel } from "../src/lib/calendar";

describe("calendar", () => {
  it("formats day labels like 'Thu, Jun 5'", () => {
    expect(dayLabel(0)).to.match(/^(Sun|Mon|Tue|Wed|Thu|Fri|Sat), [A-Z][a-z]{2} \d{1,2}$/);
  });

  it("anchors offset 0 to the real today", () => {
    const expected = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date());
    expect(shortLabel(0)).to.equal(expected);
  });

  it("spaces day offsets a real day apart", () => {
    expect(dayLabel(1)).to.not.equal(dayLabel(0));
    expect(shortLabel(7)).to.not.equal(shortLabel(0));
  });

  it("offers three delivery days with the middle one recommended", () => {
    expect(cal.deliveryOptions).to.have.length(3);
    expect(cal.deliveryOptions[1].note).to.equal("Recommended");
    expect(cal.deliveryOptions[0].note).to.equal("");
  });

  it("renews co-pay on a month-year horizon", () => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setMonth(d.getMonth() + 11);
    const expected = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(d);
    expect(monthYearLabel(11)).to.equal(expected);
    expect(cal.copayThrough).to.equal(expected);
  });

  it("greets by time of day", () => {
    expect(["Good morning", "Good afternoon", "Good evening"]).to.include(greeting());
  });
});
