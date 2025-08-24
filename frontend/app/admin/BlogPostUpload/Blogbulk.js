"use client";
import React, { useState } from "react";
import HtmlEditor from "@/app/code-editor/htmlEditor";

export function BlogUpload() {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    date: new Date().toISOString(),
    readTime: "3 min",
    tags: [],
    content: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleHtmlEditorSubmit = (htmlContent) => {
    try {
      setFormData((prev) => ({ ...prev, content: htmlContent }));
      setMessage("HTML file loaded successfully");
    } catch (err) {
      console.error(err);
      setMessage("Error Submittingg HTML file");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      tags: e.target.value.split(",").map((tag) => tag.trim()),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.content) {
      setMessage("Please upload an HTML file first");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/api/blog/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      setMessage(res.ok ? "Blog post created!" : `Error: ${result.detail}`);
    } catch (err) {
      console.error(err);
      setMessage("Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-400 rounded-lg space-y-6">
      {/* Drag-and-drop section */}
      <HtmlEditor onSubmit={handleHtmlEditorSubmit} />
      {message && <p className="mt-2 text-sm text-gray-200">{message}</p>}

      {/* Form section */}
      <div className="mt-6 space-y-4 relative z-50 bg-gradient-to-br from-gray-100 via-gray-400 to-gray-700 p-4 rounded-2xl">
        <input
          type="text"
          name="title"
          placeholder="Enter Blog Title"
          onChange={handleChange}
          className="w-full text-purple-700 px-4 py-3 border  border-blue-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[1em] font-semibold border-b"
        />
        <input
          type="text"
          name="slug"
          placeholder='Enter a Url Friendly Slug (giving hypen("-") between)'
          onChange={handleChange}
          className="w-full text-purple-700 px-4 py-3 border  border-blue-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[1em] font-semibold border-b"
        />
        <input
          type="text"
          name="excerpt"
          placeholder="Give a 5-10 words short Brief"
          onChange={handleChange}
          className="w-full text-purple-700 px-4 py-3 border  border-blue-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[1em] font-semibold border-b"
        />
        <input
          type="text"
          placeholder="Tags/Tech Described (comma-separated)"
          onChange={handleTagsChange}
          className="w-full text-purple-700 px-4 py-3 border  border-blue-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[1em] font-semibold border-b"
        />
        <div className="justify-center items-center flex">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-white/20 backdrop-blur-2xl p-2 rounded-lg text-green-700 font-bold px-4 py-2 hover:bg-white/30 cursor-pointer"
          >
            {loading ? "Submitting..." : "Submit Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
