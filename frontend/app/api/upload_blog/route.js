import pool from "@/app/lib/db";

// Optional: validation middleware replacement
async function validateBlogPostData(data) {
  const { title, excerpt, content } = data;
  if (!title || !excerpt || !content) {
    throw new Error("Title, excerpt, and content are required");
  }
}

export async function POST(req) {
  try {
    const formData = await req.json();
    await validateBlogPostData(formData);

    const { title, excerpt, content, tags, date, readTime, slug } = formData;

    // Get next post_id
    const [lastPost] = await pool.execute(
      "SELECT post_id FROM blog_data ORDER BY post_id DESC LIMIT 1"
    );
    const nextPostId = lastPost.length ? lastPost[0].post_id + 1 : 1;

    // Generate slug if not provided
    let finalSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    // Check if slug exists
    const [existingSlug] = await pool.execute(
      "SELECT post_id FROM blog_data WHERE slug = ?",
      [finalSlug]
    );
    if (existingSlug.length) finalSlug = `${finalSlug}-${nextPostId}`;

    const tagsJSON = JSON.stringify(tags || []);

    // Insert blog post
    await pool.execute(
      `INSERT INTO blog_data
      (post_id, title, content, excerpt, slug, tags, date, readTime, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        nextPostId,
        title,
        content,
        excerpt,
        finalSlug,
        tagsJSON,
        date || new Date().toISOString(),
        readTime || "5 min",
      ]
    );

    return new Response(
      JSON.stringify({
        id: nextPostId,
        title,
        slug: finalSlug,
        excerpt,
        content,
        date,
        readTime,
        tags: tags || [],
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating blog post:", error);
    return new Response(
      JSON.stringify({ error: "Error creating blog post", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
