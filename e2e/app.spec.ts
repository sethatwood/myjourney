import { expect, test, type Page } from "@playwright/test";

/* Every test runs in a fresh browser context — the clean-profile case
   (no localStorage) is exercised on every single test. */

function label(offset: number): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(d);
  const monthDay = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(d);
  return `${weekday}, ${monthDay}`;
}

function isWeekend(offset: number): boolean {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d.getDay() === 0 || d.getDay() === 6;
}

/** Mirrors the app's delivery-day derivation: three business days from +4. */
function deliveryLabels(): string[] {
  const out: string[] = [];
  let o = 4;
  while (out.length < 3) {
    while (isWeekend(o)) o++;
    out.push(label(o));
    o++;
  }
  return out;
}

const consoleErrors: string[] = [];

test.beforeEach(async ({ page }) => {
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(String(err)));
  // Skip the first-visit About introduction (covered by about.spec.ts) —
  // but only when no state exists yet, so persistence tests keep theirs.
  await page.addInitScript(() => {
    if (!localStorage.getItem("mj-state-v1")) {
      localStorage.setItem("mj-state-v1", JSON.stringify({ aboutSeen: true }));
    }
  });
  await page.goto("/");
});

test.afterEach(() => {
  expect(consoleErrors, "console must stay clean").toEqual([]);
});

async function completeRefill(page: Page) {
  await page.locator(".mj-hero-blue").getByText("Schedule refill").click();
  await expect(page.getByText("Confirm your prescription")).toBeVisible();
  await page.getByText("Continue", { exact: true }).click();
  await expect(page.getByText("Choose delivery")).toBeVisible();
  await page.getByText("Continue", { exact: true }).click();
  await expect(page.getByText("Review & confirm")).toBeVisible();
  await page.getByText("Confirm refill").click();
  await expect(page.getByRole("heading", { name: "Refill scheduled" })).toBeVisible();
}

async function completeCheckin(page: Page) {
  await page.getByText("MS Symptom Check-In").click();
  await expect(page.getByText("Question 1 of 4")).toBeVisible();
  await page.getByText("About the same").click();
  await expect(page.getByText("Question 2 of 4")).toBeVisible();
  await page.getByText("No changes").click();
  await expect(page.getByText("Question 3 of 4")).toBeVisible();
  await page.getByText("None", { exact: true }).click();
  await expect(page.getByText("Question 4 of 4")).toBeVisible();
  await page.getByText("Very", { exact: true }).click();
  await expect(page.getByText("Check-in sent")).toBeVisible();
  await page.getByText("Back to home").click();
}

test("home renders the default scenario with dates derived from today", async ({ page, isMobile }) => {
  await expect(page.locator(".mj-greet")).toContainText(", Maya");
  await expect(page.locator(".mj-greet-sub")).toContainText("3 things");
  await expect(page.locator(".mj-hero-sub")).toContainText(`Schedule by ${label(3)}`);
  await expect(page.locator(".mj-bell-dot")).toHaveCount(1);
  // Mobile goes full-bleed: the desktop page footer disappears.
  if (isMobile) {
    await expect(page.locator(".mj-pagefoot")).toBeHidden();
  } else {
    await expect(page.locator(".mj-pagefoot")).toBeVisible();
  }
});

test("journey mode shows the timeline and the preference persists", async ({ page }) => {
  await page.getByRole("tab", { name: "Journey" }).click();
  await expect(page.locator(".mj-tl-item")).toHaveCount(6);
  await expect(page.locator(".mj-tl-item.now")).toContainText("Refill window open");
  // Strict chronological order, top to bottom.
  const titles = await page.locator(".mj-tl-title").allInnerTexts();
  expect(titles).toEqual([
    "Shipment delivered",
    "Dose 13 taken",
    "Refill window open",
    "MS Symptom Check-In",
    "Next dose due",
    "Six-month lab work",
  ]);
  await page.reload();
  await expect(page.getByRole("tab", { name: "Journey" })).toHaveAttribute("aria-selected", "true");
});

test("refill flow completes and propagates to orders, hero, and timeline", async ({ page }) => {
  await completeRefill(page);
  await expect(page.locator(".mj-successsub")).toContainText("#1043");
  await page.getByText("View order").click();
  await expect(page.getByText("Shipment #1043")).toBeVisible();
  await expect(page.locator(".mj-ordercard")).toHaveCount(2);
  await expect(page.locator(".mj-ordercard").first().locator(".mj-step-dot.on")).toHaveCount(1);
  await page.getByRole("button", { name: "Home" }).click();
  await expect(page.locator(".mj-hero-navy")).toContainText("Your refill arrives");
  await page.getByRole("tab", { name: "Journey" }).click();
  await expect(page.locator(".mj-tl-item.now")).toContainText("Shipment scheduled");
  // The scheduled card is a today event; the arrival date is detail, so
  // the rail stays chronological with the check-in due date below it.
  await expect(page.locator(".mj-tl-item.now .mj-tl-date")).toContainText("Today");
  await expect(page.locator(".mj-tl-item.now")).toContainText("arrives");
});

