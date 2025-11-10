import pool from "@/app/lib/db";
export async function GET(req) {
  try {
    const [result] = await pool.execute(
      "SELECT * FROM project_model ORDER BY order_position DESC"
    );

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching projects:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch projects" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}