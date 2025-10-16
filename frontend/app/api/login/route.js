import pool from "@/app/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  let connection;
  try {
    const body = await req.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: "Username and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get connection from pool
    connection = await pool.getConnection();

    const [rows] = await connection.execute(
      "SELECT * FROM usernames WHERE username = ? LIMIT 1",
      [username]
    );

    const user = rows[0];
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return new Response(
      JSON.stringify({ token }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({ error: "Login error", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}