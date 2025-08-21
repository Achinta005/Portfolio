"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken, removeAuthToken, getAuthToken } from "../lib/auth";
import Project from "./Project";
import ContactResponse from "./ContactResponse";
import Notepad from "./Notepad";
import Image from "next/image";

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
      <div className="p-4 bg-gradient-to-tr from-blue-700 via-pink-600 to-yellow-300 ">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2 cursor-pointer bg-white/40 backdrop-blur-3xl text-white rounded hover:bg-white/20"
        >
          ← Back to Dashboard
        </button>
        <Project />
      </div>
    );
  }

  if (user.role === "admin" && activeView === "messages") {
    return (
      <div className="p-6 bg-[url(https://res.cloudinary.com/dc1fkirb4/image/upload/v1755757547/response_arjl1x.webp)] bg-cover">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2 bg-white/20 backdrop-blur-3xl text-black cursor-pointer rounded hover:bg-white/20"
        >
          ← Back to Dashboard
        </button>
        <ContactResponse />
      </div>
    );
  }
  if (user.role === "admin" && activeView === "Notepad") {
    return (
      <div className="p-8 bg-[url(https://res.cloudinary.com/dc1fkirb4/image/upload/v1755758676/notepad_e5ey08.jpg)] bg-cover">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2 bg-white/10 backdrop-blur-3xl text-white cursor-pointer rounded hover:bg-white/20"
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
    <div className="min-h-screen bg-[url(https://wallpapers.com/images/hd/desktop-background-6v9qjuvtrckgn4mm.jpg)] bg-cover bg-center h-64 w-full">
      <div className="container mx-auto px-4 py-8">
        <header className="grid grid-cols-3 gap-64 mb-8">
          <div className="bg-white/10 backdrop-blur-2xl w-64 p-2.5 rounded-lg">
            <p className="text-green-500 font-bold text-xl text-nowrap text-center">
              Welcome {user.username}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-2xl p-1 rounded-lg">
            <h1 className="text-3xl font-bold text-gray-100 text-center">Dashboard</h1>
          </div>
          <div>
            <button
              onClick={handleLogout}
              className="bg-red-400 text-white rounded-lg hover:bg-red-500 p-2"
            >
              Logout
            </button>
          </div>
        </header>

        {fetchError && <p className="text-red-500 mb-4">{fetchError}</p>}
        {/* Only for Admin--> */}
        {user.role === "admin" && (
          <div className="grid grid-cols-3 gap-6 rounded-lg shadow-2xl p-6 h-[50vh]">
            <div className="bg-white/20 rounded-lg p-3 backdrop-blur-3xl grid grid-cols-1 place-items-center">
              <div>
                <Image
                  src="/a1.jpg"
                  alt="project img"
                  width={300}
                  height={30}
                  className="rounded-lg border-2 border-white"
                />
              </div>
              <button
                className="relative inline-flex h-7 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 top-1.5"
                onClick={() => setActiveView("projects")}
              >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-800 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                  Manage Projects →
                </span>
              </button>
            </div>
            <div className="bg-white/20 rounded-lg backdrop-blur-3xl grid grid-cols-1 place-items-center">
              <div className="w-[350px] h-[170px]">
                <Image
                  src="/a2.png"
                  alt="responses"
                  width={170}
                  height={30}
                  className="w-full h-[200px] object-contain border-2 border-white p-1.5 rounded-lg"
                />
              </div>
              <button
                className="relative inline-flex h-7 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 top-1.5"
                onClick={() => setActiveView("messages")}
              >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-800 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                  View Messages →
                </span>
              </button>
            </div>
            <div className="bg-white/20 rounded-lg backdrop-blur-3xl grid grid-cols-1 place-items-center">
              <div>
                <Image
                  src="/a3.jpeg"
                  alt="Notepad"
                  width={300}
                  height={100}
                  className="border-2 border-white rounded-lg mt-4"
                />
              </div>
              <button
                className="relative inline-flex h-7 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 mb-0.5"
                onClick={() => setActiveView("Notepad")}
              >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-800 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                  Go To Notepad →
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Only for Editor(user)--> */}
        {user.role === "editor" && (
          <div className="bg-white/20 rounded-lg backdrop-blur-3xl w-52 p-2 grid grid-cols-1">
              <div>
                <Image
                  src="/a3.jpeg"
                  alt="Notepad"
                  width={300}
                  height={150}
                  className="object-contain border-2 border-white p-1.5 rounded-lg"
                />
              </div>
              <button
                className="relative inline-flex h-7 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 top-1"
                onClick={() => setActiveView("Notepad")}
              >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-800 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                  Go To Notepad →
                </span>
              </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
