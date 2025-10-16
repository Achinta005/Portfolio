import pool from "@/app/lib/db";

export async function GET(req, { params }) {
  const { slug } = params; // slug comes from the filename [slug]

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM blog_data WHERE slug = ? LIMIT 1",
      [slug]
    );

    if (!rows.length) {
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const row = rows[0];
    return new Response(
      JSON.stringify({
        id: row.post_id,
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt,
        content: row.content,
        date: row.date,
        readTime: row.readTime,
        tags: row.tags ? row.tags.toString().split(",") : [],
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching post", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
