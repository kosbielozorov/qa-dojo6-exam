import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

dotenv.config({ path: './.env' });

const {
  REPEAT,
  RETRIES,
  WORKERS,
  TRACE_VALUE,
  TEST_TIMEOUT,
  EXPECT_TIMEOUT,
  FULLY_PARALLEL,
  API_BASE_URL,
} = process.env;

const RETAIN_ON_FAILURE = 'retain-on-failure';

type TraceMode = 'on' | 'off' | 'retain-on-failure' | 'on-first-retry';

const getTraceSetting = (envValue?: string): TraceMode => {
  const validValues: TraceMode[] = [
    'on',
    'off',
    RETAIN_ON_FAILURE,
    'on-first-retry',
  ];
  return validValues.includes(envValue as TraceMode)
    ? (envValue as TraceMode)
    : RETAIN_ON_FAILURE;
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/',
  outputDir: './test-results/',
  testMatch: ['**/*.test.ts'],
  /* Run tests in files in parallel */
  fullyParallel: process.env.CI
    ? FULLY_PARALLEL === 'true'
    : process.env.FULLY_PARALLEL === 'true',
  timeout: process.env.CI ? Number(TEST_TIMEOUT) : 30 * 1000,
  /**
   * Maximum time expect() should wait for the condition to be met.
   * For example in `await expect(locator).toHaveText();`
   */
  expect: {
    timeout: process.env.CI ? Number(EXPECT_TIMEOUT) : 5000,
  },
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? Number(RETRIES) : 0,
  repeatEach: process.env.CI ? Number(REPEAT) : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? Number(WORKERS) : undefined,
  /* Preserve output based on environment */
  preserveOutput: process.env.CI ? 'failures-only' : 'always',
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    [
      'html',
      {
        open: process.env.CI ? 'never' : 'on-failure',
        outputFolder: 'playwright-report',
      },
    ],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: API_BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: process.env.CI ? getTraceSetting(TRACE_VALUE) : 'on',
  },
});
