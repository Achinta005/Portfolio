"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, removeAuthToken } from "../app/lib/auth";
import { FloatingDock } from "./ui/floatingdock";
import {
  IconLogin,
  IconAddressBook,
  IconArticle,
  IconHome,
  IconCertificate,
  IconUser,
  IconDashboard,
  IconLogin2
} from "@tabler/icons-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());

    const handleStorageChange = () => setIsLoggedIn(isAuthenticated());
    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(() => {
      const newLoginState = isAuthenticated();
      if (newLoginState !== isLoggedIn) {
        setIsLoggedIn(newLoginState);
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = () => router.push("/login");

  const handleLogout = () => {
    removeAuthToken();
    setIsLoggedIn(false);
    router.push("/");
  };

  const handleAdminClick = () => router.push("/admin");

  // Base navigation links
  const baseLinks = [
    {
      title: "HOME",
      icon: (
        <IconHome className="h-full w-full text-purple-800" />
      ),
      href: "/",
    },
    {
      title: "ABOUT",
      icon: (
        <IconUser className="h-full w-full text-purple-800" />
      ),
      href: "/about",
    },
    {
      title: "PROJECTS",
      icon: (
        <IconCertificate className="h-full w-full text-purple-800" />
      ),
      href: "/projects",
    },
    {
      title: "BLOGS",
      icon: (
        <IconArticle className="h-full w-full text-purple-800" />
      ),
      href: "/blog",
    },
    {
      title: "CONTACTS",
      icon: (
        <IconAddressBook className="h-full w-full text-purple-800" />
      ),
      href: "/contact",
    },
  ];

  // Dynamic auth links based on login state
  const authLinks = isLoggedIn
    ? [
        {
          title: "ADMIN PANEL",
          icon: (
            <IconDashboard className="h-full w-full text-purple-800" />
          ),
          href: "/admin",
          onClick: handleAdminClick,
        },
        {
          title: "LOGOUT",
          icon: (
            <IconLogin2 className="h-full w-full text-purple-800" />
          ),
          onClick: handleLogout,
        },
      ]
    : [
        {
          title: "LOGIN",
          icon: (
            <IconLogin className="h-full w-full text-purple-800" />
          ),
          href: "/login",
          onClick: handleLogin,
        },
      ];

  // Combine base links with auth links
  const links = [...baseLinks, ...authLinks];

  return (
    <header className="bg-transparent lg:fixed top-0 z-50 right-0">
      <div className="fixed bottom-0 left-0 w-full flex items-center justify-center">
        <FloatingDock mobileClassName="translate-y-20" items={links} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Hamburger menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            ref={buttonRef}
          >
            <i className="ri-menu-line text-2xl dark:text-amber-50"></i>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4" ref={menuRef}>
            <div className="flex flex-col space-y-4">
              <div className="flex gap-10">
                <Link
                  href="#home"
                  className="hover:underline text-gray-700 dark:text-gray-100 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Home
                </Link>
                <Link
                  href="#about"
                  className="hover:underline text-gray-700 dark:text-gray-100 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  About
                </Link>
                <Link
                  href="#projects"
                  className="hover:underline text-gray-700 dark:text-gray-100 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Projects
                </Link>
              </div>
              <div className="flex gap-10">
                <Link
                  href="#blogs"
                  className="hover:underline text-gray-700 dark:text-gray-100 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Blogs
                </Link>
                <Link
                  href="#contact"
                  className="hover:underline text-gray-700 dark:text-gray-100 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
