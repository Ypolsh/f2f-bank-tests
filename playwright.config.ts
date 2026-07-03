import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 4,
  retries: 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost',
    // locale: 'ru-RU',
    // timezoneId: 'Europe/Moscow',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],
});