/* State-based routing: a route string in app state, no router dependency.
   Static hosts serve one document, so deep links can never 404. */

export type Route = "home" | "refill" | "checkin" | "meds" | "orders" | "support";

/** "copay" opens the co-pay bottom sheet over the current route. */
export type NavTarget = Route | "copay";

export type Navigate = (target: NavTarget) => void;
