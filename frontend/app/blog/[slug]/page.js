import { notFound } from "next/navigation";
import BlogPost from "./BlogPost";
import { PortfolioApiService } from "@/services/PortfolioApiService";

/* Allow fallback ISR pages */
export const dynamicParams = true;

/* ================================
   STATIC PATH GENERATION
================================ */
export async function generateStaticParams() {
  try {
    const result = await PortfolioApiService.fetchBlog();

    const posts = Array.isArray(result?.data)
      ? result.data
      : Array.isArray(result?.posts)
      ? result.posts
      : [];

    return posts
      .filter((post) => post?.slug)
      .map((post) => ({
        slug: post.slug,
      }));
  } catch (err) {
    console.error("generateStaticParams failed:", err);
    return [];
  }
}

/* ================================
   FETCH SINGLE BLOG (BUILD SAFE)
================================ */
async function getBlogPost(slug) {
  try {
    const result = await PortfolioApiService.fetchBlogBySlug(slug);
    return result?.data ?? result ?? null;
  } catch {
    return null;
  }
}

/* ================================
   PAGE
================================ */
export default async function BlogPostPage({ params }) {
  const post = await getBlogPost(params.slug);

  if (!post || !post.slug) {
    notFound(); // IMPORTANT for SSG
  }

  return <BlogPost post={post} />;
}
