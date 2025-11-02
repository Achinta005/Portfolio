import React from "react";
import BlogPage from "./Blog";

export const revalidate = 86400;

export default async function BlogPostPage() {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

  try {
    const res = await fetch(`${baseUrl}/api/blog_data`, {
      next: { revalidate: 86400 }, 
    });

    if (!res.ok) {
      throw new Error("Failed to fetch blog data");
    }

    const blogPostData = await res.json();

    return <BlogPage blogPostData={blogPostData} />;
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return (
      <div className="text-center text-red-400 mt-20">
        Failed to load blog posts.
      </div>
    );
  }
}
