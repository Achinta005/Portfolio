"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, removeAuthToken } from "../app/lib/auth";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(isAuthenticated());

    // Listen for storage changes to update login state
    const handleStorageChange = () => {
      setIsLoggedIn(isAuthenticated());
    };

    window.addEventListener("storage", handleStorageChange);

    // Also check periodically for manual token updates
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

  //close hamberger menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current &&
      !buttonRef.current.contains(event.target) &&
      menuRef.current &&
      !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    removeAuthToken();
    setIsLoggedIn(false);
    router.push("/");
  };

  const handleAdminClick = () => {
    if (isLoggedIn) {
      router.push("/admin");
    } else {
      router.push("/login");
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              <span className="font-pacifico">Welcome</span>
            </Link>

            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
              >
                About
              </Link>
              <Link
                href="/projects"
                className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Projects
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Contact
              </Link>
              <Link
                href="/work-with-me"
                className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Work With Me
              </Link>
              <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
            </nav>

            <button className="md:hidden">
              <i className="ri-menu-line text-2xl"></i>
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            <span className="font-pacifico">Welcome</span>
          </Link>

          <nav className="hidden md:flex space-x-8 items-center">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
            >
              About
            </Link>
            <Link
              href="/projects"
              className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Projects
            </Link>
            <Link
              href="/blog"
              className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
            >
            Blogs
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Contact
            </Link>
            <Link
              href="/work-with-me"
              className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Work With Me
            </Link>

            {/* Authentication buttons */}
            {isLoggedIn ? (
              <>
                <button
                  onClick={handleAdminClick}
                  className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Admin Panel
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Login
              </button>
            )}
          </nav>

          {/* {HAM BUTTONS} */}
          
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)} ref={buttonRef}
          >
            <i className="ri-menu-line text-2xl"></i>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4 "ref={menuRef}>
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
              >
                About
              </Link>
              <Link
                href="/projects"
                className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Projects
              </Link>
              <Link
                href="/blog"
                className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Blogs
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Contact
              </Link>
              <Link
                href="/work-with-me"
                className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Work With Me
              </Link>

              {/* Mobile authentication buttons */}
              <div className="pt-4 border-t border-gray-200">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={handleAdminClick}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors mb-2 relative left-[35vw]"
                    >
                      Admin Panel
                    </button>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors relative left-[35vw]"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors relative left-[35vw]"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
