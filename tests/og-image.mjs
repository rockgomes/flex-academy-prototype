// Makes og.png, the 1200 x 630 share image, from the hero. Run with: npm run og
import { chromium } from "playwright";
import { serve } from "./server.mjs";

const { url, server } = await serve();
const browser = await chromium.launch();
// Render the desktop layout (1440 px) and scale it to 1200 x 630.
const page = await browser.newPage({ viewport: { width: 1440, height: 756 }, deviceScaleFactor: 1200 / 1440 });
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(4500); // let the hero entrance finish
await page.screenshot({ path: "og.png" });
await browser.close();
server.close();
console.log("Wrote og.png");
