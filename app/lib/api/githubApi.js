// lib/api/githubApi.js

const BASE     = "https://api.github.com";
const USERNAME = "Achinta005";                      // ← your username
const TOKEN    = process.env.NEXT_PUBLIC_GITHUB_TOKEN ?? ""; // add to .env.local

const headers = {
  Accept: "application/vnd.github+json",
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

async function get(path) {
  const res = await fetch(`${BASE}${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${path}`);
  return res.json();
}

// ── GraphQL: fetch one year's contribution calendar ──────────────────────────
async function fetchContribYear(year) {
  const from = `${year}-01-01T00:00:00Z`;
  const to   = `${year}-12-31T23:59:59Z`;
  const query = `{
    user(login: "${USERNAME}") {
      contributionsCollection(from: "${from}", to: "${to}") {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
        restrictedContributionsCount
      }
    }
  }`;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error("GraphQL error");
  const json = await res.json();
  return json.data.user.contributionsCollection;
}

// ── Main GraphQL fetch: last 52 weeks rolling (spans two calendar years) ──────
async function fetchContribGridGraphQL() {
  const today    = new Date();
  const thisYear = today.getFullYear();
  const lastYear = thisYear - 1;

  // Fetch both years in parallel
  const [prev, curr] = await Promise.all([
    fetchContribYear(lastYear),
    fetchContribYear(thisYear),
  ]);

  // Flatten both into a single day map keyed by date string
  const dayMap = {};
  for (const collection of [prev, curr]) {
    for (const week of collection.contributionCalendar.weeks) {
      for (const day of week.contributionDays) {
        dayMap[day.date] = day.contributionCount;
      }
    }
  }

  // Build last 364 days rolling window
  const days = [];
  for (let d = 363; d >= 0; d--) {
    const dt  = new Date(today);
    dt.setDate(today.getDate() - d);
    const key = dt.toISOString().slice(0, 10);
    days.push({ date: key, count: dayMap[key] ?? 0 });
  }

  // Total = sum of last 364 days (matches GitHub's "last year" display)
  const totalContribs   = days.reduce((a, d) => a + d.count, 0);
  // Private = sum of both years' restricted counts (approximate)
  const privateContribs = (prev.restrictedContributionsCount ?? 0) +
                          (curr.restrictedContributionsCount ?? 0);

  return { days, totalContribs, privateContribs };
}

// ── REST fallback: public push events only (~90 days) ────────────────────────
async function fetchContribGridREST() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const map = {};
  for (let d = 363; d >= 0; d--) {
    const dt = new Date(today);
    dt.setDate(today.getDate() - d);
    map[dt.toISOString().slice(0, 10)] = 0;
  }
  try {
    for (let page = 1; page <= 10; page++) {
      const events = await get(`/users/${USERNAME}/events/public?per_page=30&page=${page}`);
      if (!events.length) break;
      for (const ev of events) {
        if (ev.type !== "PushEvent") continue;
        const day = ev.created_at.slice(0, 10);
        const commits = ev.payload?.commits?.length ?? 1;
        if (day in map) map[day] += commits;
      }
    }
  } catch (_) {}
  return Object.keys(map).sort().map(k => ({ date: k, count: map[k] }));
}

// ── Repos ────────────────────────────────────────────────────────────────────
async function fetchRepos() {
  const repos = [];
  let page = 1;
  while (true) {
    const batch = await get(`/users/${USERNAME}/repos?per_page=100&page=${page}&type=owner`);
    repos.push(...batch);
    if (batch.length < 100) break;
    page++;
  }
  return repos;
}

// ── Language aggregation ─────────────────────────────────────────────────────
async function fetchLanguages(repos) {
  const totals = {};
  await Promise.all(
    repos.slice(0, 30).map(async (r) => {
      try {
        const langs = await get(`/repos/${USERNAME}/${r.name}/languages`);
        for (const [lang, bytes] of Object.entries(langs)) {
          totals[lang] = (totals[lang] || 0) + bytes;
        }
      } catch (_) {}
    })
  );
  const total = Object.values(totals).reduce((a, b) => a + b, 0) || 1;
  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang, bytes]) => ({ lang, pct: Math.round((bytes / total) * 100) }));
}

// ── Streak calculation ───────────────────────────────────────────────────────
function calcStreak(days) {
  // days: [{date, count}] sorted oldest→newest
  let current = 0, longest = 0, temp = 0;
  const todayStr = new Date().toISOString().slice(0, 10);
  const reversed = [...days].reverse(); // newest first

  for (let i = 0; i < reversed.length; i++) {
    if (reversed[i].count > 0) {
      temp++;
      longest = Math.max(longest, temp);
      // current streak only counts if unbroken from today
      if (i === 0 || reversed[i - 1].count > 0) current = temp;
    } else {
      if (i === 0) current = 0; // no contribution today, streak might still be alive if yesterday had one
      temp = 0;
    }
  }
  // re-calc current properly
  current = 0;
  for (const d of reversed) {
    if (d.count > 0) current++;
    else break;
  }
  return { current, longest };
}

export async function fetchGitHubData() {
  const [profile, repos] = await Promise.all([
    get(`/users/${USERNAME}`),
    fetchRepos(),
  ]);

  const totalStars = repos.reduce((a, r) => a + r.stargazers_count, 0);

  let days = [];
  let totalContribs   = 0;
  let privateContribs = 0;

  try {
    if (!TOKEN) throw new Error("no token");
    const result = await fetchContribGridGraphQL(); // ← no year arg now
    days            = result.days;
    totalContribs   = result.totalContribs;
    privateContribs = result.privateContribs;
  } catch (_) {
    days = await fetchContribGridREST();
    totalContribs = days.reduce((a, d) => a + d.count, 0);
  }

  const grid = days.map(d => d.count); // already exactly 364 entries

  const languages = await fetchLanguages(repos);
  const { current: streakCurrent, longest: streakLongest } = calcStreak(days);

  return {
    avatar:         profile.avatar_url,
    name:           profile.name || profile.login,
    bio:            profile.bio,
    followers:      profile.followers,
    publicRepos:    profile.public_repos,
    totalStars,
    languages,
    grid,
    totalContribs,
    privateContribs,
    streakCurrent,
    streakLongest,
  };
}