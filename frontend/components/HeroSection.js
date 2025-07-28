"use client";
import Image from "next/image";

import Link from "next/link";

export default function HeroSection() {
  const handleDownload = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/download/resume`
      );

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
        className="absolute inset-0 bg-cover md:bg-center bg-no-repeat dark:hidden"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dc1fkirb4/image/upload/v1753725224/4aef09407787d130f312a623ab753ea9_vfacg7.jpg')`,
        }}
      >
        <div className="absolute dark:hidden inset-0 bg-white/80"></div>
      </div>
      <div
        className="absolute inset-0 bg-cover md:bg-center bg-no-repeat dark:block hidden"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dc1fkirb4/image/upload/v1753586063/nikita-kachanovsky-OVbeSXRk_9E-unsplash_rk0yhg.jpg`,
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="lg:text-[3.4rem] text-3xl mt-4 lg:mt-0 font-bold text-gray-900 mb-6 w-2xl overflow-hidden whitespace-nowrap border-r-4 border-white pr-5 animate-typing dark:text-gray-100">
              Hi, I&apos;m <span className="text-blue-600">Achinta Hazra</span>
            </h1>

            <h2 className="text-xl lg:text-3xl text-gray-700 mb-6 dark:text-gray-200">
              Full Stack Developer
            </h2>
            <p className=" text-gray-600 mb-8 max-w-xl lg:text-gray-600 lg:text-lg animate-jump-in dark:text-gray-400">
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
                className="border-2 border-blue-600 text-blue-600 dark:text-white px-8 py-3 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer whitespace-nowrap transition-transform  duration-300 ease-in-out hover:scale-105"
              >
                Download My Resume
              </button>

              <Link
                href="/contact"
                className="border-2 border-blue-600 text-blue-600 dark:text-white px-8 py-3 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer whitespace-nowrap transition-transform  duration-300 ease-in-out hover:scale-105"
              >
                Get In Touch
              </Link>
            </div>
          </div>

          <div className="relative w-80 h-80 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 lg:left-[15vw]">
            {/* Decorative circle */}
            <div className="absolute -inset-1 w-[calc(100%+0.5rem)] h-[calc(100%+0.5rem)] rounded-full border-4 border-dotted border-white bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 shadow-2xl animate-spin hover:brightness-125 hover:shadow-[0_0_40px_rgba(255,255,100,0.6)] transition"></div>

            {/* Profile Image */}
            <div className="relative z-10 w-full h-full">
              <Image
                src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1753025128/profile_lz4yry.jpg"
                alt="A professional headshot"
                className="w-full h-full rounded-full object-cover object-center shadow-2xl"
                width={320}
                height={320}
                priority
              />
              <div className=" absolute -bottom-1 -right-1 bg-blue-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center text-2xl">
                <i className="ri-code-s-slash-line" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
