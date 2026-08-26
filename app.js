/* ============================================================
   Juab County Water Values — front-end behavior
   - Animates the supply/demand column on load
   - Counts up stat cards + fills bars when scrolled into view
   - Loads results from data/results.json when present, so the
     PI team can update numbers without touching HTML.
   ============================================================ */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 1. Hero supply/demand column ---- */
  function animateSupply() {
    const fill = document.getElementById("waterFill");
    const newSupply = document.getElementById("newSupply");
    if (!fill) return;
    // "today" fills ~52%, new Highline supply adds a gold band above it
    const base = 52;      // % supply today
    const added = 20;     // % added by Highline Canal
    if (reduceMotion) {
      fill.style.height = base + "%";
      newSupply.style.height = added + "%";
      return;
    }
    requestAnimationFrame(() => {
      fill.style.height = base + "%";
      newSupply.style.height = added + "%";
    });
  }

  /* ---- 2. Count-up + bar fill on scroll ---- */
  function countUp(el, target) {
    if (reduceMotion || target === 0) { el.textContent = target; return; }
    const dur = 1200, start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.count !== undefined) {
        countUp(el, parseInt(el.dataset.count, 10) || 0);
      }
      io.unobserve(el);
    });
  }, { threshold: 0.4 });

  document.querySelectorAll("[data-count]").forEach((el) => io.observe(el));

  /* ---- 3. Load results data if available ---- */
  async function loadResults() {
    try {
      const res = await fetch("data/results.json", { cache: "no-store" });
      if (!res.ok) return; // no data yet: placeholders stay
      const data = await res.json();
      applyResults(data);
    } catch (e) {
      /* silent: placeholders remain until first survey closes */
    }
  }

  function applyResults(d) {
    // stat cards
    if (Array.isArray(d.stats)) {
      const nums = document.querySelectorAll(".stat-num");
      d.stats.forEach((v, i) => { if (nums[i]) nums[i].dataset.count = v; });
      // re-trigger any already-visible
      nums.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) countUp(el, parseInt(el.dataset.count, 10) || 0);
      });
    }
    // bar lists (concerns, segments) — array of {label, value}
    fillBars("concerns", d.concerns);
    fillBars("segments", d.segments);

    // donut (A4: enough water in 20 years?) — {agree, neither, disagree} percentages
    if (d.water20yr || d.growth) {
      const g = d.water20yr || d.growth;
      const donut = document.getElementById("donut");
      if (donut) {
        const a = g.agree || 0, b = g.neither || 0;
        donut.style.background =
          `conic-gradient(var(--blue) 0 ${a}%, var(--green) ${a}% ${a + b}%, var(--navy) ${a + b}% 100%)`;
        const hole = donut.querySelector(".donut-hole");
        if (hole) hole.innerHTML = `<span><strong>${a}%</strong><br>agree</span>`;
      }
    }
  }

  function fillBars(id, arr) {
    if (!Array.isArray(arr)) return;
    const ul = document.getElementById(id);
    if (!ul) return;
    const items = ul.querySelectorAll("li");
    arr.forEach((row, i) => {
      const li = items[i];
      if (!li) return;
      const fill = li.querySelector(".bl-fill");
      const val = li.querySelector(".bl-val");
      const label = li.querySelector(".bl-label");
      if (label && row.label) label.textContent = row.label;
      if (fill) fill.style.setProperty("--v", (row.value || 0) + "%");
      if (val) val.textContent = (row.value || 0) + "%";
    });
    const note = ul.parentElement.querySelector(".panel-note");
    if (note) note.remove();
  }

  /* ---- 4. Survey button stubs (wire to ESRI Survey123 URLs) ---- */
  document.querySelectorAll("[data-survey]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const kind = btn.dataset.survey;
      // Replace these with real Survey123 links / invite flow when live:
      const urls = {
        public: "", // e.g. "https://survey123.arcgis.com/share/PUBLIC_ID"
        invite: ""  // invite-model handled by email magic-link
      };
      if (urls[kind]) {
        window.open(urls[kind], "_blank", "noopener");
      } else {
        alert(kind === "public"
          ? "The community survey link will appear here once the survey window opens."
          : "To request an invited survey link, contact the project team at jputzke@sunrise-eng.com.");
      }
    });
  });

  /* ---- init ---- */
  animateSupply();
  loadResults();
})();
