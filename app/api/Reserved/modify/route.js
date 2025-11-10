import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ANILIST_API_URL = "https://graphql.anilist.co";

// Helper function to get the access token from cookies
async function getAccessToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("anilist_token");
  console.log("Access token:", token?.value); // Debug log
  return token?.value;
}

// Helper function to make AniList API requests
async function queryAniList(query, variables, token) {
  try {
    const response = await fetch(ANILIST_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error("AniList API errors:", data.errors); // Log full error response
      throw new Error(data.errors[0]?.message || "AniList API error");
    }

    return data.data;
  } catch (error) {
    console.error("queryAniList error:", error.message);
    throw error;
  }
}

// DELETE: Remove anime from user's list
export async function DELETE(request) {
  try {
    const token = await getAccessToken();

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required. Please connect your AniList account." },
        { status: 401 }
      );
    }

    const { animeId: rawAnimeId } = await request.json();
    const animeId = parseInt(rawAnimeId, 10);

    if (isNaN(animeId)) {
      return NextResponse.json(
        { error: "Anime ID must be a valid number" },
        { status: 400 }
      );
    }

    console.log("Received animeId:", animeId); // Essential log

    // Function to search for anime title by mediaId
    async function searchAnimeTitle(mediaId) {
      const mediaQuery = `
        query ($id: Int) {
          Media(id: $id, type: ANIME) {
            id
            title {
              romaji
              english
            }
          }
        }
      `;
      try {
        const data = await queryAniList(mediaQuery, { id: mediaId }, token);
        if (!data.Media) {
          console.error(`No anime found for mediaId: ${mediaId}`);
          return null;
        }
        const title = data.Media.title.romaji || data.Media.title.english || "Unknown Title";
        console.log(`Anime title for mediaId ${mediaId}: ${title}`); // Essential log
        return title;
      } catch (error) {
        console.error(`Error fetching title for mediaId ${mediaId}:`, error.message);
        return null;
      }
    }

    // Fetch anime title
    const animeTitle = await searchAnimeTitle(animeId);
    if (!animeTitle) {
      return NextResponse.json(
        { error: `No anime found for ID ${animeId}. Please verify the anime ID.` },
        { status: 400 }
      );
    }

    // GraphQL mutation to delete anime from list
    const mutation = `
      mutation ($id: Int) {
        DeleteMediaListEntry(id: $id) {
          deleted
        }
      }
    `;

    // Query to get the user's media list
    const getEntryQuery = `
      query ($userId: Int) {
        MediaListCollection(userId: $userId, type: ANIME, forceSingleCompletedList: false) {
          lists {
            name
            isCustomList
            entries {
              id
              mediaId
              status
              media {
                id
                title {
                  romaji
                  english
                }
              }
            }
          }
        }
      }
    `;

    // Get user ID
    const userQuery = `
      query {
        Viewer {
          id
        }
      }
    `;

    const userData = await queryAniList(userQuery, {}, token);
    const userId = userData.Viewer?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Failed to retrieve user ID" },
        { status: 500 }
      );
    }

    console.log("Fetched userId:", userId); // Essential log

    // Fetch media list
    const entryData = await queryAniList(getEntryQuery, { userId }, token);
    const lists = entryData.MediaListCollection.lists;
    const entries = lists.flatMap(list => list.entries || []);

    const entry = entries.find(entry => entry.mediaId === animeId);
    if (!entry) {
      console.error(`Anime with mediaId ${animeId} (${animeTitle}) not found in user's list`);
      return NextResponse.json(
        { error: `Anime "${animeTitle}" (ID: ${animeId}) not found in your list` },
        { status: 404 }
      );
    }

    const entryId = entry.id;

    // Delete the entry
    const deleteResult = await queryAniList(mutation, { id: entryId }, token);

    if (!deleteResult.DeleteMediaListEntry.deleted) {
      return NextResponse.json(
        { error: `Failed to delete anime "${animeTitle}" (ID: ${animeId}) from list` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Anime "${animeTitle}" (ID: ${animeId}) removed from your list`,
      animeId,
    });
  } catch (error) {
    console.error("Delete error:", error.message, error.stack);
    return NextResponse.json(
      { error: error.message || "Failed to delete anime" },
      { status: 500 }
    );
  }
}

// POST: Search anime or Add anime to list
export async function POST(request) {
  try {
    const body = await request.json();
    const { action, query, animeId, status } = body;

    // SEARCH ACTION
    if (action === "search") {
      if (!query || query.trim().length === 0) {
        return NextResponse.json(
          { error: "Search query is required" },
          { status: 400 }
        );
      }

      const searchQuery = `
        query ($search: String) {
          Page(page: 1, perPage: 10) {
            media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
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
              format
              episodes
              status
              genres
              averageScore
              seasonYear
              description
            }
          }
        }
      `;

      const data = await queryAniList(searchQuery, { search: query.trim() });

      return NextResponse.json({
        success: true,
        results: data.Page.media || [],
      });
    }

    // ADD ACTION
    if (action === "add") {
      const token = await getAccessToken();

      if (!token) {
        return NextResponse.json(
          { error: "Authentication required. Please connect your AniList account." },
          { status: 401 }
        );
      }

      if (!animeId) {
        return NextResponse.json(
          { error: "Anime ID is required" },
          { status: 400 }
        );
      }

      const validStatuses = ["CURRENT", "PLANNING", "COMPLETED", "DROPPED", "PAUSED", "REPEATING"];
      const animeStatus = status || "PLANNING";

      if (!validStatuses.includes(animeStatus)) {
        return NextResponse.json(
          { error: "Invalid status value" },
          { status: 400 }
        );
      }

      // GraphQL mutation to add anime to list
      const mutation = `
        mutation ($mediaId: Int, $status: MediaListStatus) {
          SaveMediaListEntry(mediaId: $mediaId, status: $status) {
            id
            status
            media {
              id
              title {
                romaji
                english
              }
            }
          }
        }
      `;

      const data = await queryAniList(
        mutation,
        { mediaId: animeId, status: animeStatus },
        token
      );

      return NextResponse.json({
        success: true,
        message: "Anime added to your list",
        entry: data.SaveMediaListEntry,
      });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'search' or 'add'" },
      { status: 400 }
    );
  } catch (error) {
    console.error("API error:", error.message, error.stack);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}

// PUT: Update anime status/progress
export async function PUT(request) {
  try {
    const token = await getAccessToken();

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required. Please connect your AniList account." },
        { status: 401 }
      );
    }

    const { animeId, status, progress, score } = await request.json();

    if (!animeId) {
      return NextResponse.json(
        { error: "Anime ID is required" },
        { status: 400 }
      );
    }

    // GraphQL mutation to update anime entry
    const mutation = `
      mutation ($mediaId: Int, $status: MediaListStatus, $progress: Int, $score: Float) {
        SaveMediaListEntry(
          mediaId: $mediaId
          status: $status
          progress: $progress
          score: $score
        ) {
          id
          status
          progress
          score
          media {
            id
            title {
              romaji
              english
            }
          }
        }
      }
    `;

    const variables = {
      mediaId: animeId,
      ...(status && { status }),
      ...(progress !== undefined && { progress }),
      ...(score !== undefined && { score }),
    };

    const data = await queryAniList(mutation, variables, token);

    return NextResponse.json({
      success: true,
      message: "Anime updated successfully",
      entry: data.SaveMediaListEntry,
    });
  } catch (error) {
    console.error("Update error:", error.message, error.stack);
    return NextResponse.json(
      { error: error.message || "Failed to update anime" },
      { status: 500 }
    );
  }
}