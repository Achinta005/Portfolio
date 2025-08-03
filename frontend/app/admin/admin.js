"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken, removeAuthToken, getAuthToken } from "../lib/auth";
import Project from "./Project";
import ContactResponse from "./ContactResponse";
import Notepad from "./Notepad";
import Link from "next/link";

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

  const handleLogout = () => {
    removeAuthToken();
    router.push("/login");
  };

  const handleNewDocument = (newDoc) => {
    setDocuments((prevDocs) => [newDoc, ...prevDocs]);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Conditionally render the full-page components for Admin and user(editor here)
  if (user.role === "admin" && activeView === "projects") {
    return (
      <div className="p-4 dark:bg-gray-700">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ← Back to Dashboard
        </button>
        <Project />
      </div>
    );
  }

  if (user.role === "admin" && activeView === "messages") {
    return (
      <div className="p-6 dark:bg-gray-800">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ← Back to Dashboard
        </button>
        <ContactResponse />
      </div>
    );
  }
  if (user.role === "admin" && activeView === "Notepad") {
    return (
      <div className="p-8 dark:bg-gray-800">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ← Back to Dashboard
        </button>
        <Notepad onDocumentSaved={handleNewDocument} />
      </div>
    );
  }
  if (user.role === "editor" && activeView === "Notepad") {
    return (
      <div className="container mx-auto p-4">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ← Back to Dashboard
        </button>
        <Notepad onDocumentSaved={handleNewDocument} />
      </div>
    );
  }

  // Main Dashboard View
  return (
    <div className="min-h-screen dark:bg-gray-800">
      <Link href="/" className="mb-4 px-4 py-2 bg-white/20 text-white rounded hover:bg-white/60">HOME</Link>
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 p-2 text-center left-[39vw] lg:relative dark:text-gray-100">
              Dashboard
            </h1>
            <p className="text-green-700 font-bold text-xl ">
              Welcome {user.username} (Role: {user.role})
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </header>

        {fetchError && <p className="text-red-500 mb-4">{fetchError}</p>}
        {/* Only for Admin--> */}
        {user.role === "admin" && (
          <div className="grid grid-cols-3 gap-6 bg-white/30 rounded-lg shadow-2xl p-6 h-[50vh] dark:bg-gray-900">
            <h3 className="col-span-3 w-[15vw]  text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 lg:relative lg:left-[38vw] h-10">
              Admin Controls
            </h3>
            <button
              onClick={() => setActiveView("projects")}
              className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 h-12"
            >
              Manage Projects →
            </button>
            <button
              onClick={() => setActiveView("messages")}
              className="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 h-12"
            >
              View Messages →
            </button>
            <button
              onClick={() => setActiveView("Notepad")}
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 text-center me-2 mb-2 h-12"
            >
              Go To Notepad →
            </button>
          </div>
        )}

        {/* Only for Editor(user)--> */}
        {user.role === "editor" && (
          <button
            onClick={() => setActiveView("Notepad")}
            className="font-medium w-auto p-2 lg:relative lg:top-[20vh] lg:left-[42.5vw] text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Go To Notepad →
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminPage;