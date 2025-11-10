// /app/api/anilist/auth/callback/route.js
import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const clientId = process.env.ANILIST_CLIENT_ID;
  const clientSecret = process.env.ANILIST_CLIENT_SECRET;
  const redirectUri = process.env.ANILIST_REDIRECT_URI;

  // --- 1️⃣ Validate required params
  if (!code || !state) {
    return NextResponse.json({ error: "Missing code or state" }, { status: 400 });
  }

  // --- 2️⃣ Verify stored CSRF state
  const cookies = req.headers.get("cookie") || "";
  const storedState = cookies
    .split(";")
    .find((c) => c.trim().startsWith("anilist_oauth_state="))
    ?.split("=")[1];

  if (!storedState || storedState !== state) {
    return NextResponse.json({ error: "Invalid OAuth state" }, { status: 403 });
  }

  // --- 3️⃣ Exchange code for access token
  try {
    const tokenResponse = await fetch("https://anilist.co/api/v2/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log("✅Token Geted :- ",tokenData)

    if (!tokenResponse.ok) {
      console.error("AniList token error:", tokenData);
      return NextResponse.json({ error: "Failed to exchange token" }, { status: 400 });
    }

    const { access_token, token_type, expires_in, refresh_token } = tokenData;

    // --- 4️⃣ Store token securely in cookie
    const res = NextResponse.redirect(new URL("/anime-list", req.url));

    const cookieParts = [
      `anilist_token=${access_token}`,
      `HttpOnly`,
      `Path=/`,
      `SameSite=Lax`,
      `Max-Age=${expires_in}`, // AniList default: 1 year
    ];

    if (process.env.NODE_ENV === "production") {
      cookieParts.push("Secure");
    }

    res.headers.append("Set-Cookie", cookieParts.join("; "));

    // (Optional) store refresh token separately for later
    if (refresh_token) {
      const refreshCookie = [
        `anilist_refresh=${refresh_token}`,
        `HttpOnly`,
        `Path=/`,
        `SameSite=Lax`,
        `Max-Age=${60 * 60 * 24 * 365}`, // 1 year
      ];
      if (process.env.NODE_ENV === "production") refreshCookie.push("Secure");
      res.headers.append("Set-Cookie", refreshCookie.join("; "));
    }

    // --- 5️⃣ Clear old CSRF cookie
    res.headers.append(
      "Set-Cookie",
      "anilist_oauth_state=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax"
    );

    return res;
  } catch (err) {
    console.error("AniList Auth Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
