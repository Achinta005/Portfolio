import BlogPost from "./BlogPost";
import { PortfolioApiService } from "@/services/PortfolioApiService";

const backendUrl =
  process.env.NEXT_PUBLIC_PYTHON_API_URL

export async function generateStaticParams() {
  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    console.log("⏩ Skipping blog static generation during Docker build");
    return [];
  }

  const posts = await PortfolioApiService.fetchBlog();
  return posts.map((post) => ({ slug: post.slug }));
}

async function getBlogPost(slug) {
  return PortfolioApiService.fetchBlogBySlug(slug);
}

export default async function BlogPostPage({ params }) {
  if (!params?.slug) {
    return (
      <div className="p-10 text-center text-gray-500">
        ⏳ Blog post not generated during build. It will load automatically once the app runs.
      </div>
    );
  }

  const post = await getBlogPost(params.slug);
  return <BlogPost post={post} />;
}
