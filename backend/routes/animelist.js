const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const axios = require("axios");
const { DateTime } = require("luxon");

// if not already present:
const connectMongoDB = require("../config/mongodb2");
const AnimeDetailsModel = require("../models/animeDetailsModel");
const AnimeListModel = require("../models/animeListModel");

// ---------- AniList GraphQL query kept from your code ----------
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

// -------- DB connection helper (you already had this) --------
const getConnection = require('../config/mysqldb2')

// -------- GraphQL request helper (you already had this) --------
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

// -------- Fetch joined data from MySQL (you already had this; unchanged) --------
async function fetchFromDatabase(username) {
  const conn = await getConnection();
  const [rows] = await conn.execute(
    `
    SELECT al.*, ad.title_romaji, ad.title_english, ad.title_native,
           ad.cover_image_large, ad.cover_image_medium,
           ad.episodes, ad.format, ad.genres, ad.average_score, ad.description
    FROM anime_list al
    LEFT JOIN anime_details ad ON al.media_id = ad.id
    WHERE al.username = ?
    ORDER BY al.updated_at DESC
  `,
    [username]
  );
  await conn.end();
  return rows.map((r) => {
    if (typeof r.genres === "string") {
      try {
        r.genres = JSON.parse(r.genres);
      } catch {
        r.genres = [];
      }
    }
    return r;
  });
}


function normalizeAniListCollection(raw, username) {
  const collection = raw?.MediaListCollection;
  const lists = collection?.lists || [];

  const animeDetailsMap = new Map(); // key: mediaId, value: details object
  const animeListRows = []; // user-specific list entries

  for (const list of lists) {
    const listName = list.name || null;

    for (const entry of list.entries || []) {
      const media = entry.media;
      if (!media) continue;

      const mediaId = media.id;

      // 1) Details (global per anime)
      if (!animeDetailsMap.has(mediaId)) {
        animeDetailsMap.set(mediaId, {
          id: mediaId,
          title_romaji: media.title?.romaji || null,
          title_english: media.title?.english || null,
          title_native: media.title?.native || null,
          cover_image_large: media.coverImage?.large || null,
          cover_image_medium: media.coverImage?.medium || null,
          episodes: media.episodes ?? null,
          format: media.format || null,
          status: media.status || null,
          season: media.season || null,
          season_year: media.seasonYear ?? null,
          genres: media.genres || [],
          average_score: media.averageScore ?? null,
          description: media.description || null,
        });
      }

      // 2) User-specific list row
      const startedAt = entry.startedAt?.year
        ? `${entry.startedAt.year}-${String(entry.startedAt.month || 1).padStart(2, "0")}-${String(
            entry.startedAt.day || 1
          ).padStart(2, "0")}`
        : null;

      const completedAt = entry.completedAt?.year
        ? `${entry.completedAt.year}-${String(entry.completedAt.month || 1).padStart(2, "0")}-${String(
            entry.completedAt.day || 1
          ).padStart(2, "0")}`
        : null;

      animeListRows.push({
        username,
        media_id: mediaId,
        list_name: listName,
        status: entry.status || null,
        score: entry.score ?? null,
        progress: entry.progress ?? null,
        repeat_count: entry.repeat ?? null,
        started_at: startedAt,
        completed_at: completedAt,
        updated_at: entry.updatedAt ?? null, // AniList uses epoch seconds
        created_at: entry.createdAt ?? null,
      });
    }
  }

  return {
    details: Array.from(animeDetailsMap.values()),
    list: animeListRows,
  };
}

// -------- Helper: detect whether DB data is stale --------
function needsSync(existingList, freshList) {
  if (!existingList || existingList.length === 0) return true;
  if (!freshList || freshList.length === 0) return false;

  if (existingList.length !== freshList.length) return true;

  const dbMaxUpdated = Math.max(
    ...existingList.map((r) => Number(r.updated_at) || 0)
  );
  const apiMaxUpdated = Math.max(
    ...freshList.map((r) => Number(r.updated_at) || 0)
  );

  return dbMaxUpdated !== apiMaxUpdated;
}

