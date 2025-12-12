"use client";
import { useState, useEffect } from "react";
import { easeOut, motion } from "framer-motion";
import { CardItem, CardBody, CardContainer } from "@/components/ui/3dCard";

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

export default function AboutHero() {
  const [lineStyles, setLineStyles] = useState([]);
  const [particleStyles, setParticleStyles] = useState([]);

  useEffect(() => {
    setLineStyles(generateLineStyles());
    setParticleStyles(generateParticleStyles());
  }, []);

  const stats = [
    {
      number: "15+",
      label: "Projects",
      mobileLabel: "Projects Completed",
      color: "text-green-400",
      icon: "🚀",
    },
    {
      number: "4+",
      label: "Years Learning",
      mobileLabel: "Years of Practical Learning",
      color: "text-blue-400",
      icon: "📚",
    },
    {
      number: "3+",
      label: "Team Works",
      mobileLabel: "Team Collaborations",
      color: "text-purple-400",
      icon: "👥",
    },
    {
      number: "35+",
      label: "Technologies",
      mobileLabel: "Technologies Mastered",
      color: "text-yellow-400",
      icon: "⚡",
    },
  ];

  return (
    <section className="relative p-1 min-h-screen lg:h-screen py-4 sm:py-6 md:py-8 lg:py-0 overflow-hidden bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center">
      {/* Animated Lines Background */}
      <div className="hidden md:block absolute inset-0 overflow-hidden">
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

      {/* Floating Particles */}
      <div className="hidden md:block absolute inset-0">
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

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 w-full relative z-10">
        <div className="bg-white/10 sm:bg-white/8 md:bg-white/6 lg:bg-white/5 rounded-lg sm:rounded-xl lg:rounded-2xl backdrop-blur-xl min-h-[calc(100vh-2rem)] sm:min-h-[calc(100vh-3rem)] lg:h-[calc(100vh-2rem)] flex flex-col relative border border-purple-500/30 sm:border-purple-500/25 md:border-purple-500/20 shadow-xl sm:shadow-2xl shadow-purple-500/20 sm:shadow-purple-500/15 md:shadow-purple-500/10">
          {/* Corner Decorations - Desktop Only */}
          <div className="hidden lg:block absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-purple-400/50 rounded-tl-lg"></div>
          <div className="hidden lg:block absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-purple-400/50 rounded-tr-lg"></div>
          <div className="hidden lg:block absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-purple-400/50 rounded-bl-lg"></div>
          <div className="hidden lg:block absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-purple-400/50 rounded-br-lg"></div>

          {/* Floating Orbs */}
          <motion.div
            className="hidden md:block absolute top-10 sm:top-16 lg:top-20 left-10 sm:left-16 lg:left-20 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
          />

          <motion.div
            className="hidden md:block absolute bottom-10 sm:bottom-16 lg:bottom-20 right-10 sm:right-16 lg:right-20 w-20 sm:w-32 lg:w-40 h-20 sm:h-32 lg:h-40 bg-gradient-to-r from-green-600/20 to-purple-600/20 rounded-full blur-xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.2, 0.4],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: 1,
            }}
          />

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: easeOut }}
            className="text-center p-4 sm:p-6 lg:pt-14 lg:pb-0"
          >
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl font-bold text-transparent bg-gradient-to-r from-yellow-200 via-yellow-100 to-purple-200 bg-clip-text relative">
              About Me
              <div className="hidden lg:block absolute inset-0 text-xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl font-bold text-yellow-100/20 blur-sm">
                About Me
              </div>
            </h1>
          </motion.div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col lg:flex-row lg:items-center lg:justify-between px-3 sm:px-4 lg:px-8 xl:px-12 pb-3 lg:pb-36">
            {/* Desktop Layout */}
            <div className="hidden lg:flex flex-1 gap-8 xl:gap-12 items-center">
              {/* Text Content - Left Side */}
              <div className="flex-1 space-y-4 xl:space-y-5 max-w-xl">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "80px" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-0.5 bg-gradient-to-r from-purple-400 to-transparent mb-4"
                />

                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: easeOut }}
                  className="relative"
                >
                  <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-400/50 to-transparent rounded-full"></div>
                  <p className="text-xs xl:text-sm text-gray-200 leading-relaxed pl-2">
                    Hi, I am a Computer Science undergraduate with hands-on
                    experience in Machine Learning, Full-Stack Web Development,
                    and Generative AI. Skilled in developing, deploying scalable
                    systems integrating AI models with web technologies using
                    React, Node.js, Docker. I have a strong foundation in DSA,
                    OOP, DBMS, and System Design, enabling me to tackle complex
                    problems and deliver impactful Solutions.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: easeOut }}
                  className="relative"
                >
                  <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-blue-400/50 to-transparent rounded-full"></div>
                  <p className="text-xs xl:text-sm text-gray-200 leading-relaxed pl-2">
                    I thrive on turning complex problems into efficient
                    solutions. With experience in React, Tailwind CSS, Node.js,
                    Express, and databases like MongoDB and PostgreSQL, I
                    deliver end-to-end development. My grounding in OS, DBMS,
                    and Networking ensures reliability and performance in every
                    project.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, ease: easeOut }}
                  className="relative"
                >
                  <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-green-400/50 to-transparent rounded-full"></div>
                  <p className="text-xs xl:text-sm text-gray-200 leading-relaxed pl-2">
                    Currently, I am expanding my skills in Deep Learning, having
                    already worked with Machine Learning, NumPy, and Pandas for
                    data analysis. My next focus is to dive deeper into
                    Generative Ai,advanced optimization techniques. I am started
                    to exploring new technologies and sharpening my abilities to
                    solve real-world challenges.
                  </p>
                </motion.div>
              </div>

              {/* Image Card - Right Side */}
              <div className="flex-shrink-0 lg:ml-10 xl:ml-40">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
                  whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ duration: 1, ease: easeOut }}
                  whileHover={{ scale: 1.05, rotateY: -5 }}
                  className="relative"
                >
                  <CardContainer className="inter-var">
                    <CardBody className="bg-gradient-to-bl from-blue-600/80 to-purple-600/80 relative group/card dark:hover:shadow-2xl dark:hover:shadow-purple-500/[0.3] border-purple-400/30 w-64 xl:w-80 h-auto rounded-xl p-3 border backdrop-blur-sm">
                      <motion.div
                        className="absolute -top-2 -right-2 w-3 xl:w-4 h-3 xl:h-4 bg-yellow-400 rounded-full"
                        animate={{ y: [-5, 5, -5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute -bottom-2 -left-2 w-2 xl:w-3 h-2 xl:h-3 bg-green-400 rounded-full"
                        animate={{ y: [5, -5, 5] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: 1,
                        }}
                      />

                      <CardItem translateZ="50" className="w-full relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent rounded-xl"></div>
                        <img
                          src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1753025128/workspace_lyay7t.jpg"
                          height="250"
                          width="300"
                          className="h-40 xl:h-52 w-full object-cover rounded-xl group-hover/card:shadow-xl relative z-10"
                          alt="workspace thumbnail"
                        />
                      </CardItem>
                    </CardBody>
                  </CardContainer>

                  {/* Code Snippet - Below Card */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="mt-4 p-2 xl:p-3 bg-black/30 rounded-lg border border-purple-500/30 font-mono text-[10px] xl:text-xs text-green-400 backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div>
                      <span className="text-purple-400">const</span>{" "}
                      <span className="text-blue-400">developer</span> = {"{"}
                      <br />
                      &nbsp;&nbsp;
                      <span className="text-yellow-400">passion</span>:{" "}
                      <span className="text-green-400">
                        &quot;AI & ML&quot;, &quot;Full Stack&quot;
                      </span>
                      ,
                      <br />
                      &nbsp;&nbsp;
                      <span className="text-yellow-400">mission</span>:{" "}
                      <span className="text-green-400">
                        &quot;Innovation&quot;
                      </span>
                      <br />
                      {"}"};
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Tablet & Mobile Layout */}
            <div className="lg:hidden flex-1">
              <div className="max-w-4xl mx-auto">
                {/* Tablet Layout (md) */}
                <div className="hidden md:flex lg:hidden gap-8 items-start">
                  <div className="flex-1 space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, ease: easeOut }}
                    >
                      <p className="text-sm text-gray-200 mb-4">
                        Hi, I am a Computer Science undergraduate with hands-on
                        experience in Machine Learning, Full-Stack Web
                        Development, and Generative AI. Skilled in developing,
                        deploying scalable systems integrating AI models with
                        web technologies using React, Node.js, Docker. I have a
                        strong foundation in DSA, OOP, DBMS, and System Design,
                        enabling me to tackle complex problems and deliver
                        impactful Solutions.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, ease: easeOut }}
                    >
                      <p className="text-sm text-gray-200 mb-4">
                        I thrive on turning complex problems into efficient
                        solutions. With experience in React, Tailwind CSS,
                        Node.js, Express, and databases like MongoDB and
                        PostgreSQL, I deliver end-to-end development. My
                        grounding in OS, DBMS, and Networking ensures
                        reliability and performance in every project.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.7, ease: easeOut }}
                    >
                      <p className="text-sm text-gray-200 mb-6">
                        Currently, I am expanding my skills in Deep Learning,
                        having already worked with Machine Learning, NumPy, and
                        Pandas for data analysis. My next focus is to dive
                        deeper into Generative Ai,advanced optimization
                        techniques. I am started to exploring new technologies
                        and sharpening my abilities to solve real-world
                        challenges.
                      </p>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4">
                      {stats.map((stat, index) => (
                        <motion.div
                          key={`tablet-stat-${index}`}
                          initial={{ opacity: 0, scale: 0, x: -50 }}
                          whileInView={{ opacity: 1, scale: 1, x: 0 }}
                          transition={{
                            duration: 0.8,
                            ease: easeOut,
                            delay: index * 0.1,
                          }}
                          className="text-center p-3 bg-black/20 rounded-lg border border-purple-500/20 backdrop-blur-sm"
                        >
                          <div className="text-lg mb-1">{stat.icon}</div>
                          <h3
                            className={`text-xl font-bold ${stat.color} mb-1`}
                          >
                            {stat.number}
                          </h3>
                          <p className="text-gray-100 text-xs">
                            {stat.mobileLabel}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 max-w-sm">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1, ease: easeOut }}
                    >
                      <CardContainer className="inter-var">
                        <CardBody className="bg-gradient-to-bl from-blue-700 to-purple-600 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] border-black/[0.1] w-full h-auto rounded-xl p-3 border">
                          <CardItem translateZ="50" className="w-full">
                            <img
                              src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1753025128/workspace_lyay7t.jpg"
                              height="400"
                              width="400"
                              className="h-48 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                              alt="workspace thumbnail"
                            />
                          </CardItem>
                        </CardBody>
                      </CardContainer>
                    </motion.div>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden space-y-6">
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: easeOut }}
                    >
                      <p className="text-sm text-gray-200 mb-4">
                        Hi, I am a Computer Science undergraduate with hands-on
                        experience in Machine Learning, Full-Stack Web
                        Development, and Generative AI. Skilled in developing,
                        deploying scalable systems integrating AI models with
                        web technologies using React, Node.js, Docker. I have a
                        strong foundation in DSA, OOP, DBMS, and System Design,
                        enabling me to tackle complex problems and deliver
                        impactful Solutions.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: easeOut }}
                    >
                      <p className="text-sm text-gray-200 mb-4">
                        I thrive on turning complex problems into efficient
                        solutions. With experience in React, Tailwind CSS,
                        Node.js, Express, and databases like MongoDB and
                        PostgreSQL, I deliver end-to-end development. My
                        grounding in OS, DBMS, and Networking ensures
                        reliability and performance in every project.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease: easeOut }}
                    >
                      <p className="text-sm text-gray-200 mb-6">
                        Currently, I am expanding my skills in Deep Learning,
                        having already worked with Machine Learning, NumPy, and
                        Pandas for data analysis. My next focus is to dive
                        deeper into Generative Ai,advanced optimization
                        techniques. I am started to exploring new technologies
                        and sharpening my abilities to solve real-world
                        challenges.
                      </p>
                    </motion.div>
                  </div>

                  <div className="flex justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1, ease: easeOut }}
                      className="w-full max-w-sm"
                    >
                      <CardContainer className="inter-var">
                        <CardBody className="bg-gradient-to-bl from-blue-700 to-purple-600 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] border-black/[0.1] w-full h-auto rounded-xl p-2 border">
                          <CardItem translateZ="50" className="w-full">
                            <img
                              src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1753025128/workspace_lyay7t.jpg"
                              height="300"
                              width="300"
                              className="h-32 sm:h-40 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                              alt="workspace thumbnail"
                            />
                          </CardItem>
                        </CardBody>
                      </CardContainer>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={`mobile-stat-${index}`}
                        initial={{ opacity: 0, scale: 0, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                          duration: 0.8,
                          ease: easeOut,
                          delay: index * 0.1,
                        }}
                        className="text-center p-3 bg-black/20 rounded-lg border border-purple-500/20 backdrop-blur-sm"
                      >
                        <div className="text-lg mb-1">{stat.icon}</div>
                        <h3
                          className={`text-lg sm:text-xl font-bold ${stat.color} mb-1`}
                        >
                          {stat.number}
                        </h3>
                        <p className="text-gray-100 text-xs sm:text-sm">
                          {stat.mobileLabel}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Stats - Bottom Center (fixed, non-overlapping) */}
          <div className="hidden lg:block absolute bottom-6 left-1/12 transform">
            {/* Outer frosted container so stats sit on a single bar and don't overlap other UI */}
            <div className="px-3 py-2 bg-black/20 border border-purple-500/20 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="grid grid-cols-4 gap-3 xl:gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={`desktop-stat-${index}`}
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      duration: 0.7,
                      ease: easeOut,
                      delay: index * 0.08,
                    }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    className="relative flex items-center justify-center"
                  >
                    {/* subtle background blur/glow under each card */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/8 to-blue-600/8 rounded-lg blur-sm pointer-events-none" />

                    <div className="relative bg-black/30 p-2 xl:p-3 rounded-lg border border-purple-500/30 backdrop-blur-sm w-fit flex flex-col items-center ">
                      <div className="flex gap-2">
                        <div className="text-sm xl:text-base mb-1">
                          {stat.icon}
                        </div>
                        <h3
                          className={`text-base xl:text-xl font-bold ${stat.color} mb-1`}
                        >
                          {stat.number}
                        </h3>
                        <p className="text-gray-100 text-xs xl:text-sm whitespace-nowrap text-center font-mono mt-1.5">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Grid Background */}
          <div className="hidden md:block absolute inset-0 opacity-5 pointer-events-none">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
