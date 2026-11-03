import { defineConfig, devices } from "@playwright/test";

/**
 * Acceptance tests (T23.3). They run against a real stack:
 *   E2E_BASE_URL  front-end (default http://localhost:3000)
 *   E2E_API_URL   API origin, without /api/v1 (default http://localhost:8000)
 * The front-end must be built with NEXT_PUBLIC_API_URL=E2E_API_URL and the
 * database must contain db/seed/seed_dev.sql (password "videoteca123").
 * Set E2E_SKIP_WEBSERVER=1 when the front-end is already running elsewhere.
 */
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./e2e/.results",
  globalSetup: "./e2e/global-setup.ts",
  // Tests share one database: run serially for deterministic data.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never", outputFolder: "e2e/.report" }]]
    : "list",
  use: {
    baseURL,
    locale: "pt-BR",
    timezoneId: "America/Fortaleza",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.E2E_SKIP_WEBSERVER
    ? undefined
    : {
        command: "npm run start",
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
