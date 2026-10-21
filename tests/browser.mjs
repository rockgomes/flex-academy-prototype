// Browser checks with Playwright and axe. Run with: npm run test:browser
// 1. No console errors.
// 2. No sideways scroll from 320 to 1920 px.
// 3. No WCAG 2.1 A or AA violations found by axe, on a phone and on a desktop, in light and dark.
// 4. The theme toggle switches to dark, and the choice survives a reload.
// 5. The booking flows work, and visitor input is shown as text, never run as HTML.
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { serve } from "./server.mjs";

const { url, server } = await serve();
const browser = await chromium.launch();
const errors = [];
const fail = (message) => errors.push(message);

async function openPage(width, height = 900, colorScheme = "light") {
  // Reduced motion shows every section at rest, so axe sees the final colours.
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: "reduce",
    colorScheme,
  });
  const page = await context.newPage();
  page.on("console", (msg) => {
    // The fonts are blocked on purpose below, so their load errors are expected.
    if (msg.type() === "error" && !/fonts\.(googleapis|gstatic)\.com/.test(msg.location().url)) {
      fail(`console error at ${width}px: ${msg.text()}`);
    }
  });
  page.on("pageerror", (err) => fail(`page error at ${width}px: ${err.message}`));
  // Fonts come from Google: block them so the test does not depend on the network.
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
  await page.goto(url, { waitUntil: "load" });
  return { page, context };
}

// 1 and 2: every width
for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  const { page, context } = await openPage(width);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  if (overflow > 0) fail(`sideways scroll of ${overflow}px at ${width}px`);
  await context.close();
}

// 3: accessibility, light and dark (dark comes from the system setting)
for (const [width, scheme] of [
  [390, "light"],
  [1440, "light"],
  [390, "dark"],
  [1440, "dark"],
]) {
  const { page, context } = await openPage(width, 900, scheme);
  await page.evaluate(() =>
    document.querySelectorAll("[data-reveal],[data-watch]").forEach((el) => el.classList.add("in")),
  );
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  for (const v of result.violations) {
    fail(`axe at ${width}px ${scheme}: ${v.id} (${v.impact}), ${v.nodes.length} element(s): ${v.help}`);
  }
  await context.close();
}

// 4: theme toggle
{
  const { page, context } = await openPage(1440);
  const bg = () =>
    page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--bg-page"));
  const light = await bg();
  await page.locator("#top .theme").click();
  if ((await page.getAttribute("#top .theme", "aria-pressed")) !== "true") fail("theme: toggle not pressed");
  if ((await bg()) === light) fail("theme: page tokens did not change");
  await page.reload();
  if ((await page.getAttribute("html", "data-theme")) !== "dark") fail("theme: choice not kept after reload");
  await context.close();
}

// 5: flows
{
  const { page, context } = await openPage(1440);

  // Webinar: a bad email shows the error, a good one shows the confirmation.
  await page.getByRole("button", { name: "Free webinar", exact: true }).click();
  await page.fill("#ln", "Sam Taylor");
  await page.fill("#le", "sam@email");
  await page.click("#launchBtn");
  if (!(await page.isVisible("#le-msg"))) fail("webinar: no error for an incomplete email");
  await page.fill("#le", "sam@email.com");
  await page.click("#launchBtn");
  await page.waitForSelector("#launchDone:not([hidden])");
  if ((await page.textContent("#launchHi")) !== "You are in, Sam.") fail("webinar: wrong confirmation title");
  await page.keyboard.press("Escape");

  // Strategy call: the units question is required, and the city is shown as text.
  await page.locator("#top .switch").getByRole("button", { name: "I run units" }).click();
  await page.getByRole("button", { name: "Strategy call", exact: true }).click();
  await page.click("#toSlots");
  if (!(await page.isVisible("#units-msg"))) fail("call: no message when units are missing");
  await page.click('[data-q="units"] >> text="1"');
  const payload = '<img src=x onerror="window.__xss=1">';
  await page.fill("#sc-city", payload);
  await page.click("#toSlots");
  await page.click("#toDone");
  const summary = await page.textContent("#kv");
  if (!summary.includes(payload)) fail("call: the city is not shown as typed");
  if (!summary.includes("1 unit ·")) fail('call: summary should say "1 unit"');
  if (await page.evaluate(() => window.__xss)) fail("call: visitor input was run as HTML");

  await context.close();
}

await browser.close();
server.close();

if (errors.length) {
  console.error("FAILED\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log(
  "Browser checks passed: no console errors, no sideways scroll, no axe violations in light or dark, theme toggle works, flows work",
);
