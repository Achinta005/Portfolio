"use client";
import Image from "next/image";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20minimalist%20professional%20workspace%20setup%20with%20clean%20desk%2C%20laptop%2C%20plants%2C%20and%20soft%20natural%20lighting%20creating%20a%20peaceful%20productive%20environment%20with%20warm%20tones%20and%20contemporary%20design%20elements%20suitable%20for%20creative%20professional&width=1920&height=1080&seq=hero-bg-001&orientation=landscape')`,
        }}
      >
        <div className="absolute inset-0 bg-white/80"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 w-2xl">
              Hi, I&apos;m <span className="text-blue-600">Achinta Hazra</span>
            </h1>
            <h2 className="text-2xl lg:text-3xl text-gray-700 mb-6">
              Full Stack Developer
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-xl">
              I&apos;m a Full Stack Web Developer with a passion for building dynamic, user-friendly, and scalable web applications. I specialize in creating end-to-end solutions using modern technologies across both frontend and backend. From crafting responsive interfaces to developing robust APIs, I love turning ideas into real-world digital products. I&apos;m always exploring new tools and frameworks to improve my craft and deliver clean, efficient code.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/projects"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                Download My Resume
              </Link>
              <Link
                href="/contact"
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                Get In Touch
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <Image
                src="/images/profile.jpg"
                alt="Profile"
                className="w-80 h-80 rounded-full object-cover object-center shadow-2xl"
                width={320}
                height={320}
              />
              <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-full">
                <div className="w-8 h-8 flex items-center justify-center">
                  <i className="ri-code-s-slash-line text-2xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
