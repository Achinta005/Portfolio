'use client';

export default function SkillsSection() {
  
  const skills = [
    { name: 'HTML', level: 100, icon: 'ri-html5-line' },
    { name: 'CSS', level: 100, icon: 'ri-css3-line' },
    { name: 'JavaScript', level: 95, icon: 'ri-code-s-slash-line' },
    { name: 'Node.js', level: 85, icon: 'ri-server-line' },
    { name: 'Express JS', level: 85, icon: 'ri-palette-line' },
    { name: 'MongoDB', level: 75, icon: 'ri-database-2-line' },
    { name: 'React', level: 90, icon: 'ri-reactjs-line' },
    { name: 'Next JS', level: 70, icon: 'ri-reactjs-line' },
    { name: 'Python', level: 80, icon: 'ri-code-line' },
    { name: 'JAVA', level: 75, icon: 'ri-cup-line' },
    { name: 'C', level: 90, icon: 'ri-terminal-line' },
    { name: 'My SQL', level: 95, icon: 'ri-database-line' },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Skills & Expertise</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            I specialize in modern web technologies and design principles to create 
            exceptional digital experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg mr-4">
                  <i className={`${skill.icon} text-2xl text-blue-600`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{skill.name}</h3>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{skill.level}% Proficiency</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}