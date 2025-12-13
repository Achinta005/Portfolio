import BlogPost from "./BlogPost";
import { PortfolioApiService } from "@/services/PortfolioApiService";

/* Optional but recommended: controls fallback behavior */
export const dynamicParams = true;

/* Pre-build all blog pages */
export async function generateStaticParams() {
  const result = await PortfolioApiService.fetchBlog();

  const posts = Array.isArray(result.data)
    ? result.data
    : Array.isArray(result.posts)
    ? result.posts
    : result;

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
  return result.data || result;
}

export default async function BlogPostPage({ params }) {
  const post = await getBlogPost(params.slug);

  if (!post?.slug) {
    return (
      <div className="p-10 text-center text-red-500">
        Post not found
      </div>
    );
  }

  return <BlogPost post={post} />;
}
