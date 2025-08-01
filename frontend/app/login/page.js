"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setAuthToken, getAuthToken } from "../lib/auth"; // Assuming this file exists from your code
import Image from "next/image";
import React, { Suspense } from "react";
import OAuth from "./oAuth";
import Link from "next/link";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    {
    }
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Assuming setToken saves the token to localStorage
        // e.g., localStorage.setItem('token', token);
        if (typeof setToken === "function") {
          setAuthToken(data.token);
        } else {
          localStorage.setItem("token", data.token);
        }
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
      <Link
        href="/"
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 absolute top-2 left-2"
      >
        HOME
      </Link>
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 dark:text-gray-100">
            Welcome Back
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Sign in to access your admin panel
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-purple-700 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 text-purple-700 rounded-md placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-green-600 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-green-600 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium dark:text-white bg-gray-300 dark:bg-blue-600 hover:bg-gray-400 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <Suspense fallback={<div>Loading dashboard...</div>}>
          <OAuth />
        </Suspense>
        {/* --- THIS IS THE FIX --- */}
        <div className="text-center">
          <button
            // This onClick handler is the crucial part
            onClick={() => router.push("/Register")}
            className="text-blue-600 dark:text-blue-700 hover:text-blue-800 text-sm font-medium"
          >
            Don&apos;t have an account? Register now
          </button>
        </div>
        {/* ----------------------- */}
      </div>
    </div>
  );
};

export default LoginPage;
