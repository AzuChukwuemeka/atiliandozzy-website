/* =========================================================
   ATILIANDOZZY GLOBAL NIG LTD — script.js

   EDIT ONLY THE TWO ARRAYS BELOW TO ADD CONTENT.
   - Add a service  -> push an object into `services`
   - Add a project  -> push an object into `projects`
   Everything else renders itself.
   ========================================================= */

/* ---------- 1. SERVICES DATA ---------- */
const services = [
  {
    title: "Wrought Iron Gates",
    description: "Custom designed and fabricated entrance gates, sliding gates and pedestrian gates, finished and installed on site.",
    image: "images/services/gates.jpeg"
  },
  {
    title: "Staircases & Rails",
    description: "Interior and exterior staircases, handrails and balustrades built to fit the exact run of your space.",
    image: "images/services/stairs.jpg"
  },
  {
    title: "Carports",
    description: "Steel carport structures engineered for span, drainage and a clean finish that suits the building.",
    image: "images/services/carports.jpeg"
  },
  {
    title: "Tank Stands",
    description: "Load-rated steel tank stands fabricated for stability, height requirements and long service life.",
    image: "images/services/tank-stands.jpg"
  },
  {
    title: "Glass Balustrades",
    description: "Frameless and framed glass balustrades combining steel fixings with clean, modern glazing.",
    image: "images/services/glass.jpeg"
  }
];

/* ---------- 2. PROJECTS DATA ----------
   `category` must match one of the keys in CATEGORIES below. */
const projects = [
  { title: "Modern Wrought Iron Gate", category: "gates",  image: "images/projects/gate-01.jpg",   description: "Custom fabricated wrought iron entrance gate." },
  { title: "Double Swing Entrance Gate", category: "gates", image: "images/projects/gate-02.jpg",   description: "Twin-leaf gate with decorative ironwork panels." },
  { title: "Sliding Compound Gate", category: "gates",     image: "images/projects/gate-03.jpg",   description: "Heavy-duty sliding gate on a rolling track." },
  { title: "Modern Staircase Rails", category: "stairs",   image: "images/projects/stairs-01.jpg", description: "Custom staircase railing design and installation." },
  { title: "Interior Balustrade", category: "stairs",      image: "images/projects/stairs-02.jpg", description: "Steel balustrade fitted to an internal staircase." },
  { title: "Residential Carport", category: "carports",    image: "images/projects/carport-01.jpg",description: "Steel carport structure with roofing sheets." },
  { title: "Steel Tank Stand", category: "tanks",          image: "images/projects/tank-01.jpg",   description: "Elevated steel tank stand fabrication." },
  { title: "Structural Steel Frame", category: "steel",    image: "images/projects/steel-01.jpg",  description: "Fabricated steel framework for a commercial build." },
  { title: "Frameless Glass Balustrade", category: "glass",image: "images/projects/glass-01.jpg",  description: "Frameless glass balustrade with steel fixings." },
  { title: "Custom Metal Work", category: "other",         image: "images/projects/other-01.jpg",  description: "Bespoke fabrication for a client's design." }
];

/* ---------- 3. CATEGORIES ---------- */
const CATEGORIES = [
  { key: "all",      label: "All" },
  { key: "gates",    label: "Gates" },
  { key: "stairs",   label: "Stairs & Rails" },
  { key: "carports", label: "Carports" },
  { key: "tanks",    label: "Tank Stands" },
  { key: "steel",    label: "Steel Structures" },
  { key: "glass",    label: "Glass" },
  { key: "other",    label: "Other" }
];

/* =========================================================
   Below this line is rendering logic — no content to edit.
   ========================================================= */

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ---------- Photo-slot fallback ----------
   Until real photography is dropped into /images, frames show a
   labelled slot instead of a broken image. */
function watchImage(img, slotLabel) {
  const frame = img.closest(".frame");
  const markEmpty = () => { if (frame) frame.classList.add("is-empty"); };
  const markFilled = () => { if (frame) frame.classList.remove("is-empty"); };

  if (frame && slotLabel) frame.dataset.slot = slotLabel;

  if (!img.dataset.watched) {
    img.dataset.watched = "1";
    img.addEventListener("error", markEmpty);
    img.addEventListener("load", markFilled);
  }

  if (img.complete) {
    img.naturalWidth ? markFilled() : markEmpty();
  }
}

