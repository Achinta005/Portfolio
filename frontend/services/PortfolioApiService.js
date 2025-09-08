import { apiCall } from "./baseApi";

export const PortfolioApiService = {
  //Download Resume
  downloadResume: async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/download/resume`
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

  //Fetch Education Data
  FetchEducationData: async () => {
    return apiCall("/education/geteducationdata");
  },

  //Fecth Skills Data
  FetchSkillsData:async()=>{
    return apiCall('/skills/getskillsdata')
  },

  //Fecth Certificates
  FetchCertificates:async()=>{
    return apiCall('/certificate/getcertificate')
  },

  //Fetch Projects
  FetchProject:async()=>{
    return apiCall('/projects')
  },

  //Fetch All Blogs
  FetchAllBlogs:async()=>{
    return apiCall('/api/blog/posts',{
        cache: 'no-store'
    })
  },

  //Fetch Blog By slug
  FetchBlogBySlug:async(slug)=>{
    return apiCall(`/api/blog/posts/${slug}`,{
         cache: 'no-store',
    })
  },

  //Post Contact response
  PostContactResponse:async(data)=>{
    return apiCall('/contact',{
        method: "POST",
        body: JSON.stringify(data)
    })
  },

  //Register User
  Register:async(formData)=>{
    return apiCall('/api/auth/register',{
        method: "POST",
        body: JSON.stringify(formData),
    })
  },

  //Login User
  Login:async(formData)=>{
    return apiCall(`/api/auth/login`,{
        method: "POST",
        body: JSON.stringify(formData),
      })
  },

  //Upload Blog Post
  UploadBlog:async(formData)=>{
    return apiCall('/api/blog/upload/posts',{
        method: "POST",
        body: JSON.stringify(formData),
    })
  },

  //Upload Project
  UplaodProject:async(formData)=>{
    return apiCall('/upload',{
        method: "POST",
        body: formData,
    })
  },

  //View Contact Responses
  ContactResponses:async()=>{
    return apiCall('/contact_response')
  },

  //Post Notepad Documents
  Notepad:async(title, content)=>{
    return apiCall('/api/auth/documents',{
        method: "POST",
        body: JSON.stringify({ title, content }),
    })
  },

  //Fetch User Notepad Documents
  FetchNotepadDocs:async()=>{
    return apiCall('/api/auth/documents')
  },
};
