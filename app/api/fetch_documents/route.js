import pool from "@/app/lib/db";
import jwt from "jsonwebtoken";

async function getUserFromToken(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return null;
    const token = authHeader.replace("Bearer ", "");
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user;
  } catch {
    return null;
  }
}

export async function GET(req) {
  const user = await getUserFromToken(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM documents WHERE owner = ? ORDER BY updated_at DESC",
      [user.username]
    );

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch documents" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
