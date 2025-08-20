"use client";
import Image from "next/image";
import { easeOut, motion } from "framer-motion";
import useIsMobile from "@/components/useIsMobile";
import AboutHeroMobile from "./AboutHeroMobile";
import { CardItem, CardBody, CardContainer } from "@/components/ui/3dCard";

export default function AboutHero() {
  const isMobile = useIsMobile(1024); //Defining brek point for mobile
  return isMobile ? (
    <div>
      <AboutHeroMobile />
    </div>
  ) : (
    <section className="py-8 ">
      <div className="lg:max-w-7xl w-[90vw] mx-auto px-4 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white/10 rounded-lg backdrop-blur-md">
          <div className="p-8">
            <motion.div
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: easeOut }}
            >
              <h1 className="text-5xl font-bold text-yellow-100 mb-6 relative lg:left-[32vw]">
                About Me
              </h1>
              <span></span>
            </motion.div>

            <motion.div
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: easeOut }}
            >
              <p className="text-xl text-gray-200 lg:font-semiboldbold mb-8">
                Hi, I&apos;m a passionate Full Stack Web Developer with a strong
                foundation in building responsive, scalable, and user-centric
                web applications. I specialize in crafting seamless experiences
                using modern JavaScript frameworks, REST APIs, and backend
                technologies like Node.js and Express.
              </p>
              <span></span>
            </motion.div>

            <motion.div
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: easeOut }}
            >
              <p className="text-lg lg:font-semiboldbold text-gray-200 mb-6 ">
                I thrive on transforming complex problems into elegant,
                efficient solutions. With hands-on experience in frontend tools
                like React and Tailwind CSS, and robust backend integrations
                with databases like MongoDB and PostgreSQL, I ensure a
                full-cycle development approach.
              </p>

              <span></span>
            </motion.div>
            <motion.div
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: easeOut }}
            >
              <p className="text-lg lg:font-semiboldbold text-gray-200 mb-8 ">
                From building intuitive UI components to deploying secure
                servers, I enjoy taking ideas from concept to production. Clean
                code, performance optimization, and continuous learning are at
                the heart of my workflow.
              </p>
              <span></span>
            </motion.div>
      

            <div className="grid grid-cols-4 gap-52 relative left-40 place-items-center">
              <div>
                <motion.div
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0, x: -130 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: easeOut }}
                >
                  <h3 className="text-2xl font-bold text-green-600 mb-2">
                    10+
                  </h3>
                  <span></span>
                </motion.div>
                <motion.div
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: easeOut }}
                >
                  <p className="text-gray-100 text-nowrap">Projects Completed</p>
                  <span></span>
                </motion.div>
              </div>
              <div>
                <motion.div
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0, x: -130 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: easeOut }}
                >
                  <h3 className="text-2xl font-bold text-green-600 mb-2">1+</h3>
                  <span></span>
                </motion.div>
                <motion.div
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: easeOut }}
                >
                  <p className="text-gray-100 text-nowrap">Years of Practical Learning</p>
                  <span></span>
                </motion.div>
              </div>
              <div>
                <motion.div
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0, x: -130 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: easeOut }}
                >
                  <h3 className="text-2xl font-bold text-green-600 mb-2">3+</h3>
                  <span></span>
                </motion.div>
                <motion.div
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: easeOut }}
                >
                  <p className="text-gray-100 text-nowrap">Team Collaborations</p>
                  <span></span>
                </motion.div>
              </div>
              <div>
                <motion.div
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0, x: -130 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: easeOut }}
                >
                  <h3 className="text-2xl font-bold text-green-600 mb-2">
                    20+
                  </h3>
                  <span></span>
                </motion.div>
                <motion.div
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: easeOut }}
                >
                  <p className="text-gray-100 text-nowrap">Technologies Mastered</p>
                  <span></span>
                </motion.div>
              </div>
            </div>
          </div>
          <div className="relative top-0">
            <CardContainer className="inter-var">
              <CardBody className="bg-gradient-to-bl from-blue-700 to-purple-600 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-4 border">
                <CardItem translateZ="50" className="w-full">
                  <img
                    src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1753025128/workspace_lyay7t.jpg"
                    height="500"
                    width="500"
                    className="h-96 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                    alt="thumbnail"
                  />
                </CardItem>
              </CardBody>
            </CardContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
