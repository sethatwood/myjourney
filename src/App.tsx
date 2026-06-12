import { useRef, useState, type CSSProperties } from "react";
import type { NavTarget, Route } from "./lib/nav";
import { store } from "./store/store";
import { Ic } from "./components/Ic";
import { HomeScreen } from "./screens/HomeScreen";
import { MedsScreen } from "./screens/MedsScreen";
import { OrdersScreen } from "./screens/OrdersScreen";
import { SupportScreen } from "./screens/SupportScreen";
import { RefillFlow } from "./flows/RefillFlow";
import { CheckinFlow } from "./flows/CheckinFlow";
import { CopaySheet } from "./flows/CopaySheet";
import { AboutOverlay } from "./flows/AboutOverlay";
import { NotificationsSheet } from "./flows/NotificationsSheet";

/* Desktop stage dressing: the brand's pill bars raining gently down the
   Deep Navy field, each at its own size, speed, and opacity — like
   droplets on glass. Randomized once per visit; negative delays start
   the stream mid-fall so the field is never empty. Reduced motion gets
   a static scatter; mobile hides the backdrop entirely. */
const rainPalette = [
  { bg: "#1c4368", min: 0.3, max: 0.55 },
  { bg: "#248dc9", min: 0.08, max: 0.18 },
  { bg: "#ffffff", min: 0.03, max: 0.06 },
];

function makeRain(reduced: boolean): CSSProperties[] {
  return Array.from({ length: 12 }, (_, i) => {
    const color = rainPalette[i % rainPalette.length];
    const fallSeconds = 24 + Math.random() * 36; // one full crossing: 24–60s
    return {
      left: `${2 + Math.random() * 94}%`,
      top: reduced ? `${Math.random() * 80}%` : "-50vh",
      width: 22 + Math.round(Math.random() * 68),
      height: `${14 + Math.random() * 28}vh`,
      background: color.bg,
      opacity: color.min + Math.random() * (color.max - color.min),
      animation: reduced ? "none" : `mj-rain ${fallSeconds.toFixed(1)}s linear ${(-Math.random() * fallSeconds).toFixed(1)}s infinite`,
    };
  });
}

function Backdrop() {
  const [pills] = useState(() => makeRain(window.matchMedia("(prefers-reduced-motion: reduce)").matches));
  return (
    <div className="mj-backdrop" aria-hidden="true">
      {pills.map((style, i) => (
        <span key={i} style={style} />
      ))}
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState<Route>("home");
  const [showCopay, setShowCopay] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  // The About overlay is the demo's introduction: open it on first visit.
  const [showAbout, setShowAbout] = useState(() => !store.get().aboutSeen);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  function navigate(target: NavTarget) {
    if (target === "copay") {
      setShowCopay(true);
      return;
    }
    setRoute(target);
  }

  function showToast(message: string) {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }

  const onInfo = () => setShowAbout(true);
  const onBell = () => setShowNotifs(true);

  function openFromNotifs(target: NavTarget) {
    setShowNotifs(false);
    navigate(target);
  }

  function closeAbout() {
    store.set({ aboutSeen: true });
    setShowAbout(false);
  }

  function resetDemo() {
    // Full wipe: the next fresh visit gets the first-run introduction again.
    store.reset();
    setShowAbout(false);
    setRoute("home");
    showToast("Demo data reset");
  }

  return (
    <div className="mj-frame">
      <Backdrop />
      {/* key remounts the screen per route: scroll resets and the fade-in replays */}
      <div className="mj-device" key={route}>
        {route === "home" && <HomeScreen navigate={navigate} onInfo={onInfo} onBell={onBell} />}
        {route === "refill" && <RefillFlow navigate={navigate} />}
        {route === "checkin" && <CheckinFlow navigate={navigate} />}
        {route === "meds" && <MedsScreen navigate={navigate} onInfo={onInfo} onBell={onBell} />}
        {route === "orders" && <OrdersScreen navigate={navigate} onInfo={onInfo} onBell={onBell} />}
        {route === "support" && <SupportScreen navigate={navigate} onInfo={onInfo} onBell={onBell} />}
        {showCopay && <CopaySheet onClose={() => setShowCopay(false)} />}
        {showNotifs && <NotificationsSheet onClose={() => setShowNotifs(false)} onOpen={openFromNotifs} />}
        {showAbout && <AboutOverlay onClose={closeAbout} onReset={resetDemo} />}
        {toast && (
          <div className="mj-toast" role="status">
            <Ic name="check" size={15} color="#fff" />
            {toast}
          </div>
        )}
      </div>
      <p className="mj-pagefoot">
        MyJourney &mdash; a working prototype in the CassianRx problem space &middot; fictional patient &amp; therapy
        &middot; built on the ONE Journey design language
      </p>
    </div>
  );
}
