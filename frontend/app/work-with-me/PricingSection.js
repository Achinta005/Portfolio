'use client';

import Link from 'next/link';

export default function PricingSection() {
  const packages = [
    {
      name: 'Starter',
      price: '$2,500',
      duration: '2-3 weeks',
      description: 'Perfect for small businesses and personal projects',
      features: [
        'Up to 5 pages',
        'Responsive design',
        'Basic SEO setup',
        'Contact form',
        '30 days support',
        'Source code included'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$5,000',
      duration: '4-6 weeks',
      description: 'Ideal for growing businesses and complex projects',
      features: [
        'Up to 10 pages',
        'Custom functionality',
        'CMS integration',
        'Advanced SEO',
        'Analytics setup',
        '90 days support',
        'Performance optimization',
        'Source code included'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$10,000+',
      duration: '8-12 weeks',
      description: 'Comprehensive solutions for large-scale projects',
      features: [
        'Unlimited pages',
        'Custom web application',
        'Database design',
        'API development',
        'Cloud deployment',
        '6 months support',
        'Ongoing maintenance',
        'Training included'
      ],
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Investment Packages</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transparent pricing with no hidden fees. Each package is designed 
            to deliver maximum value for your investment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {packages.map((pkg, index) => (
            <div key={index} className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${pkg.popular ? 'ring-2 ring-blue-600' : ''}`}>
              {pkg.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-b-lg text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-blue-600">{pkg.price}</span>
                  <span className="text-gray-600 ml-2">/ {pkg.duration}</span>
                </div>
                <p className="text-gray-600 mb-6">{pkg.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <div className="w-4 h-4 flex items-center justify-center mr-3">
                        <i className="ri-check-line text-green-500"></i>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href="/contact" 
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap text-center block ${
                    pkg.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Something Custom?</h3>
          <p className="text-lg text-gray-600 mb-6">
            Every project is unique. Let&apos;s discuss your specific requirements 
            and create a custom solution that fits your needs and budget.
          </p>
          <Link 
            href="/contact" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap inline-block font-semibold"
          >
            Request Custom Quote
          </Link>
        </div>
      </div>
    </section>
  );
}