import { apiCall } from "./baseApi";

export const PortfolioApiService = {
fetchBlog: async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/blog/blog_data`,
      {
        next: { revalidate: 3600 }, // ISR: 1 hour
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch blogs");
    }

    return res.json();
  },

  fetchBlogBySlug: async (slug) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/blog/blog_data/${slug}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch blog");
    }

    return res.json();
  },

  //Download Resume
  downloadResume: async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/about/resume`
    );

    if (!response.ok) throw new Error("Download failed");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  },

  //Post Contact response
  PostContactResponse: async (data) => {
    return apiCall(
      `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/contact/upload_response`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },
};
