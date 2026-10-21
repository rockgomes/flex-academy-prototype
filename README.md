# Flex Academy: concept landing page

A concept landing page and motion prototype for **Flex Academy**, an imagined school for short-term rental operators from the founders of The Flex and Base360.

**Live:** https://flex-academy-prototype.netlify.app

> **Concept project.** This is a design exercise by Rock Gomes. It is not affiliated with The Flex, Base360 or any real Flex Academy. The forms do not send any data. Prices (X, Y) and dates are placeholders.

## What it shows

- **A path switch** for two audiences: people starting out (free webinar) and operators with a few units (strategy call). The headline, calendar, buttons and colours follow the chosen path.
- **A hero calendar** that builds itself on load and moves the "You are here" marker when the path changes.
- **"The hard truth":** one day across three units, without a system and with one. Scrolling switches it, and so does the toggle.
- **Both booking flows** in native `<dialog>` elements: webinar registration, and a three-step strategy call with qualifying questions. Visitors with no units are offered the webinar instead.
- **Mobile-specific patterns:** a pinned day view, programme tabs with swipe, and a bottom action bar.

## How it is built

Plain HTML, CSS and JavaScript. No framework and no build step.

| File | What it holds |
|---|---|
| `index.html` | Content and structure |
| `styles.css` | Design tokens (CSS custom properties), layout, motion, responsive rules |
| `main.js` | Calendar and day view built from data, path switch, scroll behaviour, dialogs, forms |

Decisions worth knowing:

- **Accessibility:** native dialogs (focus trap and Esc), `aria-pressed` toggles, labelled fields, a skip link, visible focus, and WCAG AA contrast checked by axe in CI.
- **Reduced motion:** every animation has a still fallback under `prefers-reduced-motion`.
- **Safe input:** anything a visitor types is written with `textContent`, never as HTML. A test tries to inject markup.
- **Performance:** scroll work runs at most once per frame; images have fixed sizes and lazy loading.

## Run it

```bash
python3 -m http.server 8765
```

Then open http://localhost:8765.

## Test

```bash
npm ci
npx playwright install chromium
npm test
```

`npm test` runs three checks, also on every push and pull request in CI:

1. **Static:** house rules on the source (no inline styling, no `#` links, image sizes, no placeholders).
2. **HTML:** `html-validate` on `index.html`.
3. **Browser:** Playwright and axe. No console errors, no sideways scroll from 320 to 1920 px, no WCAG 2.1 AA violations, and the booking flows work.

## Deploy

Netlify serves the repository root (see `netlify.toml`). Every pull request gets a deploy preview, and a merge to `main` deploys the site. `npm run og` regenerates the share image.

## Credits

Interior photo: theflex.global. Founder portraits: base360.ai, pixelated on purpose. Facts about The Flex and Base360 come from their public websites.
