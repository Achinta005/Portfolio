// app/blog/[slug]/page.js
import BlogPost from "./BlogPost";

const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

// Generate static paths for all blog posts (build-time)
export async function generateStaticParams() {
  const res = await fetch(`${baseUrl}/api/blog_data`, {
    next: { revalidate: 86400 }, // revalidate list daily
  });

  if (!res.ok) throw new Error("Failed to fetch blog list");

  const posts = await res.json();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Fetch single post (build-time + revalidate)
async function getBlogPost(slug) {
  const res = await fetch(`${baseUrl}/api/blog_data/${slug}`, {
    next: { revalidate: 86400 }, // revalidate each post daily
  });

  if (!res.ok) throw new Error("Failed to fetch blog post");

  return res.json();
}

// The main page component (Server Component)
export default async function BlogPostPage({ params }) {
  const post = await getBlogPost(params.slug);

  return <BlogPost post={post} />;
}