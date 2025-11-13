const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const axios = require("axios");
const qs = require("qs");
const { DateTime } = require("luxon");

const ANILIST_QUERY = `
query ($username: String) {
  MediaListCollection(userName: $username, type: ANIME) {
    lists {
      name
      status
      entries {
        id
        mediaId
        status
        score
        progress
        repeat
        startedAt { year month day }
        completedAt { year month day }
        updatedAt
        createdAt
        media {
          id
          title { romaji english native }
          coverImage { large medium }
          bannerImage
          episodes
          format
          status
          season
          seasonYear
          genres
          averageScore
          description
        }
      }
    }
  }
}
`;

const SEARCH_ANIME_QUERY = `
query ($search: String) {
  Page(page: 1, perPage: 20) {
    media(search: $search, type: ANIME) {
      id
      title { romaji english native }
      coverImage { large medium }
      bannerImage
      episodes
      format
      genres
      averageScore
      description
    }
  }
}
`;

// -------- Database connection helper --------
const getConnection = async () => {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_ANIME,
    port: process.env.DB_PORT || 3306,
    ssl: {
      rejectUnauthorized: true,
    },
  });
};

// -------- GraphQL request --------
async function queryAnilist(query, variables = {}, token = null) {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await axios.post(
    "https://graphql.anilist.co",
    { query, variables },
    { headers }
  );

  if (response.data.errors) throw new Error(response.data.errors[0].message);
  return response.data.data;
}

// -------- Store token --------
async function storeAnilistToken(username, access_token, refresh_token, expires_in) {
  const expires_at = DateTime.utc().plus({ seconds: expires_in }).toSQL({ includeOffset: false });
  const conn = await getConnection();
  await conn.execute(
    `INSERT INTO anilist_tokens (username, access_token, refresh_token, expires_at)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       access_token = VALUES(access_token),
       refresh_token = VALUES(refresh_token),
       expires_at = VALUES(expires_at)`,
    [username, access_token, refresh_token, expires_at]
  );
  await conn.end();
}

// -------- Fetch anime list from DB --------
async function fetchFromDatabase(username) {
  const conn = await getConnection();
  const [rows] = await conn.execute(`
    SELECT al.*, ad.title_romaji, ad.title_english, ad.title_native,
           ad.cover_image_large, ad.cover_image_medium,
           ad.episodes, ad.format, ad.genres, ad.average_score, ad.description
    FROM anime_list al
    LEFT JOIN anime_details ad ON al.media_id = ad.id
    WHERE al.username = ?
    ORDER BY al.updated_at DESC
  `, [username]);
  await conn.end();
  return rows.map(r => {
    if (typeof r.genres === "string") {
      try { r.genres = JSON.parse(r.genres); } catch { r.genres = []; }
    }
    return r;
  });
}

// -------- Sync anime list --------
router.post("/anilist/BaseFunction/fetch", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Username is required" });

    let lists;
    try {
      lists = await queryAnilist(ANILIST_QUERY, { username });
    } catch (e) {
      console.error("AniList fetch failed:", e.message);
      const cached = await fetchFromDatabase(username);
      return res.json({
        success: true,
        username,
        count: cached.length,
        animeList: cached,
        cached: true,
        message: "Returned cached data (AniList fetch failed)"
      });
    }

    // TODO: Implement hasDataChanged & storeInDatabase logic (similar to Flask)
    const animeList = await fetchFromDatabase(username); // for now return cached
    res.json({ success: true, username, count: animeList.length, animeList, cached: false });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// -------- AniList OAuth --------
router.get("/Anilist-auth", (req, res) => {
  const { state } = req.query;
  if (!state) return res.status(400).json({ error: "Missing state parameter" });

  const params = {
    client_id: process.env.ANILIST_CLIENT_ID,
    redirect_uri: process.env.ANILIST_REDIRECT_URI,
    response_type: "code",
    state
  };
  const url = `https://anilist.co/api/v2/oauth/authorize?${qs.stringify(params)}`;
  res.redirect(url);
});

router.get("/anilist/auth/callback", (req, res) => {
  const { code, state } = req.query;
  if (!code || !state) return res.status(400).json({ error: "Missing code or state" });

  const frontend_url = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";
  res.redirect(`${frontend_url}/anime-list?code=${code}&state=${state}`);
});

// -------- Exchange OAuth code --------
router.post("/Anilist-exchange", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "Code is required" });

    const response = await axios.post("https://anilist.co/api/v2/oauth/token", {
      grant_type: "authorization_code",
      client_id: process.env.ANILIST_CLIENT_ID,
      client_secret: process.env.ANILIST_CLIENT_SECRET,
      redirect_uri: process.env.ANILIST_REDIRECT_URI,
      code
    });

    const { access_token, refresh_token, expires_in } = response.data;
    const userData = await queryAnilist("{ Viewer { id name } }", {}, access_token);
    const username = userData.Viewer.name;

    await storeAnilistToken(username, access_token, refresh_token, expires_in);

    res.cookie("anilist_token", access_token, { maxAge: expires_in * 1000, httpOnly: true, secure: true, sameSite: "lax" });
    res.json({ message: "Authentication successful", username });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// -------- Check auth --------
router.get("/anilist/auth/check", (req, res) => {
  const token = req.cookies.anilist_token;
  res.json({ authenticated: !!token });
});

// -------- Search / modify anime --------
router.post("/anilist/modify", async (req, res) => {
  try {
    const token = req.cookies.anilist_token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const { action, query, animeId, status, progress, score } = req.body;

    if (action === "search") {
      const result = await queryAnilist(SEARCH_ANIME_QUERY, { search: query }, token);
      return res.json({ results: result.Page.media });
    }

    if (action === "add") {
      const mutation = `
      mutation ($mediaId: Int, $status: MediaListStatus) {
        SaveMediaListEntry(mediaId: $mediaId, status: $status) { id status }
      }`;
      const result = await queryAnilist(mutation, { mediaId: animeId, status: status || "PLANNING" }, token);
      return res.json(result);
    }

    // TODO: Implement PUT/DELETE logic similarly
    res.status(400).json({ error: "Invalid request" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
