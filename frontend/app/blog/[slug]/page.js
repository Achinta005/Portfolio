
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { getPostBySlug, getAllPosts } from '../../lib/blog';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPost({ params }) {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link 
          href="/#blogs"
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