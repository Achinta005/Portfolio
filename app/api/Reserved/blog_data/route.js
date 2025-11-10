import pool from "@/app/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.execute("SELECT * FROM blog_data ORDER BY date DESC");

    const posts = rows.map((row) => ({
      id: row.post_id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      content: row.content,
      date: row.date,
      readTime: row.readTime,
      tags: row.tags
        ? Array.isArray(row.tags)
          ? row.tags
          : row.tags.toString().split(",") // convert comma-separated string to array
        : [],
    }));

    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching posts", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
