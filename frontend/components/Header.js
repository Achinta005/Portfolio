'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            <span className="font-pacifico">Welcome</span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
              About
            </Link>
            <Link href="/projects" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
              Projects
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
              Contact
            </Link>
            <Link href="/work-with-me" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
              Work With Me
            </Link>
            <Link href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
              Admin
            </Link>
          </nav>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className="ri-menu-line text-2xl"></i>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                Home
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                About
              </Link>
              <Link href="/projects" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                Projects
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                Contact
              </Link>
              <Link href="/work-with-me" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                Work With Me
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}