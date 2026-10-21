// Static checks on the source files. Run with: npm run test:static
import { readFileSync, existsSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const css = readFileSync("styles.css", "utf8");
const js = readFileSync("main.js", "utf8");
const all = [html, css, js].join("\n");
const errors = [];
const check = (ok, message) => {
  if (!ok) errors.push(message);
};

// Every local image exists and has alt text and a size (so the layout does not jump).
for (const [tag] of html.matchAll(/<img[^>]*>/g)) {
  const src = tag.match(/\ssrc="([^"]+)"/)?.[1];
  if (src && !/^https?:/.test(src)) check(existsSync(src), `missing image: ${src}`);
  check(/\salt="[^"]+"/.test(tag), `image without alt: ${src}`);
  check(/\swidth="\d+"/.test(tag) && /\sheight="\d+"/.test(tag), `image without width and height: ${src}`);
}

// Every in-page link has a target, and no link points to "#" only.
for (const [, id] of html.matchAll(/href="#([a-z][\w-]*)"/g)) {
  check(html.includes(`id="${id}"`), `missing anchor target: #${id}`);
}
check(!/href="#"/.test(html), 'a link points to "#": use a button for actions');

// Inline style attributes may only set CSS variables (data), never real styling.
for (const [, style] of html.matchAll(/\sstyle="([^"]*)"/g)) {
  const declarations = style
    .split(";")
    .map((d) => d.trim())
    .filter(Boolean);
  check(
    declarations.every((d) => d.startsWith("--")),
    `inline style that is not a CSS variable: style="${style}"`,
  );
}

// Visitor input is never written as HTML.
check(!/\.value[^;\n]*innerHTML|innerHTML[^;\n]*\.value/.test(js), "form input is written with innerHTML");

// House rules
check(!/[—–]/.test(all), "em dash or en dash found");
check(!/Placeholder answer/.test(html), "a FAQ answer is still a placeholder");
check(css.includes("prefers-reduced-motion"), "no reduced-motion fallback");
check(css.includes(":focus-visible"), "no focus-visible style");
check(/select\.field\s*\{[^}]*appearance:\s*none/.test(css), "select field uses the native arrow");
check(!/localhost/.test(all), "localhost reference found");
check(/<html lang="en"/.test(html), "html lang is missing");
check(/<meta name="robots" content="noindex"/.test(html), "noindex meta is missing");
check(/class="concept"/.test(html) && /Not affiliated/.test(html), "the concept banner is missing");
check(/<meta property="og:image"/.test(html), "share image is missing");

if (errors.length) {
  console.error("FAILED\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log("Static checks passed");
