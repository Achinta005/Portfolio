import pool from "@/app/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    await pool.execute(
      `INSERT INTO contact_info (name, email, subject, message, created_at) VALUES (?, ?, ?, ?, NOW())`,
      [name, email, subject, message]
    );

    return new Response(
      JSON.stringify({ message: "Form submitted successfully!" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error submitting contact form:", err);
    return new Response(
      JSON.stringify({ message: "Server error", error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
