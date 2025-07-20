"use client";
import Image from "next/image";

import Link from "next/link";

export default function HeroSection() {

  const handleDownload = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/download/resume`);

    if (!response.ok) throw new Error("Download failed");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = "Achinta_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Error downloading:", err);
  }
};



  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover md:bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20minimalist%20professional%20workspace%20setup%20with%20clean%20desk%2C%20laptop%2C%20plants%2C%20and%20soft%20natural%20lighting%20creating%20a%20peaceful%20productive%20environment%20with%20warm%20tones%20and%20contemporary%20design%20elements%20suitable%20for%20creative%20professional&width=1920&height=1080&seq=hero-bg-001&orientation=landscape')`,
        }}
      >
        <div className="absolute inset-0 bg-white/80"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="lg:text-6xl text-3xl mt-4 lg:mt-0 font-bold text-gray-900 mb-6 w-2xl">
              Hi, I&apos;m <span className="text-blue-600">Achinta Hazra</span>
            </h1>
            <h2 className="text-xl lg:text-3xl text-gray-700 mb-6">
              Full Stack Developer
            </h2>
            <p className=" text-gray-600 mb-8 max-w-xl lg:text-gray-600 lg:text-lg">
              I&apos;m a Full Stack Web Developer with a passion for building
              dynamic, user-friendly, and scalable web applications. I
              specialize in creating end-to-end solutions using modern
              technologies across both frontend and backend. From crafting
              responsive interfaces to developing robust APIs, I love turning
              ideas into real-world digital products. I&apos;m always exploring
              new tools and frameworks to improve my craft and deliver clean,
              efficient code.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleDownload}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer whitespace-nowrap shadow-md hover:shadow-lg active:scale-95 transition transform duration-200 ease-in-out"
              >
                Download My Resume
              </button>
              <Link
                href="/contact"
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                Get In Touch
              </Link>
            </div>
          </div>

          <div className="lg:flex relative bottom-5 right-2 lg:justify-end">
            <div className="relative">
              <Image
                src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1753025128/profile_lz4yry.jpg"
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
