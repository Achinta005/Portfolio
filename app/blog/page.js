"use client";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { motion, easeOut } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Header from "@/components/Navbar";
import { PortfolioApiService } from "@/services/PortfolioApiService";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [view, setView] = useState(1);

  // Fetch posts from API
  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const postsData = await PortfolioApiService.FetchAllBlogs();
        setPosts(postsData);
      } catch (err) {
        setError("Failed to load blog posts");
        console.error("Error loading posts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    async function loadVanta() {
      if (!window.VANTA) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src =
            "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js";
          script.onload = resolve;
          document.body.appendChild(script);
        });
      }

      if (!vantaEffect && window.VANTA && vantaRef.current) {
        setVantaEffect(
          window.VANTA.NET({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            backgroundColor: 0x0,
            points: 20.0,
            maxDistance: 10.0,
            spacing: 20.0,
          })
        );
      }
    }

    loadVanta();

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  if (loading) {
    return (
      <>
        <div
          ref={vantaRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: -1,
            overflow: "hidden",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="min-h-screen mb-16">
            <div className="max-w-6xl mx-auto px-6 pt-5">
              <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-yellow-100 mb-4">
                  Blog
                </h1>
                <p className="relative text-lg font-semibold lg:left-[17vw] text-gray-200 max-w-2xl">
                  Loading blog posts...
                </p>
              </div>
            </div>
          </div>
          <Header />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div
          ref={vantaRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: -1,
            overflow: "hidden",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="min-h-screen mb-16">
            <div className="max-w-6xl mx-auto px-6 pt-5">
              <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-yellow-100 mb-4">
                  Blog
                </h1>
                <p className="relative text-lg font-semibold lg:left-[12vw] text-red-400 max-w-2xl">
                  {error}
                </p>
              </div>
            </div>
          </div>
          <Header />
        </div>
      </>
    );
  }

  return (
    <>
      <div
        ref={vantaRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
          overflow: "hidden",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="min-h-screen mb-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-12 text-center">
              <motion.div
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: easeOut }}
              >
                <h1 className="text-3xl font-bold text-yellow-100 mb-1">
                  Blog
                </h1>
                <span></span>
              </motion.div>
              <motion.div
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -200 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: easeOut }}
              >
                <p className="relative text-md font-semibold lg:left-[15vw] text-gray-200 max-w-2xl">
                  Thoughts on web development, technology, and building great
                  user experiences.
                </p>
                <span></span>
              </motion.div>
            </div>
            <div className="bg-white/5 rounded-lg lg:rounded-2xl backdrop-blur-xl h-full lg:h-full min-h-0 relative border border-purple-500/20 lg:border-purple-500/20 shadow-2xl shadow-purple-500/10 p-10 -mt-10">
              <div className="hidden lg:block absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-purple-400/50 rounded-tl-lg"></div>
              <div className="hidden lg:block absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-purple-400/50 rounded-tr-lg"></div>
              <div className="hidden lg:block absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-purple-400/50 rounded-bl-lg"></div>
              <div className="hidden lg:block absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-purple-400/50 rounded-br-lg"></div>
              <div className="flex items-center space-x-2 relative -top-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.slice((view - 1) * 3, view * 3).map((post, index) => (
                  <motion.div
                    key={`${post.slug}-${index}`}
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: easeOut }}
                  >
                    <article className="bg-white/10 border border-green-400 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
                      <div className="p-6">
                        <div className="flex items-center text-sm text-green-600 mb-3">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            {new Date(post.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                          <Clock className="w-4 h-4 ml-4 mr-2" />
                          <span>{post.readTime}</span>
                        </div>

                        <h2 className="text-xl font-bold text-amber-500 mb-3 line-clamp-2">
                          {post.title}
                        </h2>

                        <p className="text-teal-300 mb-4 leading-relaxed line-clamp-3 ">
                          {post.excerpt}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-white/5 text-lime-500 text-xs font-semibold rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
                        >
                          Read more
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    </article>
                  </motion.div>
                ))}
              </div>

              {posts.length === 0 && !loading && (
                <div className="text-center text-gray-400 mt-12">
                  <p>No blog posts found.</p>
                </div>
              )}

              {/* Pagination placeholder */}
              {posts.length > 0 && (
                <div className="mt-6 flex justify-center">
                  <div className="flex space-x-2">
                    {Array.from({ length: Math.ceil(posts.length / 3) }).map(
                      (_, i) => (
                        <button
                          key={i + 1}
                          className={`px-4 py-2 rounded-md border-purple-400/50 border-2 cursor-pointer ${
                            view === i + 1
                              ? "bg-fuchsia-500 text-white"
                              : "bg-white/10 text-green-300 hover:bg-purple-600/70 hover:text-green-500"
                          }`}
                          onClick={() => setView(i + 1)}
                        >
                          {i + 1}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Header />
      </div>
    </>
  );
}
