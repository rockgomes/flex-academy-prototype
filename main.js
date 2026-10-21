/*
 * Flex Academy: concept landing page, motion prototype.
 * Plain JavaScript, no build step. Sections:
 *   1. Helpers
 *   2. Hero calendar (decorative, built from data)
 *   3. Hard truth: one day without and with a system
 *   4. Programmes on mobile: tabs and swipe
 *   4b. Theme toggle (light, dark, or follow the system)
 *   5. Path switch (Launch or Scale) and the agenda marker
 *   6. Sticky bar and scroll reveals
 *   7. Dialogs: webinar registration and strategy call booking
 *   8. Checklist form
 *
 * The markup built with innerHTML below comes only from the constant data in this file,
 * never from user input. Everything the visitor types is written with textContent.
 */

/* 1. Helpers ------------------------------------------------------------- */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const root = document.documentElement;
const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

/* 2. Hero calendar --------------------------------------------------------- */
const DAY_NAMES = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

$("#days").innerHTML = Array.from(
  { length: 13 },
  (_, c) =>
    `<div class="${c % 7 > 4 ? "we" : ""}" style="left:calc(var(--lw) + ${c}*var(--cw))"><small>${DAY_NAMES[c % 7]}</small>${c + 1}</div>`,
).join("");

// [unit, label, bars: [start column, end column, text, colour class]]
const UNITS = [
  [
    "Unit 01",
    "Yours · Launch",
    [
      [0, 2.5, "Find the unit", "g"],
      [2.5, 5, "Set it up", "g2"],
      [5, 7, "List it", "m"],
      [7, 10.5, "First guest", "g"],
      [10.5, 13.6, "Next guest", "m"],
    ],
  ],
  [
    "Unit 02",
    "Scale",
    [
      [3, 7, "Systems", "p"],
      [7, 13.6, "", "ghost"],
    ],
  ],
  [
    "Unit 03",
    "Scale",
    [
      [5, 9, "A team", "p"],
      [9, 13.6, "", "ghost alt"],
    ],
  ],
  [
    "Unit 04",
    "Scale",
    [
      [7, 11.5, "Base360", "p"],
      [11.5, 13.6, "", "ghost"],
    ],
  ],
  ["Unit 05", "Scale", [[9, 13.6, "", "ghost alt"]]],
  ["Unit 06", "Scale", [[11, 13.6, "", "ghost"]]],
];
const HOUSE_ICON =
  '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M1.5 8 9 1.5 16.5 8v8.5h-15z"/></svg>';

let barIndex = 0;
$("#rows").innerHTML = UNITS.map(([unit, label, bars], i) => {
  const sub = i
    ? '<span class="only-launch">Scale</span><span class="only-scale">Yours · Scale</span>'
    : label;
  const blocks = bars
    .map(
      ([from, to, text, tone]) =>
        `<span class="bar ${tone}" style="--c0:${from};--c1:${to};--i:${barIndex++}">${text}</span>`,
    )
    .join("");
  return `<div class="row ${i ? "next" : "mine"}"><span class="ico">${HOUSE_ICON}</span><span class="u">${unit}</span><span class="s">${sub}</span>${blocks}</div>`;
}).join("");

$("#cal").insertAdjacentHTML(
  "afterbegin",
  [5, 12].map((c) => `<div class="cal-we" style="left:calc(var(--lw) + ${c}*var(--cw))"></div>`).join(""),
);

$("#weeks").innerHTML = Array.from(
  { length: 12 },
  (_, i) => `<span class="${i % 4 === 3 ? "one" : ""}">W${i + 1}</span>`,
).join("");

