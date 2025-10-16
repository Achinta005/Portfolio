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

export async function POST(req) {
  const user = await getUserFromToken(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const { title, content } = await req.json();
    if (!title || !content) {
      return new Response(JSON.stringify({ error: "Title and content required" }), { status: 400 });
    }

    const [result] = await pool.execute(
      "INSERT INTO documents(owner, title, content, created_at, updated_at) VALUES(?,?,?,NOW(),NOW())",
      [user.username, title, content]
    );

    return new Response(JSON.stringify({ message: "Document created", id: result.insertId }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error", message: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
