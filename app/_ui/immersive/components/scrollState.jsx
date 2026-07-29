// scrollState.js
export const scrollProgressRef = { current: { offset: 0 } };

export const SECTION_IDS = ["Home", "About", "Skills", "Projects", "Education", "Certs", "Contact"];

export function updateScrollProgress(scrollY, maxScroll) {
  scrollProgressRef.current.offset = maxScroll > 0 ? scrollY / maxScroll : 0;
}

// ── Single global RAF ticker ──────────────────────────────────────────────────
const subscribers = new Set();
let rafId = null;
let lastOffset = -1;

function globalTick() {
  const offset = scrollProgressRef.current?.offset ?? 0;
  // Only call subscribers when scroll position actually changed
  if (offset !== lastOffset) {
    lastOffset = offset;
    subscribers.forEach(fn => {
      try { fn(offset); } catch (e) { console.error(e); }
    });
  }
  rafId = requestAnimationFrame(globalTick);
}

export function subscribeToScroll(fn) {
  if (subscribers.size === 0) {
    lastOffset = -1; // reset on first subscribe
    rafId = requestAnimationFrame(globalTick);
  }
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0 && rafId) {
      cancelAnimationFrame(rafId);
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