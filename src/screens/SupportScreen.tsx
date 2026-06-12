import { useEffect, useRef, useState } from "react";
import type { Navigate } from "../lib/nav";
import { store, useMJ } from "../store/store";
import { AppBar } from "../components/AppBar";
import { BottomNav } from "../components/BottomNav";
import { Ic } from "../components/Ic";

export function SupportScreen({ navigate, onInfo, onBell }: { navigate: Navigate; onInfo: () => void; onBell: () => void }) {
  const s = useMJ();
  const [draft, setDraft] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view.
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  });

  function send() {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    store.set((st) => ({ messages: [...st.messages, { from: "me" as const, text, time: "Now" }] }));
    setTimeout(() => {
      store.set((st) => ({
        messages: [
          ...st.messages,
          {
            from: "pharm" as const,
            text: "Thanks Maya — got it. I'll take a look and get back to you within the hour.",
            time: "Now",
          },
        ],
      }));
    }, 1400);
  }

  return (
    <div className="mj-screen">
      <AppBar onInfo={onInfo} onBell={onBell} />
      <div className="mj-supporthead">
        <span className="mj-pharmavatar lg">
          <Ic name="user-round" size={22} color="#fff" />
        </span>
        <div>
          <p className="mj-tasktitle">Sam Okafor, PharmD</p>
          <p className="mj-tasksub">Your specialty pharmacist &middot; typically replies in ~1 hr</p>
        </div>
      </div>
      <div className="mj-body scroll mj-thread" ref={threadRef}>
        {s.messages.map((m, i) => (
          <div key={i} className={"mj-msg " + (m.from === "me" ? "me" : "pharm")}>
            <p className="mj-msgtext">{m.text}</p>
            <span className="mj-msgtime">{m.time}</span>
          </div>
        ))}
      </div>
      <div className="mj-composer">
        <input
          className="mj-composer-input"
          placeholder="Message Sam…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />
        <button type="button" className="mj-sendbtn" onClick={send} aria-label="Send">
          <Ic name="arrow-up" size={18} color="#fff" />
        </button>
      </div>
      <BottomNav active="support" onNavigate={navigate} />
    </div>
  );
}
