const express = require("express");
const router = express.Router();
const axios = require("axios");
const { DateTime } = require("luxon");

const connectMongoDB = require("../config/mongodb2");
const AnimeDetailsModel = require("../models/animeDetailsModel");
const AnimeListModel = require("../models/animeListModel");

// ---------- AniList GraphQL query ----------
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

// -------- GraphQL request helper --------
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

// -------- Fetch joined data from MongoDB --------
async function fetchFromDatabase(username) {
  // Don't call connectMongoDB here - it should be called once at startup
  
  const listEntries = await AnimeListModel.find({ username })
    .sort({ updated_at: -1 })
    .lean();

  if (listEntries.length === 0) {
    return [];
  }

  // Get all unique media IDs
  const mediaIds = [...new Set(listEntries.map(entry => entry.media_id))];
  
  // Fetch details for all media
  const detailsMap = new Map();
  const details = await AnimeDetailsModel.find({ id: { $in: mediaIds } }).lean();
  
  details.forEach(detail => {
    detailsMap.set(detail.id, detail);
  });

  // Join list entries with details
  return listEntries.map(entry => {
    const detail = detailsMap.get(entry.media_id) || {};
    
    return {
      ...entry,
      title_romaji: detail.title_romaji || null,
      title_english: detail.title_english || null,
      title_native: detail.title_native || null,
      cover_image_large: detail.cover_image_large || null,
      cover_image_medium: detail.cover_image_medium || null,
      episodes: detail.episodes ?? null,
      format: detail.format || null,
      genres: detail.genres || [],
      average_score: detail.average_score ?? null,
      description: detail.description || null,
    };
  });
}

// -------- Normalize AniList API response --------
function normalizeAniListCollection(raw, username) {
  const collection = raw?.MediaListCollection;
  const lists = collection?.lists || [];

  const animeDetailsMap = new Map();
  const animeListRows = [];

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
        updated_at: entry.updatedAt ?? null,
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
    ...existingList.map((r) => {
      const timestamp = r.updated_at instanceof Date 
        ? r.updated_at.getTime() / 1000 
        : Number(r.updated_at) || 0;
      return timestamp;
    })
  );
  
  const apiMaxUpdated = Math.max(
    ...freshList.map((r) => Number(r.updated_at) || 0)
  );

  return dbMaxUpdated !== apiMaxUpdated;
}

// -------- Helper: sync MongoDB --------
async function syncMongoAnime(username, details, listRows) {
  // Don't call connectMongoDB here - it should be called once at startup

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

    // Ensure MongoDB is connected once at the start
    await connectMongoDB();

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

    // 4) Sync MongoDB
    await syncMongoAnime(username, details, list);

    // 5) Fetch again from MongoDB (joined view) for consistent response
    const finalList = await fetchFromDatabase(username);

    return res.json({
      success: true,
      username,
      count: finalList.length,
      animeList: finalList,
      cached: false,
      synced: true,
    });
  } catch (e) {
    console.error("AniList basefunction error:", e);
    return res
      .status(500)
      .json({ success: false, error: "Server error", message: e.message });
  }
});

module.exports = router;