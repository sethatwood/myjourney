import { expect } from "chai";
import { businessOffset, cal, dayLabel, greeting, monthYearLabel, shortLabel } from "../src/lib/calendar";

const WEEKEND = /^(Sat|Sun)/;

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
    expect(cal.deliverBy).to.equal(cal.deliveryOptions[1].label);
  });

  it("never offers weekend deliveries", () => {
    for (const opt of cal.deliveryOptions) {
      expect(opt.label).to.not.match(WEEKEND);
    }
    expect(cal.transitArrives).to.not.match(WEEKEND);
    expect(businessOffset(0)).to.be.at.least(0);
  });

  it("renews co-pay a full 12 months out", () => {
    const now = new Date();
    const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(now);
    expect(cal.copayThrough).to.equal(`${month} ${now.getFullYear() + 1}`);
  });

  it("keeps the dose history on a 14-day grid with one late dose", () => {
    // dose 13 at −6; 12/11 at 14-day steps; dose 10 logged a day late (−47 vs −48).
    expect(cal.dose13).to.equal(dayLabel(-6));
    expect(cal.dose12).to.equal(dayLabel(-20));
    expect(cal.dose11).to.equal(dayLabel(-34));
    expect(cal.dose10).to.equal(dayLabel(-47));
  });

  it("greets by time of day", () => {
    expect(["Good morning", "Good afternoon", "Good evening"]).to.include(greeting());
  });
});
