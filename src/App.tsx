import { useState } from "react";
import type { NavTarget, Route } from "./lib/nav";
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
  const [showAbout, setShowAbout] = useState(false);

  function navigate(target: NavTarget) {
    if (target === "copay") {
      setShowCopay(true);
      return;
    }
    setRoute(target);
  }
  const onInfo = () => setShowAbout(true);

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
        {showAbout && <AboutOverlay onClose={() => setShowAbout(false)} />}
      </div>
      <p className="mj-pagefoot">
        MyJourney &mdash; a working prototype in the CassianRx problem space &middot; fictional patient &amp; therapy
        &middot; built on the ONE Journey design language
      </p>
    </div>
  );
}
