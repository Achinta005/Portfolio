"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { PortfolioApiService } from "@/services/PortfolioApiService";
import { motion } from "framer-motion";

const generateLineStyles = () =>
  Array.from({ length: 20 }, () => ({
    style: {
      width: `${Math.random() * 200 + 100}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      rotate: `${Math.random() * 180}deg`,
    },
    transition: {
      duration: 3 + Math.random() * 2,
      repeat: Infinity,
      delay: Math.random() * 2,
    },
  }));
const generateParticleStyles = () =>
  Array.from({ length: 15 }, () => ({
    style: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    },
    transition: {
      duration: 4 + Math.random() * 2,
      repeat: Infinity,
      delay: Math.random() * 3,
    },
  }));

export default function BlogPost({ params }) {
  const unwrappedParams = React.use(params);
  const slug = unwrappedParams.slug;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lineStyles, setLineStyles] = useState([]);
  const [particleStyles, setParticleStyles] = useState([]);

  // Generate styles client-side only
  useEffect(() => {
    setLineStyles(generateLineStyles());
    setParticleStyles(generateParticleStyles());
  }, []);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const postData = await PortfolioApiService.FetchBlogBySlug(slug);
        if (!postData) {
          notFound();
        }
        setPost(postData);
      } catch (err) {
        setError("Failed to load blog post");
        console.error("Error loading post:", err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-900">
            <div className="p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-32 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-900">
            <div className="p-8">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
              <p className="text-gray-600 dark:text-gray-300">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 -m-8">
      <div className="hidden lg:block absolute inset-0 overflow-hidden">
        {lineStyles.map((item, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute bg-gradient-to-r from-transparent via-purple-400/20 to-transparent h-px"
            style={item.style}
            animate={{
              opacity: [0, 1, 0],
              scaleX: [0, 1, 0],
            }}
            transition={item.transition}
          />
        ))}
      </div>
      <div className="hidden lg:block absolute inset-0">
        {particleStyles.map((item, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={item.style}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
            }}
            transition={item.transition}
          />
        ))}
      </div>
      <div className="max-w-4xl mx-auto px-4 py-6 relative z-10">
        <Link
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        <article className="overflow-visible bg-white/5 rounded-lg lg:rounded-2xl backdrop-blur-xl h-full lg:h-full min-h-0 relative border border-purple-500/20 lg:border-purple-500/20 shadow-2xl shadow-purple-500/10 p-10">
          <div className="p-8">
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-4">
                {post.title}
              </h1>
              <div className="flex items-center text-green-500 mb-4 ">
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
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/5 text-amber-500 text-sm rounded-full "
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>
            <div className="prose prose-lg max-w-none prose-headings:text-white rounded-xl p-6">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>
        </article>

        {/* Social sharing and navigation */}
        <div className="mt-12 p-6 overflow-visible bg-white/5 rounded-lg lg:rounded-2xl backdrop-blur-xl h-full lg:h-full min-h-0 relative border border-purple-500/20 lg:border-purple-500/20 shadow-2xl shadow-purple-500/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-cyan-500">Share this post</h3>
              <div className="flex space-x-4">
                <button className="text-green-600 hover:text-green-800 transition-colors bg-white/5 border-2 border-purple-600 px-3 py-1 rounded-lg">
                  Twitter
                </button>
                <button className="text-green-600 hover:text-green-800 transition-colors bg-white/5 border-2 border-purple-600 px-3 py-1 rounded-lg">
                  LinkedIn
                </button>
                <button className="text-green-600 hover:text-green-800 transition-colors bg-white/5 border-2 border-purple-600 px-3 py-1 rounded-lg">
                  Copy Link
                </button>
              </div>
            </div>

            <Link
              href="/blog"
              className="bg-white/5 border-2 border-purple-600 text-orange-500 px-6 py-2 rounded-lg hover:text-orange-700 transition-colors relative -bottom-4green"
            >
              View All Posts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
