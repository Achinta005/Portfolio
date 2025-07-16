'use client';

export default function EducationSection() {
  const education = [
    {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of Technology',
      year: '2015 - 2019',
      description: 'Graduated Magna Cum Laude with a focus on software engineering and web development.',
      icon: 'ri-graduation-cap-line'
    },
    {
      degree: 'Master of Science in Software Engineering',
      institution: 'Tech Institute',
      year: '2019 - 2021',
      description: 'Specialized in full-stack development, cloud computing, and system architecture.',
      icon: 'ri-book-open-line'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Education</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            My academic foundation in computer science and continuous learning journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {education.map((edu, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start mb-6">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg mr-4 flex-shrink-0">
                  <i className={`${edu.icon} text-2xl text-blue-600`}></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{edu.degree}</h3>
                  <p className="text-blue-600 font-semibold mb-1">{edu.institution}</p>
                  <p className="text-gray-500 text-sm">{edu.year}</p>
                </div>
              </div>
              <p className="text-gray-600">{edu.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}