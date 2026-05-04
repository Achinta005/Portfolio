// scrollState.js
export const scrollProgressRef = { current: { offset: 0 } };

export const SECTION_IDS = ["Home", "About", "Skills", "Projects", "Education", "Certs", "Contact"];

export function updateScrollProgress(scrollY, maxScroll) {
  scrollProgressRef.current.offset = maxScroll > 0 ? scrollY / maxScroll : 0;
}

// ── Single global RAF ticker ──────────────────────────────────────────────────
const subscribers = new Set();
let rafId = null;

function globalTick() {
  const offset = scrollProgressRef.current?.offset ?? 0;
  subscribers.forEach(fn => {
    try { fn(offset); } catch (e) { console.error(e); }
  });
  rafId = requestAnimationFrame(globalTick);
}

export function subscribeToScroll(fn) {
  if (subscribers.size === 0) {
    rafId = requestAnimationFrame(globalTick); // start loop only when first subscriber joins
  }
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0 && rafId) {
      cancelAnimationFrame(rafId); // stop loop when no subscribers
      rafId = null;
    }
  };
}

export function scrollToSection(sectionName) {
  const el = document.getElementById(sectionName);
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset: 0, duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}