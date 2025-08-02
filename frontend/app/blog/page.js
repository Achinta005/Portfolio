import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { getAllPosts } from "../lib/blog";
import { motion, easeOut } from "framer-motion";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen ">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <motion.div
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: easeOut }}
          >
            <h1 className="text-4xl font-bold text-yellow-100 mb-4 ">Blog</h1>
            <span></span>
          </motion.div>
          <motion.div
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -200 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: easeOut }}
          >
            <p className="relative text-lg font-semibold lg:left-[12vw] text-gray-800 max-w-2xl">
              Thoughts on web development, technology, and building great user
              experiences.
            </p>
            <span></span>
          </motion.div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <motion.div
              key={post.slug}
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: easeOut }}
            >
              <article className="bg-white/20 border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-800 mb-3">
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

                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-gray-800 mb-4 leading-relaxed line-clamp-3 dark:text-gray-400">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-white/60 text-gray-700 text-xs rounded-full dark:bg-gray-400 dark:text-black"
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
                <span></span>
              </article>
            </motion.div>
          ))}
        </div>

        {/* Pagination placeholder */}
        <div className="mt-12 flex justify-center">
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
              1
            </button>
            <button className="px-4 py-2 bg-white/20 text-gray-700 rounded-md hover:bg-gray-300">
              2
            </button>
            <button className="px-4 py-2 bg-white/20 text-gray-700 rounded-md hover:bg-gray-300">
              3
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
