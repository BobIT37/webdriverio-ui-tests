const headless = "--headless";

const isHeadless = process.argv.includes("headless");
export const isRunner = process.argv.includes("runner");

const runnerOpts = [
  "--no-sandbox",
  "--disable-dev-shm-usage",
  "--disable-gpu",
  "--disable-infobars",
];

const args = [
  "no-sandbox",
  "allow-file-access-from-files",
];

isHeadless && args.push(headless);
isRunner && args.push(...runnerOpts);

/**
 * Chrome
 */
export const chrome = {
  browserName: "chrome",
  port: 4444,
  "goog:chromeOptions": {
    args,
  },
};

/**
 * Safari
 */
export const safari = {
  maxInstances: 1,
  browserName: "safari",
};

/**
 * Firefox
 */
export const firefox = {
  browserName: "firefox",
  "moz:firefoxOptions": {
    args,
  },
};

/**
 * Edge Chromium
 */
export const edge = {
  browserName: "MicrosoftEdge",
  "ms:edgeOptions": {
    args,
  },
};