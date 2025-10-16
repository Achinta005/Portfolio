import pool from "@/app/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.execute("SELECT * FROM contact_info");
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch contact info", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
