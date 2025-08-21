"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setAuthToken, getAuthToken } from "../lib/auth"; // Assuming this file exists from your code
import React, { Suspense } from "react";
import OAuth from "./oAuth";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "../lib/util";

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
    <div className="min-h-screen flex items-center justify-center">
      <Link
        href="/"
        className="mb-4 px-4 py-2 bg-white/20 text-white rounded hover:bg-white/60 absolute top-2 left-2"
      >
        HOME
      </Link>
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-100 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-200">Sign in to access your admin panel</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <LabelInputContainer>
              <Label
                htmlFor="username"
                className="block text-sm font-medium mb-1"
              >
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required                
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </LabelInputContainer>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
            <BottomGradient />
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

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

export default LoginPage;
