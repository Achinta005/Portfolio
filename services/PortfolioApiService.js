import { apiCall } from "./baseApi";

export const PortfolioApiService = {
  // Admin
  Ai_enhance: async (plainText) => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/ai-enhance`, {
      method: "POST",
      body: JSON.stringify({ text: plainText }),
    });
  },

  Upload_blog: async (formData) => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/upload_blog`, {
      method: "POST",
      body: JSON.stringify(formData),
    });
  },

  Fetch_IP: async (userId) => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/get-ip`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
    });
  },

  ViewIp: async () => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/view-ip`);
  },

  // Authentication
  Register: async (formData) => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/register`, {
      method: "POST",
      body: JSON.stringify(formData),
    });
  },

  Login: async (formData) => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/login`, {
      method: "POST",
      body: JSON.stringify(formData),
    });
  },

  // AnimeList

  FetchAnimeList: async (username) => {
    return apiCall(
      `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/anilist/BaseFunction/fetch`,
      {
        method: "POST",
        body: JSON.stringify({ username: username.trim() }),
      }
    );
  },

  // About 
  fetchSkill: async () => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/Skilldata`, {
      next: { revalidate: 86400 },
    });
  },

  fetchEducation: async () => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/Educationdata`, {
      next: { revalidate: 86400 },
    });
  },

  fetchCertificates: async () => {
    return apiCall(
      `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/Certificatesdata`,
      { next: { revalidate: 86400 } }
    );
  },

  fetchProjects: async () => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/projects_data`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
  },

  UplaodProject: async (formData) => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/project_uplaod`, {
      method: "POST",
      body: formData,
    });
  },

  fetchBlog: async () => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/blog_data`, {
      next: { revalidate: 86400 },
    });
  },

  fetchBlogBySlug: async (slug) => {
    return apiCall(
      `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/blog_data/${slug}`,
      {
        next: { revalidate: 86400 },
      }
    );
  },

  //Download Resume
  downloadResume: async () => {
    const response = await fetch(`/resume`);

    if (!response.ok) throw new Error("Download failed");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Create a temporary link to trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.pdf"; // You can set the filename here
    document.body.appendChild(a);
    a.click();
    a.remove();

    // Clean up the object URL
    window.URL.revokeObjectURL(url);
  },

  //Post Contact response
  PostContactResponse: async (data) => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/upload_response`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  //View Contact Responses
  ContactResponses: async () => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/contact_responses`);
  },

  //Post Notepad Documents
  Notepad: async (title, content) => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/create_documents`, {
      method: "POST",
      body: JSON.stringify({ title, content }),
    });
  },

  //Fetch User Notepad Documents
  FetchNotepadDocs: async () => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/fetch_documents`);
  },
};
