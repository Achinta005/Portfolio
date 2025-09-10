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
  IconLogin2,
} from "@tabler/icons-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(isAuthenticated());
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleStorageChange = () => {
      setIsLoggedIn(isAuthenticated());
    };

    window.addEventListener("storage", handleStorageChange);

    // Check auth state periodically (reduced frequency)
    const interval = setInterval(() => {
      const newLoginState = isAuthenticated();
      if (newLoginState !== isLoggedIn) {
        setIsLoggedIn(newLoginState);
      }
    }, 5000); // Changed from 1000ms to 5000ms for better performance

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [isLoggedIn, mounted]);

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

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    try {
      removeAuthToken();
      setIsLoggedIn(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleAdminClick = () => {
    router.push("/admin");
  };

  // Base navigation links
  const baseLinks = [
    {
      title: "HOME",
      icon: <IconHome className="h-full w-full text-purple-800" />,
      href: "/",
    },
    {
      title: "ABOUT",
      icon: <IconUser className="h-full w-full text-purple-800" />,
      href: "/about",
    },
    {
      title: "PROJECTS",
      icon: <IconCertificate className="h-full w-full text-purple-800" />,
      href: "/projects",
    },
    {
      title: "BLOGS",
      icon: <IconArticle className="h-full w-full text-purple-800" />,
      href: "/blog",
    },
    {
      title: "CONTACTS",
      icon: <IconAddressBook className="h-full w-full text-purple-800" />,
      href: "/contact",
    },
  ];

  // Dynamic auth links based on login state
  const authLinks = isLoggedIn
    ? [
        {
          title: "ADMIN PANEL",
          icon: <IconDashboard className="h-full w-full text-purple-800" />,
          href: "/admin",
          onClick: handleAdminClick,
        },
        {
          title: "LOGOUT",
          icon: <IconLogin2 className="h-full w-full text-purple-800" />,
          onClick: handleLogout,
        },
      ]
    : [
        {
          title: "LOGIN",
          icon: <IconLogin className="h-full w-full text-purple-800" />,
          href: "/login",
          onClick: handleLogin,
        },
      ];

  // Combine base links with auth links
  const links = [...baseLinks, ...authLinks];

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <header className="bg-transparent">
      {/* Mobile Navbar (Vertical, bottom right corner) */}
      <div className="lg:hidden">
        <FloatingDock 
          mobileClassName="fixed bottom-6 right-6 z-50" 
          items={links} 
        />
      </div>

      {/* Desktop Navbar (Horizontal, bottom center) */}
      <div className="hidden lg:block">
        <FloatingDock 
          desktopClassName="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50" 
          items={links} 
        />
      </div>
    </header>
  );
}