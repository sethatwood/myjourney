/* Global app state: a small external store with localStorage persistence.
   Same idea as a Zustand store, but useSyncExternalStore needs no dependency. */

import { useSyncExternalStore } from "react";
import { shortLabel } from "../lib/calendar";

export type HomeMode = "action" | "journey";

export interface Message {
  from: "pharm" | "me";
  text: string;
  time: string;
}

export interface MJState {
  homeMode: HomeMode;
  tasks: { checkin: boolean; copay: boolean };
  refill: { scheduled: boolean; deliveryLabel: string | null };
  checkinAnswers: string[] | null;
  messages: Message[];
  /** The About overlay introduces the prototype once per fresh profile. */
  aboutSeen: boolean;
}

const KEY = "mj-state-v1";

function defaults(): MJState {
  return {
    homeMode: "action",
    tasks: { checkin: false, copay: false },
    refill: { scheduled: false, deliveryLabel: null },
    checkinAnswers: null,
    aboutSeen: false,
    messages: [
      {
        from: "pharm",
        text: "Hi Maya! I'm Sam, your specialty pharmacist. Message me here any time — injection questions, side effects, scheduling, anything.",
        time: shortLabel(-10),
      },
      {
        from: "me",
        text: "Thanks Sam! The new autoinjector cap was easier this time.",
        time: shortLabel(-6),
      },
      {
        from: "pharm",
        text: "Great to hear. Small tip: letting it sit at room temp for 15–20 min makes it even smoother.",
        time: shortLabel(-6),
      },
    ],
  };
}

function load(): MJState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    const saved = JSON.parse(raw) as Partial<MJState>;
    const base = defaults();
    return {
      ...base,
      ...saved,
      tasks: { ...base.tasks, ...saved.tasks },
      refill: { ...base.refill, ...saved.refill },
    };
  } catch {
    return defaults();
  }
}

type Patch = Partial<MJState> | ((s: MJState) => Partial<MJState>);

let state = load();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable (private mode) — state stays in memory */
  }
}

export const store = {
  get: (): MJState => state,
  set(patch: Patch) {
    state = { ...state, ...(typeof patch === "function" ? patch(state) : patch) };
    persist();
    listeners.forEach((fn) => fn());
  },
  reset() {
    state = defaults();
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* storage unavailable — nothing to clear */
    }
    listeners.forEach((fn) => fn());
  },
  subscribe(fn: () => void): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

export function useMJ(): MJState {
  return useSyncExternalStore(store.subscribe, store.get);
}

export function openTaskCount(s: MJState): number {
  let n = 0;
  if (!s.tasks.checkin) n++;
  if (!s.tasks.copay) n++;
  if (!s.refill.scheduled) n++;
  return n;
}
