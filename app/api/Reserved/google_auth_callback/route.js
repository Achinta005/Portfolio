import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "@/app/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return new Response("Missing authorization code", { status: 400 });
    }

    // 1️⃣ Exchange code for access token
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.REDIRECT_URL,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // 2️⃣ Fetch user info
    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const username = userInfoResponse.data.name;
    const password = userInfoResponse.data.id;
    const role = "editor";

    // 3️⃣ Check if user exists in MySQL
    const [rows] = await pool.execute(
      "SELECT * FROM usernames WHERE username = ? LIMIT 1",
      [username]
    );

    let user = rows[0];

    if (user) {
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return new Response(
          "Username already exists with a different password.",
          { status: 400 }
        );
      }
    } else {
      // 4️⃣ Create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await pool.execute(
        `INSERT INTO usernames (username, password, role, version_key, created_at, updated_at)
         VALUES (?, ?, ?, 0, NOW(), NOW())`,
        [username, hashedPassword, role]
      );

      user = {
        id: result.id,
        username,
        role,
      };
    }
    // 5️⃣ Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // 6️⃣ Redirect to frontend with token
    const redirectUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/login?token=${token}`;
    return Response.redirect(redirectUrl);
  } catch (error) {
    console.error(error.response?.data || error.message);
    return new Response("OAuth failed", { status: 500 });
  }
}
