import { test } from "@playwright/test";

/* Regenerates the README images in docs/. Runs with the suite; the
   captures double as a smoke test of every major surface. */

test.use({ deviceScaleFactor: 2, viewport: { width: 1280, height: 950 } });

test("capture README screenshots", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop captures only; mobile is covered below");
  const device = page.locator(".mj-device");

  await page.goto("/");
  await device.screenshot({ path: "docs/home-action.png" });

  await page.getByRole("tab", { name: "Journey" }).click();
  await page.waitForTimeout(400);
  await device.screenshot({ path: "docs/home-journey.png" });

  await page.getByText("Schedule refill").first().click();
  await page.getByText("Smart scheduling").waitFor();
  await page.waitForTimeout(400);
  await device.screenshot({ path: "docs/refill-smart.png" });

  await page.getByText("Continue", { exact: true }).click();
  await page.getByText("Choose delivery").waitFor();
  await page.getByText("Continue", { exact: true }).click();
  await page.getByText("Confirm refill").click();
  await page.getByText("View order").click();
  await page.getByText("Shipment #1043").waitFor();
  await page.waitForTimeout(400);
  await device.screenshot({ path: "docs/orders.png" });

  await page.getByRole("button", { name: "Support" }).click();
  await page.locator(".mj-composer-input").fill("Is it okay to travel with the autoinjector?");
  await page.locator(".mj-composer-input").press("Enter");
  await page.getByText("get back to you").waitFor({ timeout: 5000 });
  await device.screenshot({ path: "docs/support.png" });
});

test("capture mobile screenshot", async ({ browser, baseURL }) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const mobile = await ctx.newPage();
  await mobile.goto(baseURL ?? "http://localhost:4173/");
  await mobile.locator(".mj-greet").waitFor();
  await mobile.waitForTimeout(400);
  await mobile.screenshot({ path: "docs/mobile-home.png" });
  await ctx.close();
});