function initStaticImages() {
  $$(".frame img").forEach(img => watchImage(img));

  // Logos sit outside .frame — hide them cleanly if absent.
  $$("img[data-fallback]").forEach(img => {
    const hide = () => { img.hidden = true; };
    if (img.complete && !img.naturalWidth) hide();
    img.addEventListener("error", hide);
  });
}

/* ---------- Navigation ---------- */
function initNav() {
  const nav = $("#nav");
  const toggle = $("#navToggle");
  const links = $("#navLinks");

  const setStuck = () => nav.classList.toggle("is-stuck", window.scrollY > 24);
  setStuck();
  window.addEventListener("scroll", setStuck, { passive: true });

  const closeMenu = () => {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("is-locked");
  };

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("is-locked", open);
  });

  $$("a", links).forEach(a => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && links.classList.contains("is-open")) {
      closeMenu();
      toggle.focus();
    }
  });

  // Active section highlighting
  const navAnchors = $$('a[href^="#"]', links).filter(a => a.getAttribute("href").length > 1);
  const sections = navAnchors
    .map(a => document.getElementById(a.getAttribute("href").slice(1)))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach(a =>
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id)
        );
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(s => spy.observe(s));
  }
}

/* ---------- Services ---------- */
function renderServices() {
  const grid = $("#servicesGrid");
  if (!grid) return;

  grid.innerHTML = "";
  services.forEach(service => {
    const card = document.createElement("a");
    card.className = "service";
    card.href = "#quote";

    const frame = document.createElement("div");
    frame.className = "frame";
    frame.dataset.slot = service.title;

    const img = document.createElement("img");
    img.src = service.image;
    img.alt = service.title + " fabricated by Atiliandozzy Global";
    img.loading = "lazy";
    img.decoding = "async";
    frame.appendChild(img);

    const body = document.createElement("div");
    body.className = "service__body";
    body.innerHTML =
      '<span class="service__rule"></span>' +
      '<h3 class="service__title"></h3>' +
      '<p class="service__desc"></p>';
    $(".service__title", body).textContent = service.title;
    $(".service__desc", body).textContent = service.description;

    card.append(frame, body);
    grid.appendChild(card);
    watchImage(img, service.title);
  });
}

/* ---------- Projects gallery ---------- */
let visibleProjects = [];
const SPAN_PATTERN = ["2", "1", "1", "1", "1", "2", "1", "1"];

function categoryLabel(key) {
  const found = CATEGORIES.find(c => c.key === key);
  return found ? found.label : key;
}

