// ── Shared lottie-player loader ───────────────────────────────────────────────
// Used by BootOverlay and ContactHTML to avoid loading the script twice.
let _lottiePromise = null;

export function loadLottiePlayer() {
  if (_lottiePromise) return _lottiePromise;

  if (typeof window !== "undefined" && customElements.get("lottie-player")) {
    _lottiePromise = Promise.resolve();
    return _lottiePromise;
  }

  _lottiePromise = new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://unpkg.com/@lottiefiles/lottie-player@2.0.8/dist/lottie-player.js";
    s.onload = resolve;
    s.onerror = resolve; // don't block on failure
    document.head.appendChild(s);
  });
  return _lottiePromise;
}
