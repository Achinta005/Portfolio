import pool from "@/app/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  let connection;
  try {
    const body = await req.json();
    const { username, password, role } = body;

    // Validate input
    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: "Username and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get connection from pool
    connection = await pool.getConnection();

    // Check if user exists
    const [existing] = await connection.execute(
      "SELECT * FROM usernames WHERE username = ? LIMIT 1",
      [username]
    );

    if (existing.length > 0) {
      return new Response(
        JSON.stringify({ error: "User with this Username already exists." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await connection.execute(
      `INSERT INTO usernames 
       (username, password, role, version_key, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [username, hashedPassword, role || "viewer", 0]
    );

    return new Response(
      JSON.stringify({
        message: "User registered successfully",
        user: {
          id: result.insertId,
          username,
          role: role || "viewer",
          version_key: 0,
          created_at: new Date(),
          updated_at: new Date(),
        },
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return new Response(
      JSON.stringify({ error: "Error registering user", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}