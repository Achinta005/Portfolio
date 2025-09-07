"use client";
import { useState, useEffect } from "react";
import { easeOut, motion } from "framer-motion";
import { CardItem, CardBody, CardContainer } from "@/components/ui/3dCard";

// Precompute random styles and transition properties for lines and particles
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

  // Generate styles client-side only
  useEffect(() => {
    setLineStyles(generateLineStyles());
    setParticleStyles(generateParticleStyles());
  }, []);

  const stats = [
    {
      number: "10+",
      label: "Projects",
      mobileLabel: "Projects Completed",
      color: "text-green-400",
      icon: "🚀",
    },
    {
      number: "1+",
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
      number: "20+",
      label: "Technologies",
      mobileLabel: "Technologies Mastered",
      color: "text-yellow-400",
      icon: "⚡",
    },
  ];

  return (
    <section className="relative p-1 lg:h-screen min-h-screen py-8 lg:py-0 overflow-hidden bg-gradient-to-br from-gray-900 via-black to-purple-900">
      {/* Desktop Animated Background Lines */}
      <div className="hidden lg:block absolute inset-0 overflow-hidden">
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

      {/* Desktop Floating Particles */}
      <div className="hidden lg:block absolute inset-0">
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

      <div className="max-w-6xl mx-auto px-4 h-full relative z-10">
        <div className="bg-white/5 lg:bg-white/5 bg-white/10 rounded-lg lg:rounded-2xl backdrop-blur-xl h-full lg:h-full min-h-0 flex items-center justify-center relative border border-purple-500/20 lg:border-purple-500/20 border-transparent shadow-2xl shadow-purple-500/10">
          {/* Desktop Decorative Corner Elements */}
          <div className="hidden lg:block absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-purple-400/50 rounded-tl-lg"></div>
          <div className="hidden lg:block absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-purple-400/50 rounded-tr-lg"></div>
          <div className="hidden lg:block absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-purple-400/50 rounded-bl-lg"></div>
          <div className="hidden lg:block absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-purple-400/50 rounded-br-lg"></div>

          {/* Desktop Glowing Orbs */}
          <motion.div
            className="hidden lg:block absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-xl"
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
            className="hidden lg:block absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-green-600/20 to-purple-600/20 rounded-full blur-xl"
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

          {/* Main Content Container */}
          <div className="w-full h-full flex flex-col lg:block relative">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: easeOut }}
              className="lg:absolute lg:top-8 lg:left-1/2 lg:transform lg:-translate-x-1/2 mb-6 lg:mb-0 text-center lg:text-center p-8 lg:p-0"
            >
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-yellow-200 via-yellow-100 to-purple-200 bg-clip-text text-yellow-100 lg:text-transparent lg:bg-gradient-to-r lg:from-yellow-200 lg:via-yellow-100 lg:to-purple-200 lg:bg-clip-text relative">
                About Me
                <div className="hidden lg:block absolute inset-0 text-3xl font-bold text-yellow-100/20 blur-sm">
                  About Me
                </div>
              </h1>
            </motion.div>

            {/* Content Layout */}
            <div className="flex-1 flex flex-col lg:block lg:h-full">
              {/* Desktop Layout */}
              <div className="hidden lg:block">
                {/* Left Side - Text Content with Decorative Elements */}
                <div className="absolute left-8 top-20 w-1/2 space-y-4">
                  {/* Decorative Line */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100px" }}
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
                    <p className="text-sm text-gray-200 leading-relaxed pl-2 relative z-10">
                      Hi, I&apos;m a passionate Full Stack Web Developer with a
                      strong foundation in building responsive, scalable, and
                      user-centric web applications. I specialize in crafting
                      seamless experiences using modern JavaScript frameworks,
                      REST APIs, and backend technologies like Node.js and
                      Express.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: easeOut }}
                    className="relative"
                  >
                    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-blue-400/50 to-transparent rounded-full"></div>
                    <p className="text-sm text-gray-200 leading-relaxed pl-2">
                      I thrive on transforming complex problems into elegant,
                      efficient solutions. With hands-on experience in frontend
                      tools like React and Tailwind CSS, and robust backend
                      integrations with databases like MongoDB and PostgreSQL, I
                      ensure a full-cycle development approach.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: easeOut }}
                    className="relative"
                  >
                    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-green-400/50 to-transparent rounded-full"></div>
                    <p className="text-sm text-gray-200 leading-relaxed pl-2">
                      From building intuitive UI components to deploying secure
                      servers, I enjoy taking ideas from concept to production.
                      Clean code, performance optimization, and continuous
                      learning are at the heart of my workflow.
                    </p>
                  </motion.div>
                </div>

                {/* Right Side - Enhanced Image */}
                <div className="absolute right-8 top-16">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
                    whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ duration: 1, ease: easeOut }}
                    whileHover={{ scale: 1.05, rotateY: -5 }}
                  >
                    <CardContainer className="inter-var">
                      <CardBody className="bg-gradient-to-bl from-blue-600/80 to-purple-600/80 relative group/card dark:hover:shadow-2xl dark:hover:shadow-purple-500/[0.3] border-purple-400/30 w-80 h-auto rounded-xl p-3 border backdrop-blur-sm">
                        {/* Floating Elements Around Image */}
                        <motion.div
                          className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full"
                          animate={{ y: [-5, 5, -5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.div
                          className="absolute -bottom-2 -left-2 w-3 h-3 bg-green-400 rounded-full"
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
                            className="h-52 w-full object-cover rounded-xl group-hover/card:shadow-xl relative z-10"
                            alt="workspace thumbnail"
                          />
                        </CardItem>
                        {/* Enhanced Statistics with Icons */}
                        <div className="absolute -bottom-4 right-10 w-full flex gap-4 p-2 transform translate-y-full">
                          {stats.map((stat, index) => (
                            <motion.div
                              key={`desktop-stat-${index}`}
                              initial={{ opacity: 0, scale: 0, y: 20 }}
                              whileInView={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{
                                duration: 0.8,
                                ease: easeOut,
                                delay: index * 0.1,
                              }}
                              whileHover={{ scale: 1.1, y: -5 }}
                              className="text-center relative"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-lg blur-lg"></div>
                              <div className="relative bg-black/20 p-2 rounded-lg border border-purple-500/20 backdrop-blur-sm">
                                <div className="text-sm mb-1">{stat.icon}</div>
                                <h3
                                  className={`text-lg font-bold ${stat.color} mb-1`}
                                >
                                  {stat.number}
                                </h3>
                                <p className="text-gray-100 text-xs whitespace-nowrap">
                                  {stat.label}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardBody>
                    </CardContainer>
                  </motion.div>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="lg:hidden p-8 grid grid-cols-1 gap-8">
                {/* Mobile Text Content */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: easeOut }}
                  >
                    <p className="text-sm text-gray-200 mb-6">
                      Hi, I&apos;m a passionate Full Stack Web Developer with a
                      strong foundation in building responsive, scalable, and
                      user-centric web applications. I specialize in crafting
                      seamless experiences using modern JavaScript frameworks,
                      REST APIs, and backend technologies like Node.js and
                      Express.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: easeOut }}
                  >
                    <p className="text-sm text-gray-200 mb-6">
                      I thrive on transforming complex problems into elegant,
                      efficient solutions. With hands-on experience in frontend
                      tools like React and Tailwind CSS, and robust backend
                      integrations with databases like MongoDB and PostgreSQL, I
                      ensure a full-cycle development approach.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: easeOut }}
                  >
                    <p className="text-sm text-gray-200 mb-8">
                      From building intuitive UI components to deploying secure
                      servers, I enjoy taking ideas from concept to production.
                      Clean code, performance optimization, and continuous
                      learning are at the heart of my workflow.
                    </p>
                  </motion.div>

                  {/* Mobile Stats Grid */}
                  <div className="grid grid-cols-2 gap-8">
                    {stats.map((stat, index) => (
                      <div key={`mobile-stat-${index}`}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0, x: -50 }}
                          whileInView={{ opacity: 1, scale: 1, x: 0 }}
                          transition={{ duration: 0.8, ease: easeOut }}
                        >
                          <h3 className="text-2xl font-bold text-green-600 mb-2">
                            {stat.number}
                          </h3>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -50 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.8, ease: easeOut }}
                        >
                          <p className="text-gray-100">{stat.mobileLabel}</p>
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Image */}
                <div className="flex justify-center">
                  <CardContainer className="inter-var">
                    <CardBody className="bg-gradient-to-bl from-blue-700 to-purple-600 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-2 border">
                      <CardItem translateZ="50" className="w-full">
                        <img
                          src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1753025128/workspace_lyay7t.jpg"
                          height="500"
                          width="500"
                          className="h-40 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                          alt="workspace thumbnail"
                        />
                      </CardItem>
                    </CardBody>
                  </CardContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Code-like Decorative Element */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="hidden lg:block absolute bottom-6 left-2/6 transform -translate-x-1/2 p-2 bg-black/20 rounded-lg border border-purple-500/20 font-mono text-xs text-green-400 right-32"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div className="mt-2">
              <span className="text-purple-400">const</span>{" "}
              <span className="text-blue-400">developer</span> = {"{"}
              <br />
              &nbsp;&nbsp;<span className="text-yellow-400">passion</span>:{" "}
              <span className="text-green-400">&quot;Full Stack&quot;</span>,
              <br />
              &nbsp;&nbsp;<span className="text-yellow-400">mission</span>:{" "}
              <span className="text-green-400">&quot;Innovation&quot;</span>
              <br />
              {"}"};
            </div>
          </motion.div>

          {/* Desktop Subtle Grid Pattern Overlay */}
          <div className="hidden lg:block absolute inset-0 opacity-5">
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
