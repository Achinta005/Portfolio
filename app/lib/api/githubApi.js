// lib/api/githubApi.js

const BASE = "https://api.github.com";
const USERNAME = "Achinta005";
const TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN ?? "";

// ── In-memory cache (10 min TTL) ─────────────────────────────────────────────
let _ghCache = null;
let _ghCacheTs = 0;
const GH_CACHE_TTL = 10 * 60_000;
let _ghInflight = null;

const headers = {
  Accept: "application/vnd.github+json",
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

async function get(path) {
  const res = await fetch(`${BASE}${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${path}`);
  return res.json();
}

async function fetchContribYear(year) {
  const from = `${year}-01-01T00:00:00Z`;
  const to = `${year}-12-31T23:59:59Z`;
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

async function fetchContribGridGraphQL() {
  const now = new Date();
  const thisYear = now.getFullYear();
  const lastYear = thisYear - 1;

  const [prev, curr] = await Promise.all([
    fetchContribYear(lastYear),
    fetchContribYear(thisYear),
  ]);

  // Build a date→count map from both years
  const dayMap = {};
  for (const collection of [prev, curr]) {
    for (const week of collection.contributionCalendar.weeks) {
      for (const day of week.contributionDays) {
        dayMap[day.date] = day.contributionCount;
      }
    }
  }

  // ── FIX: build the rolling window using LOCAL date arithmetic ──
  // Using UTC (new Date() + toISOString) causes the "today" anchor to be
  // yesterday in timezones ahead of UTC (e.g. IST = UTC+5:30), so June 6
  // becomes June 5 and the window ends in May instead of June.
  const todayLocal = new Date();
  const toLocalDateStr = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const days = [];
  for (let i = 363; i >= 0; i--) {
    const d = new Date(todayLocal);
    d.setDate(todayLocal.getDate() - i);
    const key = toLocalDateStr(d);
    days.push({ date: key, count: dayMap[key] ?? 0 });
  }

  const totalContribs = days.reduce((a, d) => a + d.count, 0);
  const privateContribs =
    (prev.restrictedContributionsCount ?? 0) +
    (curr.restrictedContributionsCount ?? 0);

  return { days, totalContribs, privateContribs };
}

async function fetchContribGridREST() {
  const todayLocal = new Date();
  const toLocalDateStr = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const map = {};
  for (let i = 363; i >= 0; i--) {
    const d = new Date(todayLocal);
    d.setDate(todayLocal.getDate() - i);
    map[toLocalDateStr(d)] = 0;
  }

  try {
    for (let page = 1; page <= 10; page++) {
      const events = await get(
        `/users/${USERNAME}/events/public?per_page=30&page=${page}`,
      );
      if (!events.length) break;
      for (const ev of events) {
        if (ev.type !== "PushEvent") continue;
        const day = ev.created_at.slice(0, 10);
        const commits = ev.payload?.commits?.length ?? 1;
        if (day in map) map[day] += commits;
      }
    }
  } catch (_) {}

  return Object.keys(map)
    .sort()
    .map((k) => ({ date: k, count: map[k] }));
}

async function fetchRepos() {
  const repos = [];
  let page = 1;
  while (true) {
    const batch = await get(
      `/users/${USERNAME}/repos?per_page=100&page=${page}&type=owner`,
    );
    repos.push(...batch);
    if (batch.length < 100) break;
    page++;
  }
  return repos;
}

async function fetchLanguages(repos) {
  const totals = {};
  const results = await Promise.allSettled(
    repos.slice(0, 30).map((r) =>
      get(`/repos/${USERNAME}/${r.name}/languages`)
    ),
  );
  for (const result of results) {
    if (result.status === "fulfilled") {
      for (const [lang, bytes] of Object.entries(result.value)) {
        totals[lang] = (totals[lang] || 0) + bytes;
      }
    }
  }
  const total = Object.values(totals).reduce((a, b) => a + b, 0) || 1;
  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang, bytes]) => ({ lang, pct: Math.round((bytes / total) * 100) }));
}

function calcStreak(days) {
  let current = 0,
    longest = 0,
    temp = 0;
  const reversed = [...days].reverse();

  for (let i = 0; i < reversed.length; i++) {
    if (reversed[i].count > 0) {
      temp++;
      longest = Math.max(longest, temp);
    } else {
      temp = 0;
    }
  }

  current = 0;
  for (const d of reversed) {
    if (d.count > 0) current++;
    else break;
  }

  return { current, longest };
}

async function _fetchGitHubDataInner() {
  const [profile, repos] = await Promise.all([
    get(`/users/${USERNAME}`),
    fetchRepos(),
  ]);

  const totalStars = repos.reduce((a, r) => a + r.stargazers_count, 0);

  let days = [];
  let totalContribs = 0;
  let privateContribs = 0;

  try {
    if (!TOKEN) throw new Error("no token");
    const result = await fetchContribGridGraphQL();
    days = result.days;
    totalContribs = result.totalContribs;
    privateContribs = result.privateContribs;
  } catch (_) {
    days = await fetchContribGridREST();
    totalContribs = days.reduce((a, d) => a + d.count, 0);
  }

  const grid = days.map((d) => d.count);
  const languages = await fetchLanguages(repos);
  const { current: streakCurrent, longest: streakLongest } = calcStreak(days);

  return {
    avatar: profile.avatar_url,
    name: profile.name || profile.login,
    bio: profile.bio,
    followers: profile.followers,
    publicRepos: profile.public_repos,
    totalStars,
    languages,
    grid,
    totalContribs,
    privateContribs,
    streakCurrent,
    streakLongest,
  };
}

export async function fetchGitHubData() {
  // Return cached data if fresh
  if (_ghCache && Date.now() - _ghCacheTs < GH_CACHE_TTL) {
    return _ghCache;
  }
  // Deduplicate in-flight request
  if (_ghInflight) return _ghInflight;

  _ghInflight = _fetchGitHubDataInner()
    .then((data) => {
      _ghCache = data;
      _ghCacheTs = Date.now();
      return data;
    })
    .finally(() => {
      _ghInflight = null;
    });

  return _ghInflight;
}