/* 3. Hard truth -------------------------------------------------------------- */
const TONES = {
  s: ["var(--sand)", "var(--sand-d)"],
  m: ["var(--mint)", "var(--launch-text)"],
  p: ["var(--pt)", "var(--scale-text)"],
  n: ["var(--bg-sunken)", "var(--ink)"],
};
// Each event: [start, end, column, width, title, label, tone] without a system,
// then [start, end, unit column, title, label, tone] with a system.
const EVENTS = [
  [
    [8.5, 9.5, 0, 1, "Guest: where are the keys?", "UNIT 03", "s"],
    [8.5, 9.5, 2, "Check-in guide sent", "AUTOMATIC", "m"],
  ],
  [
    [9, 10.5, 1, 1, "Check-out", "UNIT 02", "m"],
    [9, 10, 1, "Check-out", "ON TIME", "m"],
  ],
  [
    [10, 11.5, 0, 1.4, "Cleaner is running late", "UNIT 02", "s"],
    [10.25, 11.5, 1, "Cleaner booked", "AUTOMATIC", "m"],
  ],
  [
    [10.5, 12, 2, 1, "Price update, 4 channels", "BY HAND", "n"],
    [10, 11, 2, "Prices synced", "ALL CHANNELS", "p"],
  ],
  [
    [12, 13, 0.6, 1.2, "Guest message", "UNIT 01", "p"],
    [12, 13, 0, "Reply drafted", "INBOX", "p"],
  ],
  [
    [12.5, 13.5, 1.9, 1.1, "Guest message", "UNIT 03", "p"],
    [12, 13, 2, "Reply drafted", "INBOX", "p"],
  ],
  [
    [13.5, 15, 0, 1, "Boiler repair", "UNIT 01", "s"],
    [13.5, 14.5, 0, "Repair assigned", "TICKET", "n"],
  ],
  [
    [14, 16, 1, 1, "Check-in", "UNIT 02", "m"],
    [14, 15.5, 1, "Check-in", "GUIDE SENT", "m"],
  ],
  [
    [14.5, 15.5, 1.7, 1.3, "Double booking?", "UNIT 03", "s"],
    [14, 15, 2, "Calendar in sync", "NO CLASH", "m"],
  ],
  [
    [16, 17, 0.3, 1.2, "Invoices and payouts", "SPREADSHEET", "n"],
    [16, 17, 0, "Payouts matched", "AUTOMATIC", "p"],
  ],
  [
    [16.5, 18, 2, 1, "Check-in", "UNIT 01", "m"],
    [17.1, 18, 0, "Check-in", "GUIDE SENT", "m"],
  ],
  [
    [17.2, 18, 0.9, 1, "Guest message", "UNIT 02", "p"],
    [16.5, 17.5, 1, "Reply drafted", "INBOX", "p"],
  ],
];

const hours = Array.from(
  { length: 11 },
  (_, h) => `<time style="top:calc(var(--hr)*${h})">${String(8 + h).padStart(2, "0")}:00</time>`,
).join("");
const events = EVENTS.map(([a, b], i) => {
  const vars = [
    `--t0:${a[0]}`,
    `--t1:${a[1]}`,
    `--c:${a[2]}`,
    `--w:${a[3]}`,
    `--bga:${TONES[a[6]][0]}`,
    `--fga:${TONES[a[6]][1]}`,
    `--t0b:${b[0]}`,
    `--t1b:${b[1]}`,
    `--cb:${b[2]}`,
    `--bgb:${TONES[b[5]][0]}`,
    `--fgb:${TONES[b[5]][1]}`,
    `--i:${i}`,
  ].join(";");
  return `<div class="evt" style="${vars}"><span class="a">${a[4]}<small>${a[5]}</small></span><span class="b">${b[3]}<small>${b[4]}</small></span></div>`;
}).join("");
$("#day").innerHTML =
  '<div class="units"><span>UNIT 01</span><span>UNIT 02</span><span>UNIT 03</span></div>' + hours + events;

// Scrolling switches the day from chaos to order. The toggle does the same by hand,
// and once the visitor uses the toggle, scrolling no longer changes it.
const dayPanel = $("#dayPanel");
const truthBox = $("#truthBox");
const pin = $(".pin");
const stateEl = $(".truth-state");
const mobileBar = $("#mbar");
let manualChoice = null;

function setSystem(on) {
  dayPanel.classList.toggle("sys", on);
  truthBox.classList.toggle("sys", on);
  $$(".seg button").forEach((b) => b.setAttribute("aria-pressed", String((b.dataset.sys === "1") === on)));
}

$(".seg").addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) return;
  manualChoice = button.dataset.sys === "1";
  setSystem(manualChoice);
});

function updateTruth() {
  const panelStyle = getComputedStyle(dayPanel);
  const panelSticky = panelStyle.position === "sticky";
  const panelRect = dayPanel.getBoundingClientRect();
  const offset = panelSticky ? panelRect.top - parseFloat(panelStyle.top) : 0;

  // Mobile pin: when the panel lets go at the end, the sentence above it leaves with it.
  const gone = Math.min(0, offset);
  stateEl.style.transform = gone < 0 ? `translateY(${gone}px)` : "";
  // The bottom bar steps aside while the day panel is pinned, so the whole day stays visible.
  mobileBar.classList.toggle("tuck", panelSticky && Math.abs(offset) < 1);

  if (manualChoice !== null) return;
  let on;
  if (getComputedStyle(truthBox).position === "sticky") {
    const r = pin.getBoundingClientRect();
    on = -r.top > (r.height - innerHeight) * 0.38;
  } else if (panelSticky) {
    const travel = innerHeight * 0.6;
    const done =
      parseFloat(panelStyle.top) + dayPanel.offsetHeight + travel - truthBox.getBoundingClientRect().bottom;
    on = done > travel * 0.38;
  } else {
    on = panelRect.top + panelRect.height / 2 < innerHeight * 0.42;
  }
  if (on !== dayPanel.classList.contains("sys")) setSystem(on);
}

