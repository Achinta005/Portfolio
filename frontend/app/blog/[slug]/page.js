import BlogPost from "./BlogPost";
import { PortfolioApiService } from "@/services/PortfolioApiService";

export async function generateStaticParams() {
  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    console.log("⏩ Skipping blog static generation during Docker build");
    return [];
  }

  const result = await PortfolioApiService.fetchBlog();

  const posts = Array.isArray(result.data)
    ? result.data
    : Array.isArray(result.posts)
    ? result.posts
    : result; // fallback if API returns raw array

  if (!Array.isArray(posts)) {
    console.error("Unexpected blog API response:", result);
    return [];
  }

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

async function getBlogPost(slug) {
  const result = await PortfolioApiService.fetchBlogBySlug(slug);
  return result.data || result; // normalized
}

export default async function BlogPostPage({ params }) {
  if (!params?.slug) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  const post = await getBlogPost(params.slug);

  if (!post?.slug) {
    return <div className="p-10 text-center text-red-500">Post not found</div>;
  }

  return <BlogPost post={post} />;
}