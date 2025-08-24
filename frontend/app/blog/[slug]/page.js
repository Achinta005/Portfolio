"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { getPostBySlug } from "../../lib/blog";

export default function BlogPost({ params }) {
   const unwrappedParams = React.use(params);
  const slug = unwrappedParams.slug;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const postData = await getPostBySlug(slug);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link 
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>
        
        <article className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-900">
          <div className="p-8">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 dark:text-gray-100">
                {post.title}
              </h1>
              
              <div className="flex items-center text-gray-600 mb-4 dark:text-gray-300">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
                <Clock className="w-4 h-4 ml-4 mr-2" />
                <span>{post.readTime}</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full dark:bg-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>
            
            <div className="prose prose-lg max-w-none dark:text-gray-200">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>
        </article>
        
        {/* Social sharing and navigation */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6 dark:bg-gray-900">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">Share this post</h3>
              <div className="flex space-x-4">
                <button className="text-blue-600 hover:text-blue-800 transition-colors">
                  Twitter
                </button>
                <button className="text-blue-600 hover:text-blue-800 transition-colors">
                  LinkedIn
                </button>
                <button className="text-blue-600 hover:text-blue-800 transition-colors">
                  Copy Link
                </button>
              </div>
            </div>
            
            <Link 
              href="/blog"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              View All Posts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}