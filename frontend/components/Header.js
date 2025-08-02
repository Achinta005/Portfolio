"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, removeAuthToken } from "../app/lib/auth";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // setMounted(true);
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

  return (
    <header className="bg-transparent dark:bg-gray-800 lg:dark:bg-transparent lg:fixed top-0 z-50 right-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex"
          ></Link>

          <nav className="hidden md:flex space-x-8 items-center ">
            <Link
              href="#home"
              className="dark:bg-white/10 bg-white/40 backdrop-blur-lg rounded-lg px-4 py-2 text-gray-800  dark:text-white font-semibold
               hover:bg-white/20 transition"
            >
              Home
            </Link>
            <Link
              href="#about"
              className="dark:bg-white/10 bg-white/40 backdrop-blur-lg rounded-lg px-4 py-2 text-gray-800  dark:text-white font-semibold
               hover:bg-white/20 transition"
            >
              About
            </Link>
            <Link
              href="#projects"
              className="dark:bg-white/10 bg-white/40 backdrop-blur-lg rounded-lg px-4 py-2 text-gray-800  dark:text-white font-semibold
               hover:bg-white/20 transition"
            >
              Projects
            </Link>
            <Link
              href="#blogs"
              className="dark:bg-white/10 bg-white/40 backdrop-blur-lg rounded-lg px-4 py-2 text-gray-800  dark:text-white font-semibold
               hover:bg-white/20 transition"
            >
              Blogs
            </Link>
            <Link
              href="#contact"
              className="dark:bg-white/10 bg-white/40 backdrop-blur-lg rounded-lg px-4 py-2 text-gray-800  dark:text-white font-semibold
               hover:bg-white/20 transition"
            >
              Contact
            </Link>
            {/* <Link
              href="/work-with-me"
              className="text-gray-700 dark:text-gray-100 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Work With Me
            </Link> */}

            {/* Authentication buttons */}
            {isLoggedIn ? (
              <>
                <button
                  onClick={handleAdminClick}
                  className=" bg-white/40 backdrop-blur-lg rounded-lg px-4 py-2 text-gray-800   font-semibold
               hover:bg-white/20 transition"
                >
                  Admin Panel
                </button>
                <button
                  onClick={handleLogout}
                  className=" bg-white/40 backdrop-blur-lg rounded-lg px-4 py-2 text-gray-800   font-semibold
               hover:bg-white/20 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className=" bg-white/40 backdrop-blur-lg rounded-lg px-4 py-2 text-gray-800   font-semibold
               hover:bg-white/20 transition"
              >
                Login
              </button>
            )}
          </nav>

          {/* {HAM BUTTONS} */}

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            ref={buttonRef}
          >
            <i className="ri-menu-line text-2xl dark:text-amber-50"></i>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4 " ref={menuRef}>
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
                {/* <Link
                href="/work-with-me"
                className="hover:underline text-gray-700 dark:text-gray-100 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Work With Me
              </Link> */}
              </div>

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
