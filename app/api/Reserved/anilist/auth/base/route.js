// /app/api/anilist/auth/base/route.js
import { NextResponse } from "next/server";

const AUTH_URL = "https://anilist.co/api/v2/oauth/authorize";

export async function GET(req) {
    console.log("/api/anilist/auth/base HIT..")
  const clientId = process.env.ANILIST_CLIENT_ID;
  const redirectUri = process.env.ANILIST_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "Missing ANILIST_CLIENT_ID or ANILIST_REDIRECT_URI environment variables" },
      { status: 500 }
    );
  }

  // ✅ Generate a secure random state using Web Crypto API
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  const state = Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");

  // Build AniList authorization URL
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    state,
  });

  const authorizeUrl = `${AUTH_URL}?${params.toString()}`;

  // Create redirect response
  const res = NextResponse.redirect(authorizeUrl);

  // Set CSRF-protection cookie with the state value
  const cookieParts = [
    `anilist_oauth_state=${state}`,
    `Path=/`,
    `HttpOnly`,
    `SameSite=Lax`,
    `Max-Age=${5 * 60}`, // 5 minutes
  ];

  if (process.env.NODE_ENV === "production") {
    cookieParts.push("Secure");
  }

  res.headers.append("Set-Cookie", cookieParts.join("; "));
  return res;
}
