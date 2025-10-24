import pool from "@/app/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.execute(
      "SELECT u.id, u.username, i.ipaddress, i.timestamp FROM usernames u LEFT JOIN ipaddress i ON u.id = i.user_id ORDER BY i.timestamp DESC"
    );
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch IP addresses", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
