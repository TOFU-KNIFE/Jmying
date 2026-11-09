import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/v2",
  timeout: process.env.CI ? 900000 : 90000,
  expect: { timeout: process.env.CI ? 90000 : 30000 },
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    serviceWorkers: "block",
    reducedMotion: "reduce",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    launchOptions:
      process.platform === "darwin"
        ? { channel: "chromium", args: ["--use-angle=metal"] }
        : {
            channel: "chromium",
            args: [
              "--use-gl=angle",
              "--use-angle=swiftshader",
              "--enable-unsafe-swiftshader",
            ],
          },
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], browserName: "chromium" },
    },
  ],
  webServer: {
    command: "npm run preview",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