// Measure at most once per frame, however many scroll events arrive.
let frameQueued = false;
function onScroll() {
  if (frameQueued) return;
  frameQueued = true;
  requestAnimationFrame(() => {
    frameQueued = false;
    updateTruth();
  });
}

function measurePin() {
  truthBox.style.setProperty("--ph", dayPanel.offsetHeight + "px");
  truthBox.style.setProperty("--sh", stateEl.offsetHeight + "px");
}
measurePin();
addEventListener("resize", () => {
  measurePin();
  onScroll();
});
addEventListener("scroll", onScroll, { passive: true });

/* 4. Programmes on mobile ------------------------------------------------- */
const cardsEl = $("#cards");
const programmeTabs = $$(".ptabs button");

function showTab(i) {
  programmeTabs.forEach((b, k) => b.setAttribute("aria-pressed", String(k === i)));
  $$(".pdots i").forEach((dot, k) => dot.classList.toggle("on", k === i));
  $("#phintName").textContent = i ? "Launch" : "Scale";
}

function goToTab(i) {
  const card = cardsEl.children[i];
  cardsEl.scrollTo({
    left: card.offsetLeft - cardsEl.children[0].offsetLeft,
    behavior: reducedMotion() ? "auto" : "smooth",
  });
  showTab(i);
}

programmeTabs.forEach((b, i) => b.addEventListener("click", () => goToTab(i)));
cardsEl.addEventListener(
  "scroll",
  () => {
    const step = cardsEl.children[1].offsetLeft - cardsEl.children[0].offsetLeft;
    if (step > 0) showTab(Math.round(cardsEl.scrollLeft / step));
  },
  { passive: true },
);

/* 4b. Theme ----------------------------------------------------------------- */
// The page follows the system theme until the visitor presses the toggle.
const darkQuery = matchMedia("(prefers-color-scheme: dark)");
const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : darkQuery.matches);
function syncThemeButtons() {
  const dark = isDark();
  $$(".theme").forEach((b) => b.setAttribute("aria-pressed", String(dark)));
}
$$(".theme").forEach((b) =>
  b.addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("fa-theme", next);
    } catch {
      // Storage can be blocked. The theme still changes for this visit.
    }
    syncThemeButtons();
  }),
);
darkQuery.addEventListener("change", syncThemeButtons);
syncThemeButtons();

/* 5. Path switch ----------------------------------------------------------- */
function setPath(path) {
  root.dataset.path = path;
  $$(".switch button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.set === path)));
  requestAnimationFrame(placeMarker);
  try {
    localStorage.setItem("fa-path", path);
  } catch {
    // Storage can be blocked (private mode). The switch still works for this visit.
  }
}

// The phone agenda shows a "You are here" marker above the chosen path.
function placeMarker() {
  const marker = $("#marker");
  const label = $(`.agenda [data-marker="${root.dataset.path}"]`);
  if (marker && label && label.offsetParent) {
    marker.style.setProperty("--marker-top", label.offsetTop - 28 + "px");
  }
}
addEventListener("resize", placeMarker);
addEventListener("load", placeMarker);

try {
  if (localStorage.getItem("fa-path") === "scale") setPath("scale");
} catch {
  // Ignore blocked storage.
}
placeMarker();

// One listener for every path switch, dialog opener and close button on the page.
document.addEventListener("click", (e) => {
  const switcher = e.target.closest("[data-set]");
  if (switcher) {
    setPath(switcher.dataset.set);
    return;
  }
  const opener = e.target.closest("[data-open]");
  if (opener) {
    openDialog(opener.dataset.open);
    return;
  }
  const closer = e.target.closest("[data-close]");
  if (closer) closer.closest("dialog").close();
});

// Start the hero entrance once the first frame is painted.
setTimeout(() => root.classList.add("loaded"), 80);

/* 6. Sticky bar and reveals ------------------------------------------------ */
const sticky = $("#sticky");
new IntersectionObserver(
  ([entry]) => {
    const visible = !entry.isIntersecting;
    sticky.classList.toggle("show", visible);
    sticky.setAttribute("aria-hidden", String(!visible));
    $$("a, button", sticky).forEach((el) => (el.tabIndex = visible ? 0 : -1));
  },
  { rootMargin: "-120px 0px 0px 0px" },
).observe($(".hero"));

const revealer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      revealer.unobserve(entry.target);
    }),
  { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
);
$$("[data-reveal], [data-watch]").forEach((el) => revealer.observe(el));

/* 7. Dialogs ------------------------------------------------------------------ */
function openDialog(kind) {
  const dialog = $("#dlg-" + kind);
  if (kind === "scale") {
    showStep("s1");
    $("#ds-sub").textContent = "20 to 30 min · free · step 1 of 3";
    $("#units-msg").classList.remove("show");
  }
  dialog.showModal();
}

