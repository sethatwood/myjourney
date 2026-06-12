import { expect } from "chai";
import { openTaskCount, store } from "../src/store/store";

const KEY = "mj-state-v1";

describe("store", () => {
  beforeEach(() => store.reset());

  it("starts with the demo defaults", () => {
    const s = store.get();
    expect(s.homeMode).to.equal("action");
    expect(s.tasks).to.deep.equal({ checkin: false, video: false, copay: false });
    expect(s.refill).to.deep.equal({ scheduled: false, deliveryLabel: null });
    expect(s.checkinAnswers).to.equal(null);
    expect(s.messages).to.have.length(3);
    expect(openTaskCount(s)).to.equal(3);
  });

  it("applies object patches and persists them", () => {
    store.set({ homeMode: "journey" });
    expect(store.get().homeMode).to.equal("journey");
    expect(JSON.parse(localStorage.getItem(KEY)!).homeMode).to.equal("journey");
  });

  it("applies functional patches against current state", () => {
    store.set((s) => ({ tasks: { ...s.tasks, checkin: true } }));
    expect(store.get().tasks.checkin).to.equal(true);
    expect(store.get().tasks.copay).to.equal(false);
    expect(openTaskCount(store.get())).to.equal(2);
  });

  it("notifies subscribers and honors unsubscribe", () => {
    let calls = 0;
    const off = store.subscribe(() => calls++);
    store.set({ homeMode: "journey" });
    off();
    store.set({ homeMode: "action" });
    expect(calls).to.equal(1);
  });

  it("reset restores defaults and clears storage", () => {
    store.set((s) => ({
      tasks: { ...s.tasks, checkin: true, copay: true },
      refill: { scheduled: true, deliveryLabel: "Tue Jun 17" },
    }));
    store.reset();
    expect(openTaskCount(store.get())).to.equal(3);
    expect(localStorage.getItem(KEY)).to.equal(null);
  });

  it("counts open tasks down to zero as work completes", () => {
    store.set((s) => ({
      tasks: { ...s.tasks, checkin: true, copay: true },
      refill: { scheduled: true, deliveryLabel: "Tue Jun 17" },
    }));
    expect(openTaskCount(store.get())).to.equal(0);
  });
});
