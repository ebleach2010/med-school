// Browser smoke test: every primary route renders at phone width without errors or
// horizontal scrolling, and the core flow is reachable by keyboard alone.
// Usage: npm run build && npm start (in another shell), then: npm run smoke
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:8787";
const routes = ["/", "/placement", "/learn", "/learn/f-localization", "/lesson/l-nmj", "/review", "/cases", "/speed", "/reference", "/reference?tab=coverage", "/reference/antibody/nmdar", "/progress", "/settings", "/admin", "/animations"];
const problems = [];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
page.on("pageerror", (e) => problems.push(`page error: ${e.message}`));
page.on("console", (m) => m.type() === "error" && problems.push(`console: ${m.text()}`));

for (const r of routes) {
  await page.goto(BASE + r, { waitUntil: "networkidle" });
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  if (width > 377) problems.push(`horizontal scroll on ${r} (${width}px)`);
  const small = await page.evaluate(() =>
    [...document.querySelectorAll("button, a.btn, .chip")].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.height < 30;
    }).length,
  );
  if (small) problems.push(`${small} touch targets under 30px tall on ${r}`);
}

// Keyboard: from Today, tab to the recommended action and start placement.
await page.goto(BASE + "/", { waitUntil: "networkidle" });
let reached = false;
for (let i = 0; i < 25 && !reached; i++) {
  await page.keyboard.press("Tab");
  reached = await page.evaluate(() => !!document.activeElement?.closest(".hero") && /Start|Resume/.test(document.activeElement.textContent ?? ""));
}
if (!reached) problems.push("keyboard: could not reach the recommended action");
else {
  await page.keyboard.press("Enter");
  await page.waitForURL(/placement/);
}

await browser.close();
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`Smoke test passed on ${routes.length} routes.`);
