'use client';

export default function CertificationSection() {
  const certifications = [
    {
      
    },
    {
      
    },
    {
      
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