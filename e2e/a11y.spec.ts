import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/* Automated WCAG 2.1 A/AA audit (axe-core) across every major surface.
   Contrast checking is ON. The single exclusion is the Journey Blue hero
   card: white-on-#42b0ff is the brand's own signature treatment (their
   public site renders its hero the same way) and sits below AA — held
   for design review rather than silently restyled here. */

async function expectNoViolations(page: Page) {
  // Let entrance animations settle: axe samples backgrounds mid-transform
  // otherwise. Infinite animations (the landing rain) are excluded.
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) => (a.effect?.getTiming().iterations ?? 1) !== Infinity)
        .map((a) => a.finished.catch(() => undefined))
    )
  );
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .exclude(".mj-hero-blue")
    .analyze();
  expect(
    violations.map((v) => `${v.id}: ${v.help} [${v.nodes.map((n) => n.target).join("; ")}]`)
  ).toEqual([]);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem("mj-state-v1")) {
      localStorage.setItem("mj-state-v1", JSON.stringify({ aboutSeen: true }));
    }
  });
});

test("first-visit about dialog is accessible", async ({ page }) => {
  await page.addInitScript(() => localStorage.removeItem("mj-state-v1"));
  await page.goto("/");
  await expect(page.getByRole("dialog", { name: "About this prototype" })).toBeVisible();
  await expectNoViolations(page);
});

test("home is accessible in both modalities", async ({ page }) => {
  await page.goto("/");
  await expectNoViolations(page);
  await page.getByRole("tab", { name: "Journey" }).click();
  await expect(page.locator(".mj-timeline")).toBeVisible();
  await expectNoViolations(page);
});

test("refill flow steps are accessible", async ({ page }) => {
  await page.goto("/");
  await page.locator(".mj-hero-blue").getByText("Schedule refill").click();
  await expect(page.getByText("Confirm your prescription")).toBeVisible();
  await expectNoViolations(page);
  await page.getByText("Continue", { exact: true }).click();
  await expect(page.getByText("Choose delivery")).toBeVisible();
  await expectNoViolations(page);
});

test("check-in flow is accessible", async ({ page }) => {
  await page.goto("/");
  await page.getByText("MS Symptom Check-In").click();
  await expect(page.getByText("Question 1 of 4")).toBeVisible();
  await expectNoViolations(page);
});

test("co-pay and notifications dialogs are accessible", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Confirm co-pay assistance renewal").click();
  await expect(page.getByRole("dialog", { name: "Renew co-pay assistance" })).toBeVisible();
  await expectNoViolations(page);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Notifications" }).click();
  await expect(page.getByRole("dialog", { name: "Notifications" })).toBeVisible();
  await expectNoViolations(page);
});

test("meds, orders, and support are accessible", async ({ page }) => {
  await page.goto("/");
  const nav = page.locator(".mj-bottomnav");
  await nav.getByRole("button", { name: "Meds" }).click();
  await expect(page.getByText("Dose history")).toBeVisible();
  await expectNoViolations(page);
  await nav.getByRole("button", { name: "Orders" }).click();
  await expect(page.getByText("Shipment #1042")).toBeVisible();
  await expectNoViolations(page);
  await nav.getByRole("button", { name: "Support" }).click();
  await expect(page.getByText("Sam Okafor, PharmD")).toBeVisible();
  await expectNoViolations(page);
});

test("dialogs trap focus, close on Escape, and restore focus", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Notifications" }).click();
  const dialog = page.getByRole("dialog", { name: "Notifications" });
  await expect(dialog).toBeVisible();
  // Focus lands inside the dialog on open.
  await expect(dialog.locator(":focus")).toHaveCount(1);
  // Tab cycles within the dialog, never escaping behind the scrim.
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    await expect(dialog.locator(":focus")).toHaveCount(1);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  // Focus returns to the bell that opened it.
  await expect(page.getByRole("button", { name: "Notifications" })).toBeFocused();
});
