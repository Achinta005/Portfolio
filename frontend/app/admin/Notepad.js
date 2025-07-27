"use client";

import { useState, useEffect } from "react";
import { getAuthToken } from "../lib/auth";
import { getUserFromToken } from "../lib/auth";
import { useRouter } from "next/navigation";

const Notepad = ({ onDocumentSaved }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = getAuthToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

      // --- FIX: Corrected the API endpoint URL to match server.js ---
      const response = await fetch(`${apiUrl}/api/auth/documents`, {
        // -------------------------------------------------------------
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save document.");
      }

      setSuccess("Document saved successfully!");
      setTitle("");
      setContent("");
      if (onDocumentSaved) {
        onDocumentSaved(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  //Modifiaction start//////////////////////
  const router = useRouter();
  useEffect(() => {
    const userData = getUserFromToken();
    setUser(userData);
  }, [router]);

  useEffect(() => {
    if (user) {
      const fetchUserDocuments = async () => {
        try {
          const token = getAuthToken();
          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
          const response = await fetch(`${apiUrl}/api/auth/documents`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) throw new Error("Failed to fetch documents.");
          setDocuments(await response.json());
        } catch (err) {
          setFetchError(err.message);
        }
      };
      fetchUserDocuments();
    }
  }, [user]);

  //Modifiaction stop//////////////////////

  return (
    <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-900">
      <h3 className="text-lg font-bold text-black mb-4 text-center dark:text-gray-100">
        Your Personal NotePad
      </h3>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
        <div className="mb-4">
          <label className="block text-black text-sm font-bold mb-2 dark:text-gray-100">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-purple-800 border rounded-lg"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-black text-sm font-bold mb-2 dark:text-gray-100">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full text-green-600 px-3 py-2 border rounded-lg"
            rows="6"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300"
        >
          {loading ? "Saving..." : "Save Document"}
        </button>
      </form>
      {/* === USER-SPECIFIC DOCUMENT LIST (Visible to all authenticated roles) === */}
      <div className="bg-white rounded-lg shadow-md p-6 top-7 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-black mb-4 dark:text-gray-100">
          Your Saved Documents
        </h3>
        {documents.length > 0 ? (
          <ul className="space-y-3 max-h-96 overflow-y-auto">
            {documents.map((doc) => (
              <li key={doc._id} className="p-3 bg-gray-50 rounded-md border dark:bg-gray-900">
                <p className="font-semibold text-purple-700">{doc.title}</p>
                <p className="text-sm text-green-600 truncate">{doc.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">You have no documents.</p>
        )}
      </div>
    </div>
  );
};

export default Notepad;
