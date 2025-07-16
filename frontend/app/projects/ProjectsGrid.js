'use client';

import React, { useState } from 'react';

export default function ProjectsGrid() {
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution built with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and inventory management.',
      image: 'https://readdy.ai/api/search-image?query=Modern%20e-commerce%20website%20interface%20showing%20clean%20product%20listings%2C%20shopping%20cart%2C%20user%20dashboard%20with%20professional%20design%2C%20bright%20colors%2C%20and%20modern%20UI%20elements%20on%20desktop%20screen&width=600&height=400&seq=project-ecommerce-001&orientation=landscape',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      liveUrl: '#',
      githubUrl: '#',
      category: 'Web Development'
    },
    {
      title: 'Task Management App',
      description: 'Collaborative task management application with real-time updates, team collaboration features, and advanced project tracking capabilities.',
      image: 'https://readdy.ai/api/search-image?query=Task%20management%20dashboard%20interface%20with%20kanban%20boards%2C%20project%20timelines%2C%20team%20collaboration%20features%2C%20clean%20modern%20design%20with%20productivity-focused%20layout%20and%20professional%20appearance&width=600&height=400&seq=project-taskapp-001&orientation=landscape',
      technologies: ['React', 'Firebase', 'Material-UI', 'WebSocket'],
      liveUrl: '#',
      githubUrl: '#',
      category: 'Web Development'
    },
    {
      title: 'Weather Forecast App',
      description: 'Mobile-first weather application with location-based forecasts, interactive maps, and beautiful weather animations.',
      image: 'https://readdy.ai/api/search-image?query=Weather%20app%20interface%20showing%20current%20conditions%2C%207-day%20forecast%2C%20interactive%20weather%20maps%2C%20modern%20mobile%20design%20with%20beautiful%20weather%20icons%20and%20gradient%20backgrounds&width=600&height=400&seq=project-weather-001&orientation=landscape',
      technologies: ['React Native', 'API Integration', 'Geolocation'],
      liveUrl: '#',
      githubUrl: '#',
      category: 'Mobile Development'
    },
    {
      title: 'Portfolio Website Redesign',
      description: 'Complete redesign of a creative agency portfolio website focusing on user experience and conversion optimization.',
      image: 'https://readdy.ai/api/search-image?query=Creative%20portfolio%20website%20design%20showing%20elegant%20layout%2C%20professional%20project%20showcase%2C%20modern%20typography%2C%20clean%20navigation%2C%20and%20stunning%20visual%20presentation%20with%20contemporary%20web%20design%20elements&width=600&height=400&seq=project-portfolio-001&orientation=landscape',
      technologies: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
      liveUrl: '#',
      githubUrl: '#',
      category: 'UI/UX Design'
    },
    {
      title: 'Cryptocurrency Dashboard',
      description: 'Real-time cryptocurrency tracking dashboard with advanced charting, portfolio management, and market analysis tools.',
      image: 'https://readdy.ai/api/search-image?query=Cryptocurrency%20trading%20dashboard%20with%20real-time%20charts%2C%20market%20data%20tables%2C%20portfolio%20tracking%20interface%2C%20dark%20theme%20design%20with%20financial%20data%20visualization%20and%20modern%20trading%20platform%20aesthetics&width=600&height=400&seq=project-crypto-001&orientation=landscape',
      technologies: ['Vue.js', 'Chart.js', 'WebSocket', 'API'],
      liveUrl: '#',
      githubUrl: '#',
      category: 'Web Development'
    },
    {
      title: 'Social Media Analytics Tool',
      description: 'Comprehensive social media analytics platform providing insights, engagement metrics, and automated reporting features.',
      image: 'https://readdy.ai/api/search-image?query=Social%20media%20analytics%20dashboard%20showing%20engagement%20metrics%2C%20follower%20growth%20charts%2C%20content%20performance%20data%2C%20professional%20interface%20with%20data%20visualization%20and%20modern%20web%20application%20design&width=600&height=400&seq=project-social-001&orientation=landscape',
      technologies: ['Angular', 'D3.js', 'Node.js', 'MongoDB'],
      liveUrl: '#',
      githubUrl: '#',
      category: 'Web Development'
    }
  ];

  const categories = ['All', 'Web Development', 'Mobile Development', 'UI/UX Design'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover object-top"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex space-x-4">
                  <a 
                    href={project.liveUrl}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                  >
                    <div className="w-4 h-4 flex items-center justify-center mr-1">
                      <i className="ri-external-link-line"></i>
                    </div>
                    Live Demo
                  </a>
                  <a 
                    href={project.githubUrl}
                    className="flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                  >
                    <div className="w-4 h-4 flex items-center justify-center mr-1">
                      <i className="ri-github-line"></i>
                    </div>
                    Code
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
