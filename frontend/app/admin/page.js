"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken, removeAuthToken, getAuthToken } from "../lib/auth";

import Project from "./Project";
import ContactResponse from "./ContactResponse";
import TextEditor from "./TextEditor";

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");
  const router = useRouter();

  const [documents, setDocuments] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const userData = getUserFromToken();
    if (userData) {
      setUser(userData);
    } else {
      router.push("/login");
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (user) {
      const fetchUserDocuments = async () => {
        try {
          const token = getAuthToken();
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
          // This endpoint should match your backend route (e.g., /api/documents)
          const response = await fetch(`${apiUrl}/api/auth/documents`, { 
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!response.ok) throw new Error('Failed to fetch documents.');
          setDocuments(await response.json());
        } catch (err) {
          setFetchError(err.message);
        }
      };
      fetchUserDocuments();
    }
  }, [user]);

  const handleLogout = () => {
    removeAuthToken();
    router.push("/login");
  };

  const handleNewDocument = (newDoc) => {
    setDocuments(prevDocs => [newDoc, ...prevDocs]);
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }
  
  // --- FIX STARTS HERE ---
  // Conditionally render the full-page components for Admin
  if (user.role === 'admin' && activeView === "projects") {
    return (
      <div className="container mx-auto p-4">
        <button onClick={() => setActiveView("dashboard")} className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          ← Back to Dashboard
        </button>
        <Project />
      </div>
    );
  }
  
  if (user.role === 'admin' && activeView === "messages") {
    return (
      <div className="container mx-auto p-4">
        <button onClick={() => setActiveView("dashboard")} className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          ← Back to Dashboard
        </button>
        <ContactResponse />
      </div>
    );
  }
  
  // Main Dashboard View
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome, {user.username} (Role: {user.role})</p>
          </div>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Logout
          </button>
        </header>

        {fetchError && <p className="text-red-500 mb-4">{fetchError}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {/* === ROLE-BASED ACTION PANEL === */}
            {/* This block is only visible to users with the 'admin' role */}
            {user.role === 'admin' && (
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <h3 className="text-lg font-semibold">Admin Controls</h3>
                <button onClick={() => setActiveView("projects")} className="text-blue-600 font-medium w-full text-left">Manage Projects →</button>
                <button onClick={() => setActiveView("messages")} className="text-green-600 font-medium w-full text-left">View Messages →</button>
              </div>
            )}
            
            {/* This block is only visible to users with the 'editor' role */}
            {user.role === 'editor' && (
              <TextEditor onDocumentSaved={handleNewDocument} />
            )}
          </div>

          {/* === USER-SPECIFIC DOCUMENT LIST (Visible to all authenticated roles) === */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Your Saved Documents</h3>
            {documents.length > 0 ? (
              <ul className="space-y-3 max-h-96 overflow-y-auto">
                {documents.map(doc => (
                  <li key={doc._id} className="p-3 bg-gray-50 rounded-md border">
                    <p className="font-semibold">{doc.title}</p>
                    <p className="text-sm text-gray-600 truncate">{doc.content}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">You have no documents.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
