const BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_API_URL ??
  "http://localhost:3001/api/portfolio";

// ── In-memory cache + request deduplication ───────────────────────────────────
const _cache = new Map();      // path → { data, ts }
const _inflight = new Map();   // path → Promise
const CACHE_TTL = 5 * 60_000;  // 5 minutes

async function apiFetch(path) {
  // 1. Return cached data if fresh
  const cached = _cache.get(path);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data;
  }

  // 2. Deduplicate: if this path is already being fetched, reuse the promise
  if (_inflight.has(path)) {
    return _inflight.get(path);
  }

  // 3. Fetch + cache
  const promise = fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
      const data = await res.json();
      _cache.set(path, { data, ts: Date.now() });
      return data;
    })
    .finally(() => {
      _inflight.delete(path);
    });

  _inflight.set(path, promise);
  return promise;
}

export const portfolioApi = {
  // ── Hero ─────────────────────────────────────────────────────────────────
  getHero: () => apiFetch("/hero"),

  // ── About ────────────────────────────────────────────────────────────────
  getAbout: () => apiFetch("/about"),


  // ── Projects ─────────────────────────────────────────────────────────────
  getProjects: () => apiFetch("/projects"),


  // ── Education ────────────────────────────────────────────────────────────
  getEducation: () => apiFetch("/education"),


  // ── Certifications ───────────────────────────────────────────────────────
  getCertifications: () => apiFetch("/certifications"),


  // ── Contact ──────────────────────────────────────────────────────────────
  getContact: () => apiFetch("/contact"),


  // ── Blog ─────────────────────────────────────────────────────────────────
  getPosts: () => apiFetch("/blog"),


  sendContact: (payload) =>
    fetch(`${BASE_URL}/contact/upload_response`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `Server error ${res.status}`);
      }
      return res.json().catch(() => ({}));
    }),
};
