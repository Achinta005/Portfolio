'use client';

export default function CertificationSection() {
  const certifications = [
    {
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      year: '2023',
      icon: 'ri-cloud-line'
    },
    {
      name: 'Google Cloud Professional Developer',
      issuer: 'Google Cloud',
      year: '2022',
      icon: 'ri-google-line'
    },
    {
      name: 'Meta Frontend Developer Professional',
      issuer: 'Meta',
      year: '2022',
      icon: 'ri-facebook-line'
    },
    {
      name: 'MongoDB Certified Developer',
      issuer: 'MongoDB University',
      year: '2021',
      icon: 'ri-database-2-line'
    },
    {
      name: 'Certified Scrum Master',
      issuer: 'Scrum Alliance',
      year: '2021',
      icon: 'ri-team-line'
    },
    {
      name: 'Adobe Certified Expert - UX Design',
      issuer: 'Adobe',
      year: '2020',
      icon: 'ri-palette-line'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Certifications</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional certifications that validate my expertise and commitment to continuous learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg mr-3 flex-shrink-0">
                  <i className={`${cert.icon} text-xl text-blue-600`}></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight">{cert.name}</h3>
                </div>
              </div>
              <p className="text-blue-600 font-medium text-sm mb-1">{cert.issuer}</p>
              <p className="text-gray-500 text-xs">{cert.year}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}