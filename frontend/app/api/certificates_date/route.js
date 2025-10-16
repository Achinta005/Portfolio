import pool from "@/app/lib/db";
export async function GET(req) {
  try {
    const [result] = await pool.execute("SELECT * FROM certifications");

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch certificates" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Optional: handle other methods if needed
export async function POST(req) {
  return new Response(JSON.stringify({ message: "POST method not implemented" }), {
    status: 501,
    headers: { "Content-Type": "application/json" },
  });
}
