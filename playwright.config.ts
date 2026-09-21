import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PLAYWRIGHT_PORT ?? 3174);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  timeout: 60_000,
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    serviceWorkers: "block",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `pnpm dev --port ${port}`,
    url: baseURL,
    // Never attach to a developer's server with real credentials or stale env.
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_TAMBO_API_KEY: "e2e-synthetic-key-not-a-credential",
      NEXT_PUBLIC_TAMBO_URL: "https://tambo.e2e.invalid",
      NEXT_TELEMETRY_DISABLED: "1",
    },
  },
});
