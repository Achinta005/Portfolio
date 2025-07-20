"use client";
import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">About Me</h1>
            <p className="text-xl text-gray-600 mb-8">
              Hi, I&apos;m a passionate Full Stack Web Developer with a strong
              foundation in building responsive, scalable, and user-centric web
              applications. I specialize in crafting seamless experiences using
              modern JavaScript frameworks, REST APIs, and backend technologies
              like Node.js and Express.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              I thrive on transforming complex problems into elegant, efficient
              solutions. With hands-on experience in frontend tools like React
              and Tailwind CSS, and robust backend integrations with databases
              like MongoDB and PostgreSQL, I ensure a full-cycle development
              approach.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              From building intuitive UI components to deploying secure servers,
              I enjoy taking ideas from concept to production. Clean code,
              performance optimization, and continuous learning are at the heart
              of my workflow.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Let&apos;s create impactful digital experiences—one line of code
              at a time.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-blue-600 mb-2">10+</h3>
                <p className="text-gray-600">Projects Completed</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-600 mb-2">1+</h3>
                <p className="text-gray-600">Years of Practical Learning</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-600 mb-2">3+</h3>
                <p className="text-gray-600">Team Collaborations</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-600 mb-2">10+</h3>
                <p className="text-gray-600">Technologies Mastered</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Image
              src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1753025128/workspace_lyay7t.jpg"
              width={500}
              height={500}
              alt="Workspace"
              className="w-full max-w-lg rounded-2xl shadow-2xl object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
