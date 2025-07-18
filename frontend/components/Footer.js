'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 font-pacifico">Achinta Hazra</h3>
            <p className="text-gray-400">
              Building amazing digital experiences with passion and creativity.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors cursor-pointer block">
                Home
              </Link>
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors cursor-pointer block">
                About
              </Link>
              <Link href="/projects" className="text-gray-400 hover:text-white transition-colors cursor-pointer block">
                Projects
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors cursor-pointer block">
                Contact
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/in/achinta-hazra?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-linkedin-fill"></i>
                </div>
              </a>
              <a href="https://github.com/Achinta005" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-github-fill"></i>
                </div>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-twitter-fill"></i>
                </div>
              </a>
              <a href="mailto:achintahazra8515@gmail.com" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-mail-fill"></i>
                </div>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Portfolio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}