function renderFilters() {
  const bar = $("#projectFilters");
  if (!bar) return;

  const used = new Set(projects.map(p => p.category));
  bar.innerHTML = "";

  CATEGORIES.filter(c => c.key === "all" || used.has(c.key)).forEach((cat, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filter" + (i === 0 ? " is-active" : "");
    btn.dataset.category = cat.key;
    btn.textContent = cat.label;
    btn.setAttribute("aria-pressed", i === 0 ? "true" : "false");
    btn.addEventListener("click", () => {
      $$(".filter", bar).forEach(b => {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      renderGallery(cat.key);
    });
    bar.appendChild(btn);
  });
}

function renderGallery(category = "all") {
  const grid = $("#projectGrid");
  const empty = $("#galleryEmpty");
  if (!grid) return;

  visibleProjects = category === "all"
    ? projects.slice()
    : projects.filter(p => p.category === category);

  grid.innerHTML = "";
  empty.hidden = visibleProjects.length > 0;

  visibleProjects.forEach((project, i) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "tile";
    tile.dataset.span = SPAN_PATTERN[i % SPAN_PATTERN.length];
    tile.dataset.index = String(i);
    tile.setAttribute("aria-label", "Open " + project.title);

    const frame = document.createElement("div");
    frame.className = "frame";
    frame.dataset.slot = project.title;

    const img = document.createElement("img");
    img.src = project.image;
    img.alt = project.title + " — " + project.description;
    img.loading = "lazy";
    img.decoding = "async";
    frame.appendChild(img);

    const label = document.createElement("span");
    label.className = "tile__label";
    label.innerHTML = '<span class="tile__title"></span><span class="tile__cat"></span>';
    $(".tile__title", label).textContent = project.title;
    $(".tile__cat", label).textContent = categoryLabel(project.category);

    tile.append(frame, label);
    tile.addEventListener("click", () => openLightbox(i));
    grid.appendChild(tile);
    watchImage(img, project.title);
  });
}

/* ---------- Lightbox ---------- */
let lbIndex = 0;
let lastFocused = null;

function fillLightbox(index) {
  const project = visibleProjects[index];
  if (!project) return;
  lbIndex = index;

  const img = $("#lbImage");
  const frame = $("#lbFrame");
  frame.dataset.slot = project.title;
  frame.classList.remove("is-empty");
  img.src = project.image;
  img.alt = project.title + " — " + project.description;
  watchImage(img, project.title);

  $("#lbCategory").textContent = categoryLabel(project.category);
  $("#lbTitle").textContent = project.title;
  $("#lbDesc").textContent = project.description;

  const multiple = visibleProjects.length > 1;
  $("#lbPrev").hidden = !multiple;
  $("#lbNext").hidden = !multiple;
}

function openLightbox(index) {
  const box = $("#lightbox");
  lastFocused = document.activeElement;
  fillLightbox(index);
  box.hidden = false;
  document.body.classList.add("is-locked");
  requestAnimationFrame(() => box.classList.add("is-open"));
  $("#lbClose").focus();
}

function closeLightbox() {
  const box = $("#lightbox");
  box.classList.remove("is-open");
  document.body.classList.remove("is-locked");
  window.setTimeout(() => { box.hidden = true; }, 250);
  if (lastFocused) lastFocused.focus();
}

function stepLightbox(dir) {
  const total = visibleProjects.length;
  if (!total) return;
  fillLightbox((lbIndex + dir + total) % total);
}

function initLightbox() {
  const box = $("#lightbox");
  $("#lbClose").addEventListener("click", closeLightbox);
  $("#lbPrev").addEventListener("click", () => stepLightbox(-1));
  $("#lbNext").addEventListener("click", () => stepLightbox(1));
  box.addEventListener("click", e => { if (e.target === box) closeLightbox(); });

  document.addEventListener("keydown", e => {
    if (box.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
    if (e.key === "Tab") {
      const focusables = $$("button:not([hidden])", box);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Swipe on touch devices
  let startX = null;
  box.addEventListener("touchstart", e => { startX = e.changedTouches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 60) stepLightbox(dx < 0 ? 1 : -1);
    startX = null;
  }, { passive: true });
}

/* ---------- Quote form -> WhatsApp ---------- */
const WHATSAPP_NUMBER = "2347080003515";

function initQuoteForm() {
  const form = $("#quoteForm");
  if (!form) return;
  const error = $("#formError");

  form.addEventListener("submit", e => {
    e.preventDefault();

    const data = {
      name:     form.name.value.trim(),
      phone:    form.phone.value.trim(),
      email:    form.email.value.trim(),
      type:     form.type.value,
      location: form.location.value.trim(),
      details:  form.details.value.trim()
    };

    const required = [["name", "name"], ["phone", "phone"], ["type", "type"], ["location", "location"]];
    let firstInvalid = null;
    required.forEach(([field]) => {
      const el = form[field];
      const bad = !data[field];
      el.closest(".field").classList.toggle("has-error", bad);
      if (bad && !firstInvalid) firstInvalid = el;
    });

    if (firstInvalid) {
      error.hidden = false;
      error.textContent = "Add your name, phone number, project type and location so we can quote accurately.";
      firstInvalid.focus();
      return;
    }
    error.hidden = true;

    const lines = [
      "New quote request — Atiliandozzy Global Nig Ltd",
      "",
      "Name: " + data.name,
      "Phone: " + data.phone,
      data.email ? "Email: " + data.email : null,
      "Project type: " + data.type,
      "Location: " + data.location,
      data.details ? "" : null,
      data.details ? "Details: " + data.details : null
    ].filter(l => l !== null);

    const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
    window.open(url, "_blank", "noopener");
  });

  $$("input, select, textarea", form).forEach(el => {
    el.addEventListener("input", () => el.closest(".field").classList.remove("has-error"));
  });
}

/* ---------- Reveal on scroll (single, quiet fade) ---------- */
function initReveal() {
  const targets = $$(".section-head, .intro__copy, .intro__stack, .about__grid > *, .quote__grid > *, .contact__grid > *, .location__grid > *");
  if (!("IntersectionObserver" in window)) return;

  targets.forEach(el => el.classList.add("reveal"));
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  targets.forEach(el => io.observe(el));
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initStaticImages();
  renderServices();
  renderFilters();
  renderGallery("all");
  initNav();
  initLightbox();
  initQuoteForm();
  initReveal();
});
