'use client';

export default function ContactInfo() {
  const contactMethods = [
    {
      icon: 'ri-mail-line',
      title: 'Email',
      details: 'achintahazra815@gmail.com',
      description: 'Send me an email anytime!'
    },
    {
      icon: 'ri-phone-line',
      title: 'Phone',
      details: '+91 7602699715',
      description: 'Mon-Fri from 8am to 6pm'
    },
    {
      icon: 'ri-map-pin-line',
      title: 'Location',
      details: 'Arambagh West Bengal',
      description: 'Available for remote work'
    }
  ];

  const socialLinks = [
    { icon: 'ri-linkedin-fill', name: 'LinkedIn', url: 'https://www.linkedin.com/in/achinta-hazra?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
    { icon: 'ri-github-fill', name: 'GitHub', url: 'https://github.com/Achinta005' },
    { icon: 'ri-twitter-fill', name: 'Twitter', url: '#' },
    { icon: 'ri-dribbble-line', name: 'Dribbble', url: '#' }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 dark:text-gray-100">Let&apos;s Connect</h2>
          <p className="text-lg text-gray-600 mb-8 dark:text-gray-300">
            I&apos;m always open to discussing new opportunities, creative projects, 
            or potential collaborations. Don&apos;t hesitate to reach out!
          </p>
        </div>

        <div className="space-y-6 mb-12">
          {contactMethods.map((method, index) => (
            <div key={index} className="flex items-start">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg mr-4 flex-shrink-0">
                <i className={`${method.icon} text-xl text-blue-600`}></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1 dark:text-gray-100">{method.title}</h3>
                <p className="text-blue-600 font-medium mb-1">{method.details}</p>
                <p className="text-gray-600 text-sm dark:text-gray-300">{method.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 dark:text-gray-100">Follow Me</h3>
          <div className="flex space-x-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                className="w-10 h-10 flex items-center justify-center bg-white  rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                title={social.name}
              >
                <i className={`${social.icon} text-xl text-blue-800 dark:text-gray-950 hover:text-blue-600`}></i>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-xl dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 dark:text-gray-100">Response Time</h3>
          <p className="text-gray-600 dark:text-gray-300">
            I typically respond to messages within 24 hours. For urgent matters, 
            feel free to call me directly.
          </p>
        </div>
      </div>
    </section>
  );
}