import { useRef, useState } from "react";
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

export default function App() {
  const [route, setRoute] = useState<Route>("home");
  const [showCopay, setShowCopay] = useState(false);
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
      {/* key remounts the screen per route: scroll resets and the fade-in replays */}
      <div className="mj-device" key={route}>
        {route === "home" && <HomeScreen navigate={navigate} onInfo={onInfo} />}
        {route === "refill" && <RefillFlow navigate={navigate} />}
        {route === "checkin" && <CheckinFlow navigate={navigate} />}
        {route === "meds" && <MedsScreen navigate={navigate} onInfo={onInfo} />}
        {route === "orders" && <OrdersScreen navigate={navigate} onInfo={onInfo} />}
        {route === "support" && <SupportScreen navigate={navigate} onInfo={onInfo} />}
        {showCopay && <CopaySheet onClose={() => setShowCopay(false)} />}
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
