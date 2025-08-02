'use client'
import React from 'react'
import { motion,easeOut } from 'framer-motion'
import Image from 'next/image'

const AboutHeroMobile = () => {
  return (
    <div><section className="py-8 ">
      <div className="w-[90vw] mx-auto px-4">
        <div className="grid grid-cols-1  gap-12 items-center bg-white/20 rounded-lg backdrop-blur-md">
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
              <p className="text-xl text-gray-700 lg:font-semiboldbold mb-8">
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
              <p className="text-lg lg:font-semiboldbold text-gray-700 mb-6 ">
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
              <p className="text-lg lg:font-semiboldbold text-gray-700 mb-8 ">
                From building intuitive UI components to deploying secure
                servers, I enjoy taking ideas from concept to production. Clean
                code, performance optimization, and continuous learning are at
                the heart of my workflow.
              </p>
              <span></span>
            </motion.div>
            <motion.div
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: easeOut }}
            >
              <p className="text-lg lg:font-semiboldbold text-gray-700 mb-8 ">
                Let&apos;s create impactful digital experiences—one line of code
                at a time.
              </p>
              <span></span>
            </motion.div>

            <div className="grid grid-cols-2 gap-8 ">
              <div>
                <motion.div
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0, x: -130 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: easeOut }}
                >
                  <h3 className="text-2xl font-bold text-blue-600 mb-2">10+</h3>
                  <span></span>
                </motion.div>
                <motion.div
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: easeOut }}
                >
                  <p className="text-gray-700 ">Projects Completed</p>
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
                  <h3 className="text-2xl font-bold text-blue-600 mb-2">1+</h3>
                  <span></span>
                </motion.div>
                <motion.div
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: easeOut }}
                >
                  <p className="text-gray-700 ">Years of Practical Learning</p>
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
                  <h3 className="text-2xl font-bold text-blue-600 mb-2">3+</h3>
                  <span></span>
                </motion.div>
                <motion.div
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: easeOut }}
                >
                  <p className="text-gray-700 ">Team Collaborations</p>
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
                  <h3 className="text-2xl font-bold text-blue-600 mb-2">10+</h3>
                  <span></span>
                </motion.div>
                <motion.div
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: easeOut }}
                >
                  <p className="text-gray-700 ">Technologies Mastered</p>
                  <span></span>
                </motion.div>
              </div>
            </div>
          </div>
              <Image
                src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1753025128/workspace_lyay7t.jpg"
                width={500}
                height={500}
                alt="Workspace"
                className="shadow-2xl rounded-[20vh] "
              />
            
        </div>
      </div>
    </section>
    </div>
  )
}

export default AboutHeroMobile