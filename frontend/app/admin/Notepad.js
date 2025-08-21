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

  const router = useRouter();

  // Consistent API URL
  const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = getAuthToken();
      
      // Check if token exists
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/auth/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();
      
      // Better error handling
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Access forbidden. Please check your permissions or login again.");
        } else if (response.status === 401) {
          throw new Error("Unauthorized. Please login again.");
        }
        throw new Error(data.error || `Failed to save document. Status: ${response.status}`);
      }

      setSuccess("Document saved successfully!");
      setTitle("");
      setContent("");
      
      // Refresh documents list
      fetchUserDocuments();
      
      if (onDocumentSaved) {
        onDocumentSaved(data);
      }
    } catch (err) {
      console.error("Save document error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDocuments = async () => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/auth/documents`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Access forbidden. You don't have permission to view documents.");
        } else if (response.status === 401) {
          throw new Error("Unauthorized. Please login again.");
        }
        throw new Error(`Failed to fetch documents. Status: ${response.status}`);
      }

      const documents = await response.json();
      setDocuments(documents);
    } catch (err) {
      console.error("Fetch documents error:", err);
      setError(err.message);
    }
  };

  // Initialize user data
  useEffect(() => {
    const userData = getUserFromToken();
    if (userData) {
      setUser(userData);
    } else {
      setError("User authentication failed. Please login again.");
    }
  }, []);

  // Fetch documents when user is set
  useEffect(() => {
    if (user) {
      fetchUserDocuments();
    }
  }, [user]);

  return (
    <div className="mb-20">
      <h3 className="text-lg font-bold text-black mb-4 text-center dark:text-gray-100 w-full">
        Your Personal NotePad
      </h3>
      <div className="p-6 bg-none grid grid-cols-2 gap-5">
        <div className="bg-white/10 p-4 backdrop-blur-3xl rounded-lg">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-500 text-sm mb-4 p-2 bg-red-100 rounded dark:bg-red-900/20">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-500 text-sm mb-4 p-2 bg-green-100 rounded dark:bg-green-900/20">
                {success}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-black text-sm font-bold mb-2 dark:text-gray-100">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-purple-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                disabled={loading}
              />
            </div>
            <div className="mb-6">
              <label className="block text-black text-sm font-bold mb-2 dark:text-gray-100">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-green-600 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="6"
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !user}
              className="w-full bg-gradient-to-l from-purple-700 via-blue-500 to-pink-500 text-white py-2 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {loading ? "Saving..." : "Save Document"}
            </button>
          </form>
        </div>

        {/* User Documents List */}
        <div className="bg-white/10 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-green-500 mb-4 text-center">
            Your Saved Documents
          </h3>
          {documents.length > 0 ? (
            <ul className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {documents.map((doc) => (
                <li
                  key={doc._id}
                  className="p-3 bg-gray-50 rounded-md border dark:bg-gray-900 hover:shadow-md transition-shadow"
                >
                  <p className="font-semibold text-purple-700 dark:text-purple-400">
                    {doc.title}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 truncate">
                    {doc.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(doc.createdAt || doc.created_at).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center mt-20">
              <p className="text-gray-600 dark:text-gray-400">
                {error ? "Unable to load documents" : "No documents yet"}
              </p>
              <button 
                onClick={fetchUserDocuments}
                className="mt-2 text-blue-500 hover:text-blue-700 text-sm underline"
              >
                Refresh
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notepad;