// A click on the backdrop closes the dialog.
$$("dialog").forEach((dialog) =>
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  }),
);

// The prototype has no calendar files, so the buttons only confirm the choice.
$$(".addcal button").forEach((button) =>
  button.addEventListener("click", () => {
    button.textContent = `✓ ${button.textContent.replace(/^✓ /, "")}`;
    button.setAttribute("aria-pressed", "true");
  }),
);

// Webinar registration
const launchForm = $("#launchForm");
launchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = $("#le");
  const invalid = !isEmail(email.value);
  email.classList.toggle("bad", invalid);
  email.setAttribute("aria-invalid", String(invalid));
  $("#le-msg").classList.toggle("show", invalid);
  if (invalid) {
    email.focus();
    return;
  }
  const button = $("#launchBtn");
  button.disabled = true;
  button.textContent = "Reserving your seat…";
  setTimeout(() => {
    const firstName = $("#ln").value.trim().split(" ")[0];
    $("#launchHi").textContent = firstName ? `You are in, ${firstName}.` : "You are in.";
    launchForm.hidden = true;
    $("#launchDone").hidden = false;
    $("#launchHi").focus();
    button.disabled = false;
    button.textContent = "Reserve my seat";
    $("#event").classList.add("done");
    $("#evfoot").textContent = "✓ Your seat is reserved. It is on your calendar.";
  }, 900);
});
$("#dlg-launch").addEventListener("close", () => {
  launchForm.hidden = false;
  $("#launchDone").hidden = true;
});

// Strategy call booking: qualify, pick a time, confirm
const answers = {};
$$(".chips").forEach((group) =>
  group.addEventListener("click", (e) => {
    const chip = e.target.closest("button");
    if (!chip) return;
    $$("button", group).forEach((b) => b.setAttribute("aria-pressed", String(b === chip)));
    answers[group.dataset.q] = chip.textContent;
    if (group.dataset.q === "units") {
      $("#units-msg").classList.remove("show");
      // Visitors with no units are offered the webinar instead. They can still book.
      $("#route").classList.toggle("show", chip.textContent === "None yet");
    }
  }),
);

function showStep(id) {
  ["s1", "s2", "s3"].forEach((step) => ($("#" + step).hidden = step !== id));
}

$("#toSlots").addEventListener("click", () => {
  if (!answers.units) {
    $("#units-msg").classList.add("show");
    $('[data-q="units"] button').focus();
    return;
  }
  showStep("s2");
  $("#ds-sub").textContent = "Shown in your time zone · step 2 of 3";
  $("#s2 .chips button").focus();
});

function unitsText(answer) {
  if (!answer) return "";
  if (answer === "None yet") return "no units yet";
  return answer === "1" ? "1 unit" : `${answer} units`;
}

$("#toDone").addEventListener("click", () => {
  showStep("s3");
  $("#ds-sub").textContent = "Booked · step 3 of 3";
  const told = [
    unitsText(answers.units),
    answers.target && `target ${answers.target}`,
    $("#sc-city").value.trim(),
  ]
    .filter(Boolean)
    .join(" · ");
  const rows = [
    ["When", `${answers.day || "[day]"}, ${answers.time || "[time]"} in your time zone`],
    ["How long", "20 to 30 minutes, video call"],
    ["With", "The Flex Academy team"],
    ["You told us", told || "No answers yet"],
  ];
  // Built with textContent: the city field is visitor input.
  const summary = $("#kv");
  summary.replaceChildren(
    ...rows.map(([term, detail]) => {
      const row = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = term;
      dd.textContent = detail;
      row.append(dt, dd);
      return row;
    }),
  );
  $("#scaleHi").focus();
});

$("#toWebinar").addEventListener("click", () => {
  $("#dlg-scale").close();
  setPath("launch");
  openDialog("launch");
});

/* 8. Checklist form ---------------------------------------------------------- */
$("#checkForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = $("#ce");
  const invalid = !isEmail(email.value);
  email.classList.toggle("bad", invalid);
  email.setAttribute("aria-invalid", String(invalid));
  $("#checkMsg").classList.toggle("show", invalid);
  if (invalid) {
    email.focus();
    return;
  }
  const button = e.target.querySelector('button[type="submit"]');
  button.textContent = "✓ Sent";
  button.disabled = true;
  const ok = $("#checkOk");
  ok.textContent = $("#cw").checked
    ? "Prototype: nothing was sent. In the real page, the checklist arrives by email and you join the waitlist."
    : "Prototype: nothing was sent. In the real page, the checklist arrives by email.";
  ok.classList.add("show");
});
