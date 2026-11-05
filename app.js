/* Aaquist & Hvam SEO/GEO teardown dossier — shared behaviour.
   Business name is ONE swappable constant. */
const BUSINESS_NAME = "Tømrerfirmaet Aaquist & Hvam ApS";
const SCORE = 42;          /* Tiyan Digitals vurdering (egen redaktionel vurdering, ikke en målt metrik) */
const SCORE_TARGET = 92;   /* Mål: Band A */
const CONTACT_EMAIL = "contact@tiyandegital.com";

document.addEventListener("DOMContentLoaded", () => {
  /* Business name — single source of truth */
  document.querySelectorAll("[data-business-name]").forEach((el) => {
    el.textContent = BUSINESS_NAME;
  });
  document.title = document.title.replace(/\{BUSINESS\}/g, BUSINESS_NAME);

  /* Active nav is set server-side per page; nothing to do here. */

  /* Kinetic score dial: count 0 -> 42, arc sweeps to 42% */
  const dial = document.querySelector(".dial");
  if (dial) {
    const arc = dial.querySelector(".arc");
    const num = dial.querySelector(".num");
    const C = 2 * Math.PI * 100; /* r=100 */
    arc.style.strokeDasharray = String(C);
    arc.style.strokeDashoffset = String(C);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const run = () => {
      if (reduce) {
        num.textContent = String(SCORE);
        arc.style.strokeDashoffset = String(C * (1 - SCORE / 100));
        return;
      }
      const t0 = performance.now(), dur = 1200;
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = Math.round(SCORE * eased);
        num.textContent = String(v);
        arc.style.strokeDashoffset = String(C * (1 - (SCORE * eased) / 100));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { run(); io.disconnect(); } });
    }, { threshold: 0.4 });
    io.observe(dial);
  }

  /* Duplication bars animate on scroll */
  document.querySelectorAll(".bar-fill[data-w]").forEach((bar) => {
    bar.style.width = "0%";
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { bar.style.width = bar.dataset.w + "%"; io.disconnect(); }
      });
    }, { threshold: 0.4 });
    io.observe(bar);
  });
});
