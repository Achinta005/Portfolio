const BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_API_URL ??
  "http://localhost:3001/api/portfolio";

async function apiFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  const data = await res.json();
  return data;
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
