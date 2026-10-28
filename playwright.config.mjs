import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "https://127.0.0.1:8787",
    contextOptions: { reducedMotion: "reduce" },
    ignoreHTTPSErrors: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
    {
      name: "webkit-resilience",
      testMatch: /resilience\.spec\.mjs/,
      use: {
        ...devices["iPhone 13"],
        browserName: "webkit",
      },
    },
  ],
  webServer: {
    command: "npm run dev -- --port 8787 --local-protocol https",
    ignoreHTTPSErrors: true,
    url: "https://127.0.0.1:8787",
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