// -------- Helper: sync MySQL (anime_details + anime_list for username) --------
async function syncMySQLAnime(username, details, listRows) {
  const conn = await getConnection();
  try {
    await conn.beginTransaction();

    // Upsert anime_details
    const detailsSql = `
      INSERT INTO anime_details (
        id, title_romaji, title_english, title_native,
        cover_image_large, cover_image_medium,
        episodes, format, status, season, season_year,
        genres, average_score, description
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
      ON DUPLICATE KEY UPDATE
        title_romaji = VALUES(title_romaji),
        title_english = VALUES(title_english),
        title_native = VALUES(title_native),
        cover_image_large = VALUES(cover_image_large),
        cover_image_medium = VALUES(cover_image_medium),
        episodes = VALUES(episodes),
        format = VALUES(format),
        status = VALUES(status),
        season = VALUES(season),
        season_year = VALUES(season_year),
        genres = VALUES(genres),
        average_score = VALUES(average_score),
        description = VALUES(description)
    `;

    for (const d of details) {
      await conn.execute(detailsSql, [
        d.id,
        d.title_romaji,
        d.title_english,
        d.title_native,
        d.cover_image_large,
        d.cover_image_medium,
        d.episodes,
        d.format,
        d.status,
        d.season,
        d.season_year,
        JSON.stringify(d.genres || []),
        d.average_score,
        d.description,
      ]);
    }

    // Rebuild anime_list rows for this username
    await conn.execute("DELETE FROM anime_list WHERE username = ?", [username]);

    // Need new primary keys for each row (your schema has no AUTO_INCREMENT)
    const [[{ maxId }]] = await conn.query(
      "SELECT COALESCE(MAX(id), 0) AS maxId FROM anime_list"
    );
    let nextId = Number(maxId) + 1;

    const listSql = `
      INSERT INTO anime_list (
        id, username, media_id, list_name, status,
        score, progress, repeat_count,
        started_at, completed_at, updated_at, created_at, synced_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    for (const row of listRows) {
      await conn.execute(listSql, [
        nextId++,
        row.username,
        row.media_id,
        row.list_name,
        row.status,
        row.score,
        row.progress,
        row.repeat_count,
        row.started_at,
        row.completed_at,
        row.updated_at,
        row.created_at,
      ]);
    }

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    await conn.end();
  }
}

// -------- Helper: sync MongoDB (best-effort, non-fatal) --------
async function syncMongoAnime(username, details, listRows) {
  try {
    await connectMongoDB();

    // Upsert details
    if (details.length > 0) {
      const bulkDetails = details.map((d) => ({
        updateOne: {
          filter: { id: d.id },
          update: {
            $set: {
              ...d,
            },
          },
          upsert: true,
        },
      }));
      await AnimeDetailsModel.bulkWrite(bulkDetails, { ordered: false });
    }

    // Rebuild per-user list
    await AnimeListModel.deleteMany({ username });

    if (listRows.length > 0) {
      const docs = listRows.map((r) => ({
        username: r.username,
        media_id: r.media_id,
        list_name: r.list_name,
        status: r.status,
        score: r.score,
        progress: r.progress,
        repeat_count: r.repeat_count,
        started_at: r.started_at ? new Date(r.started_at) : null,
        completed_at: r.completed_at ? new Date(r.completed_at) : null,
        updated_at: r.updated_at ? new Date(r.updated_at * 1000) : null,
        created_at: r.created_at ? new Date(r.created_at * 1000) : null,
        synced_at: new Date(),
      }));
      await AnimeListModel.insertMany(docs);
    }

    return true;
  } catch (err) {
    console.error("Mongo sync failed (non-fatal):", err.message);
    return false;
  }
}

// -------- Single Endpoint: /anilist/basefunction/fetch --------
router.post("/anilist/basefunction/fetch", async (req, res) => {
  try {
    const { username } = req.body || {};
    if (!username) {
      return res
        .status(400)
        .json({ success: false, error: "Username is required" });
    }

    // 1) Fetch fresh from AniList
    let apiData;
    try {
      apiData = await queryAnilist(ANILIST_QUERY, { username });
    } catch (e) {
      console.error("AniList fetch failed:", e.message);
      const cached = await fetchFromDatabase(username);
      return res.json({
        success: true,
        username,
        count: cached.length,
        animeList: cached,
        cached: true,
        message: "Returned cached data (AniList fetch failed)",
      });
    }

    // 2) Normalize AniList data
    const { details, list } = normalizeAniListCollection(apiData, username);

    // 3) Load existing DB list and decide if sync is needed
    const existing = await fetchFromDatabase(username);
    const syncRequired = needsSync(existing, list);

    if (!syncRequired) {
      return res.json({
        success: true,
        username,
        count: existing.length,
        animeList: existing,
        cached: true,
        message: "No changes detected; using cached database data.",
      });
    }

    // 4) Sync MySQL (canonical), then MongoDB (best-effort)
    await syncMySQLAnime(username, details, list);
    const mongoSynced = await syncMongoAnime(username, details, list);

    // 5) Fetch again from MySQL (joined view) for consistent response
    const finalList = await fetchFromDatabase(username);

    return res.json({
      success: true,
      username,
      count: finalList.length,
      animeList: finalList,
      cached: false,
      synced: true,
      mongoSynced,
    });
  } catch (e) {
    console.error("AniList basefunction error:", e);
    return res
      .status(500)
      .json({ success: false, error: "Server error", message: e.message });
  }
});

module.exports = router;