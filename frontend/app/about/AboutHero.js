'use client';

export default function AboutHero() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">About Me</h1>
            <p className="text-xl text-gray-600 mb-8">
              I&apos;m a passionate full-stack developer and UI/UX designer with over 5 years 
              of experience creating digital solutions that make a difference.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              My journey began with a curiosity about how things work on the web. 
              This curiosity led me to dive deep into both frontend and backend technologies, 
              allowing me to build complete, scalable applications from concept to deployment.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              I believe in writing clean, maintainable code and creating user experiences 
              that are both beautiful and functional. When I&apos;m not coding, you&apos;ll find me 
              exploring new technologies, contributing to open-source projects, or mentoring 
              junior developers.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-blue-600 mb-2">50+</h3>
                <p className="text-gray-600">Projects Completed</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-600 mb-2">5+</h3>
                <p className="text-gray-600">Years Experience</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-600 mb-2">30+</h3>
                <p className="text-gray-600">Happy Clients</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-600 mb-2">15+</h3>
                <p className="text-gray-600">Technologies</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <img
              src="https://readdy.ai/api/search-image?query=Professional%20developer%20working%20at%20modern%20workspace%20with%20multiple%20monitors%2C%20coding%20environment%2C%20clean%20desk%20setup%2C%20natural%20lighting%2C%20focused%20and%20productive%20atmosphere%2C%20contemporary%20office%20design%20with%20plants%20and%20minimal%20decoration&width=600&height=600&seq=about-workspace-001&orientation=squarish"
              alt="Workspace"
              className="w-full max-w-lg rounded-2xl shadow-2xl object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}