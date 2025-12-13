"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

/* ------------------ Background animation helpers ------------------ */
const generateLineStyles = () =>
  Array.from({ length: 18 }, () => ({
    style: {
      width: `${Math.random() * 240 + 160}px`,
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
  Array.from({ length: 14 }, () => ({
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

/* ------------------ Blog Post Component ------------------ */
export default function BlogPost({ post }) {
  const [lineStyles, setLineStyles] = useState([]);
  const [particleStyles, setParticleStyles] = useState([]);

  useEffect(() => {
    setLineStyles(generateLineStyles());
    setParticleStyles(generateParticleStyles());
  }, []);

  if (!post) return notFound();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 overflow-hidden">
      {/* ---------------- Animated background ---------------- */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        {lineStyles.map((item, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-purple-400/25 to-transparent"
            style={item.style}
            animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 0] }}
            transition={item.transition}
          />
        ))}
      </div>

      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        {particleStyles.map((item, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={item.style}
            animate={{ y: [-20, -120], opacity: [0, 1, 0] }}
            transition={item.transition}
          />
        ))}
      </div>

      {/* ---------------- Main Content Container ---------------- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
              text-blue-400 hover:text-blue-300
              bg-white/5 hover:bg-white/10
              border border-blue-500/20 hover:border-blue-500/40
              transition-all duration-300
              group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Blog</span>
          </Link>
        </motion.div>

        {/* ---------------- Article Card ---------------- */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative bg-gradient-to-br from-slate-900/90 via-blue-900/30 to-purple-900/40 
            backdrop-blur-xl border border-purple-500/30 rounded-2xl
            shadow-2xl shadow-purple-500/20
            overflow-hidden"
        >
          {/* Decorative gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          
          {/* Glassmorphism overlay effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-purple-500/5 pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Article Content */}
          <div className="relative z-10 px-6 sm:px-10 lg:px-16 py-10 lg:py-14">
            {/* Header Section */}
            <header className="mb-6 border-b border-white/20 pb-4">
              <motion.h5
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 
                  font-bold text-transparent bg-clip-text
                  bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400
                  leading-tight mb-6 drop-shadow-lg"
              >
                {post.title}
              </motion.h5>

              {/* Meta Information */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap items-center gap-6 text-sm sm:text-base mb-6"
              >
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 
                  px-2 py-1 rounded-lg border border-emerald-500/20">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>

                <div className="flex items-center gap-2 text-cyan-400 bg-cyan-500/10 
                  px-2 py-1 rounded-lg border border-cyan-500/20">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </motion.div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex flex-wrap gap-2"
                >
                  {post.tags.map((tag, index) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs sm:text-sm rounded-full
                        bg-gradient-to-r from-amber-500/20 to-orange-500/20
                        border border-amber-400/40
                        text-amber-300 font-medium
                        hover:border-amber-400/60 hover:from-amber-500/30 hover:to-orange-500/30
                        hover:shadow-lg hover:shadow-amber-500/20
                        transition-all duration-300 cursor-default
                        backdrop-blur-sm"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>
              )}
            </header>

            {/* Blog Content */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="blog-html prose prose-invert prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </motion.article>

        {/* Footer Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <Link
            href="/blog"
            className="px-6 py-3 rounded-lg text-sm font-medium
              bg-gradient-to-r from-purple-600/20 to-blue-600/20
              border border-purple-500/30
              text-purple-300 hover:text-purple-200
              hover:border-purple-400/50 hover:from-purple-600/30 hover:to-blue-600/30
              transition-all duration-300
              group flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            All Posts
          </Link>

          <div className="flex gap-3">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-6 py-3 rounded-lg text-sm font-medium
                bg-white/5 border border-orange-500/30
                text-orange-400 hover:text-orange-300
                hover:border-orange-400/50 hover:bg-white/10
                transition-all duration-300"
            >
              Back to Top
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}