test("refill recommends a coherent business-day delivery", async ({ page }) => {
  await page.locator(".mj-hero-blue").getByText("Schedule refill").click();
  const expected = deliveryLabels();
  await expect(page.locator(".mj-smartsub")).toContainText(`Your next dose is ${label(8)}`);
  await expect(page.locator(".mj-smartsub")).toContainText(`delivery by ${expected[1]}`);
  await page.getByText("Continue", { exact: true }).click();
  await expect(page.locator(".mj-datecard")).toHaveCount(3);
  await expect(page.locator(".mj-datecard.on")).toContainText("Recommended");
  await expect(page.locator(".mj-datecard.on")).toContainText(expected[1]);
});

test("symptom check-in completes and the task reads done everywhere", async ({ page }) => {
  await completeCheckin(page);
  await expect(page.locator(".mj-taskcard.done").first()).toContainText("Completed today");
  await page.getByRole("tab", { name: "Journey" }).click();
  await expect(page.getByText("MS Symptom Check-In sent")).toBeVisible();
});

test("completing all three tasks clears the bell and shows all caught up", async ({ page }) => {
  await completeRefill(page);
  await page.getByText("Back to home").click();
  await completeCheckin(page);
  await page.getByText("Confirm co-pay assistance renewal").click();
  await page.getByText("Renew — takes 2 seconds").click();
  await expect(page.getByText("Renewed through")).toBeVisible();
  await page.getByText("Done", { exact: true }).click();
  await expect(page.locator(".mj-bell-dot")).toHaveCount(0);
  await expect(page.locator(".mj-alldone")).toContainText(`Next dose ${label(8)}`);
  await expect(page.locator(".mj-greet-sub")).toContainText("Nothing needs your attention");
  // The bell still answers, even with nothing left to do.
  await page.getByRole("button", { name: "Notifications" }).click();
  await expect(page.locator(".mj-sheetwrap")).toContainText("all caught up");
});

test("bell opens notifications and deep-links to a task", async ({ page }) => {
  await page.getByRole("button", { name: "Notifications" }).click();
  await expect(page.getByRole("heading", { name: "Notifications" })).toBeVisible();
  await expect(page.locator(".mj-sheetwrap .mj-taskcard")).toHaveCount(3);
  await page.locator(".mj-sheetwrap").getByText("MS Symptom Check-In").click();
  await expect(page.getByText("Question 1 of 4")).toBeVisible();
});

test("state survives a reload", async ({ page }) => {
  await completeRefill(page);
  await page.getByText("Back to home").click();
  await page.reload();
  await expect(page.locator(".mj-hero-navy")).toContainText("Your refill arrives");
});

test("chat sends a message and the pharmacist replies", async ({ page }) => {
  await page.getByRole("button", { name: "Support" }).click();
  await expect(page.getByText("Sam Okafor, PharmD")).toBeVisible();
  await expect(page.locator(".mj-msg")).toHaveCount(3);
  await page.locator(".mj-composer-input").fill("Quick question about storage while traveling");
  await page.locator(".mj-composer-input").press("Enter");
  await expect(page.locator(".mj-msg")).toHaveCount(4);
  await expect(page.locator(".mj-msg").last()).toContainText("get back to you", { timeout: 5000 });
  // Reload lands on Home (route state is deliberately not persisted) —
  // navigate back to Support and confirm the thread survived.
  await page.reload();
  await page.getByRole("button", { name: "Support" }).click();
  await expect(page.locator(".mj-msg")).toHaveCount(5);
});

test("reset demo data restores the initial scenario", async ({ page }) => {
  await completeRefill(page);
  await page.getByText("Back to home").click();
  await page.getByRole("button", { name: "About this prototype" }).click();
  await expect(page.getByText("Built by Seth Atwood")).toBeVisible();
  await page.getByRole("button", { name: "Reset demo data" }).click();
  await expect(page.locator(".mj-toast")).toContainText("Demo data reset");
  await expect(page.locator(".mj-hero-blue")).toContainText("ready to schedule");
  await expect(page.locator(".mj-bell-dot")).toHaveCount(1);
  await expect(page.locator(".mj-greet-sub")).toContainText("3 things");
});
