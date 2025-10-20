import Animepool from '@/app/lib/animeDB';
import { NextResponse } from 'next/server';

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
        startedAt {
          year
          month
          day
        }
        completedAt {
          year
          month
          day
        }
        updatedAt
        createdAt
        media {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            medium
          }
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

async function fetchFromAniList(username) {
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: ANILIST_QUERY,
      variables: { username }
    })
  });

  const data = await response.json();

  if (data.errors) {
    throw new Error(data.errors[0]?.message || 'Failed to fetch from AniList');
  }

  return data.data.MediaListCollection.lists;
}

async function createTables() {
  const connection = await Animepool.getConnection();
  
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS anime_list (
        id INT PRIMARY KEY,
        username VARCHAR(255),
        media_id INT,
        list_name VARCHAR(100),
        status VARCHAR(50),
        score FLOAT,
        progress INT,
        repeat_count INT,
        started_at DATE,
        completed_at DATE,
        updated_at BIGINT,
        created_at BIGINT,
        synced_at DATETIME,
        INDEX idx_username (username),
        INDEX idx_media_id (media_id),
        INDEX idx_status (status)
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS anime_details (
        id INT PRIMARY KEY,
        title_romaji VARCHAR(500),
        title_english VARCHAR(500),
        title_native VARCHAR(500),
        cover_image_large VARCHAR(500),
        cover_image_medium VARCHAR(500),
        episodes INT,
        format VARCHAR(50),
        status VARCHAR(50),
        season VARCHAR(50),
        season_year INT,
        genres JSON,
        average_score INT,
        description TEXT
      )
    `);
  } finally {
    connection.release();
  }
}

async function hasDataChanged(username, newLists) {
  const connection = await Animepool.getConnection();

  try {
    const newEntries = newLists.flatMap(list =>
      list.entries.map(entry => ({
        id: entry.id,
        status: entry.status,
        score: entry.score,
        progress: entry.progress,
        updatedAt: entry.updatedAt
      }))
    );

    // Get existing entries from database
    const [existingRows] = await connection.execute(`
      SELECT id, status, score, progress, updated_at
      FROM anime_list
      WHERE username = ?
    `, [username]);

    // If counts don't match, data has changed
    if (newEntries.length !== existingRows.length) {
      return true;
    }

    // Create a map of existing entries for quick lookup
    const existingMap = new Map(
      existingRows.map(row => [row.id, row])
    );

    // Check if any entry has changed
    for (const newEntry of newEntries) {
      const existing = existingMap.get(newEntry.id);
      
      if (!existing) {
        return true; // New entry found
      }

      if (
        existing.status !== newEntry.status ||
        existing.score !== newEntry.score ||
        existing.progress !== newEntry.progress ||
        existing.updated_at !== newEntry.updatedAt
      ) {
        return true; // Entry has been modified
      }
    }

    return false; // No changes detected
  } finally {
    connection.release();
  }
}

async function storeInDatabase(username, lists) {
  const connection = await Animepool.getConnection();

  try {
    await createTables();
    await connection.execute('DELETE FROM anime_list WHERE username = ?', [username]);

    const allEntries = lists.flatMap(list =>
      list.entries.map(entry => ({
        entry,
        listName: list.name
      }))
    );

    for (const { entry, listName } of allEntries) {
      const { media } = entry;

      const startedAt = entry.startedAt?.year
        ? `${entry.startedAt.year}-${entry.startedAt.month || 1}-${entry.startedAt.day || 1}`
        : null;
      const completedAt = entry.completedAt?.year
        ? `${entry.completedAt.year}-${entry.completedAt.month || 1}-${entry.completedAt.day || 1}`
        : null;

      await connection.execute(`
        INSERT INTO anime_list (
          id, username, media_id, list_name, status, score, progress,
          repeat_count, started_at, completed_at, updated_at, created_at, synced_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
          status = VALUES(status),
          score = VALUES(score),
          progress = VALUES(progress),
          synced_at = NOW()
      `, [
        entry.id,
        username,
        entry.mediaId,
        listName,
        entry.status,
        entry.score,
        entry.progress,
        entry.repeat,
        startedAt,
        completedAt,
        entry.updatedAt,
        entry.createdAt
      ]);

      await connection.execute(`
        INSERT INTO anime_details (
          id, title_romaji, title_english, title_native,
          cover_image_large, cover_image_medium, episodes, format,
          status, season, season_year, genres, average_score, description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title_romaji = VALUES(title_romaji),
          title_english = VALUES(title_english),
          episodes = VALUES(episodes),
          average_score = VALUES(average_score)
      `, [
        media.id,
        media.title.romaji,
        media.title.english,
        media.title.native,
        media.coverImage.large,
        media.coverImage.medium,
        media.episodes,
        media.format,
        media.status,
        media.season,
        media.seasonYear,
        JSON.stringify(media.genres),
        media.averageScore,
        media.description
      ]);
    }

    return allEntries.length;
  } finally {
    connection.release();
  }
}

async function fetchFromDatabase(username) {
  const connection = await Animepool.getConnection();

  try {
    const [rows] = await connection.execute(`
      SELECT 
        al.*,
        ad.title_romaji,
        ad.title_english,
        ad.title_native,
        ad.cover_image_large,
        ad.cover_image_medium,
        ad.episodes,
        ad.format,
        ad.genres,
        ad.average_score,
        ad.description
      FROM anime_list al
      LEFT JOIN anime_details ad ON al.media_id = ad.id
      WHERE al.username = ?
      ORDER BY al.updated_at DESC
    `, [username]);

    return rows.map(row => ({
      ...row,
      genres: typeof row.genres === 'string' ? JSON.parse(row.genres) : row.genres
    }));
  } finally {
    connection.release();
  }
}

// Main Request Handling Function
export async function POST(request) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    console.log(`Processing request for: ${username}`);

    // Try to fetch from AniList
    let lists;
    let fetchedFromAniList = false;
    let aniListError = null;

    try {
      lists = await fetchFromAniList(username);
      fetchedFromAniList = true;
      console.log(`Successfully fetched from AniList for: ${username}`);
    } catch (error) {
      console.log(`Failed to fetch from AniList: ${error.message}`);
      aniListError = error.message;
    }

    // If AniList fetch failed, return cached data
    if (!fetchedFromAniList) {
      console.log(`Returning cached data for: ${username}`);
      const cachedAnimeList = await fetchFromDatabase(username);
      
      if (cachedAnimeList.length === 0) {
        return NextResponse.json(
          { error: `Unable to fetch from AniList and no cached data found: ${aniListError}` },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        username,
        count: cachedAnimeList.length,
        animeList: cachedAnimeList,
        cached: true,
        message: 'Returned cached data due to AniList fetch failure'
      });
    }

    // Check if data has changed
    const dataChanged = await hasDataChanged(username, lists);

    if (!dataChanged) {
      console.log(`No changes detected for: ${username}, returning cached data`);
      const cachedAnimeList = await fetchFromDatabase(username);

      return NextResponse.json({
        success: true,
        username,
        count: cachedAnimeList.length,
        animeList: cachedAnimeList,
        cached: true,
        message: 'No changes detected, returned cached data'
      });
    }

    // Data has changed, update database
    console.log(`Data changed for: ${username}, updating database`);
    const count = await storeInDatabase(username, lists);
    console.log(`Stored ${count} entries in database`);

    const animeList = await fetchFromDatabase(username);

    return NextResponse.json({
      success: true,
      username,
      count: animeList.length,
      animeList,
      cached: false,
      message: 'Data synced successfully from AniList'
    });

  } catch (error) {
    console.error('API Error:', error);
    
    // Try to return cached data as last resort
    try {
      const { username } = await request.json();
      if (username) {
        const cachedAnimeList = await fetchFromDatabase(username);
        if (cachedAnimeList.length > 0) {
          return NextResponse.json({
            success: true,
            username,
            count: cachedAnimeList.length,
            animeList: cachedAnimeList,
            cached: true,
            message: 'Returned cached data due to unexpected error'
          });
        }
      }
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}