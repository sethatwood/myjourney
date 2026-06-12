import { expect, test } from "@playwright/test";

/* First-visit behavior: the About overlay is the demo's introduction. */

test("about overlay opens on first visit and closes via the X", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "About this prototype" })).toBeVisible();
  await expect(page.getByText("Built by Seth Atwood")).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("heading", { name: "About this prototype" })).toHaveCount(0);
  // Seen once, it stays dismissed on later visits.
  await page.reload();
  await expect(page.locator(".mj-greet")).toBeVisible();
  await expect(page.getByRole("heading", { name: "About this prototype" })).toHaveCount(0);
});

test("reset demo data confirms with a toast and restores the first-visit experience", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Close" }).click();
  await page.getByRole("button", { name: "About this prototype" }).click();
  await page.getByRole("button", { name: "Reset demo data" }).click();
  await expect(page.locator(".mj-toast")).toContainText("Demo data reset");
  await expect(page.locator(".mj-greet-sub")).toContainText("3 things");
  // Storage is wiped, so the next load is a true first visit again.
  await page.reload();
  await expect(page.getByRole("heading", { name: "About this prototype" })).toBeVisible();
});
