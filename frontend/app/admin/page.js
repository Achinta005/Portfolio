"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Project from "./Project";
import ContactResponse from "./ContactResponse";

const AdminPage = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // This is the core authentication logic
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      // 1. First, check if a token exists on the client side.
      // If not, redirect immediately without a server request.
      if (!token) {
        router.push("/login");
        return; // Stop execution
      }

      // 2. If a token exists, verify it with the backend.
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/api/auth/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user); // Set the user's username from the response
        } else {
          // Handle cases where the token is invalid or expired (e.g., 401, 403)
          localStorage.removeItem("token"); // Clear the bad token
          setError("Your session has expired. Please log in again.");
          router.push("/login");
        }
      } catch (err) {
        // Handle network errors or other fetch-related issues
        console.error("Authentication check failed:", err);
        setError("Failed to connect to the server. Please try again later.");
      } finally {
        // This is crucial: always stop loading, regardless of outcome
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // If projects view is active, render the Projects component
  if (activeView === "projects") {
    return (
      <div>
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

  // If messages view is active, render the ContactResponse component
  if (activeView === "messages") {
    return (
      <div>
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

  // Loading State: Display while the token is being validated
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Error State: Display if authentication fails after the loading phase
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Main Dashboard View (rendered only after successful auth)
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your website content and settings
          </p>
        </div>

        {user && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Welcome back, {user}!
            </h2>
            <p className="text-gray-600">
              You have successfully accessed the admin panel.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
            <p className="text-gray-600 mb-4">Manage your portfolio projects</p>
            <button
              className="text-blue-600 hover:text-blue-800 font-medium"
              onClick={() => setActiveView("projects")}
            >
              Manage Projects →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
            <p className="text-gray-600 mb-4">View contact form submissions</p>
            <button
              className="text-green-600 hover:text-green-800 font-medium"
              onClick={() => setActiveView("messages")}
            >
              View Messages →
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <i className="ri-file-add-line text-blue-600 text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  New project added
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <i className="ri-mail-line text-green-600 text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  New contact message
                </p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <i className="ri-edit-line text-yellow-600 text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Profile updated
                </p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
