import { defineConfig, devices } from "@playwright/test";

/* Runs the E2E suite against the production site instead of a local
   preview: npm run test:live. Screenshot capture is skipped so local
   docs/ images are never regenerated from production. */
export default defineConfig({
  testDir: "e2e",
  testIgnore: "**/screenshots.spec.ts",
  timeout: 30_000,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "https://myjourney.help",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 950 } },
    },
    {
      // Project-level testIgnore replaces the top-level one, so both
      // exclusions must be repeated here.
      name: "mobile",
      use: { ...devices["iPhone 14"] },
      testIgnore: ["**/screenshots.spec.ts", "**/a11y.spec.ts"],
    },
  ],
});
