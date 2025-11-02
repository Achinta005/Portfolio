import { apiCall } from "./baseApi";

export const PortfolioApiService = {
  //Download Resume
  downloadResume: async () => {
    const response = await fetch(
      `/api/resume`
    );

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
    return apiCall("/api/upload_response", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  //Register User
  Register: async (formData) => {
    return apiCall("/api/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });
  },

  //Login User
  Login: async (formData) => {
    return apiCall(`/api/login`, {
      method: "POST",
      body: JSON.stringify(formData),
    });
  },

  //Upload Blog Post
  UploadBlog: async (formData) => {
    return apiCall("/api/upload_blog", {
      method: "POST",
      body: JSON.stringify(formData),
    });
  },

  //Upload Project
  UplaodProject: async (formData) => {
    return apiCall("/api/project_uplaod", {
      method: "POST",
      body: formData,
    });
  },

  //View Contact Responses
  ContactResponses: async () => {
    return apiCall("/api/contact_responses");
  },

  //Post Notepad Documents
  Notepad: async (title, content) => {
    return apiCall("/api/create_documents", {
      method: "POST",
      body: JSON.stringify({ title, content }),
    });
  },

  //Fetch User Notepad Documents
  FetchNotepadDocs: async () => {
    return apiCall("/api/fetch_documents");
  },
};
