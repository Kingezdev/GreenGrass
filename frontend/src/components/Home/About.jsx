// components/Home/About.jsx

const About = () => {

  return (
    <section 
      className="relative py-24 bg-orange-500 bg-opacity-95 backdrop-blur-sm rounded-t-3xlshadow-xl z-30 "
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image with parallax effect */}
          <div className="lg:w-1/2 relative">
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1772&q=80" 
                alt="Modern apartment interior" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-green-800/30"></div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-green-100 rounded-full opacity-50 z-0"></div>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-200 rounded-full opacity-30 z-0"></div>
          </div>
          
          {/* Content */}
          <div className="lg:w-1/2 relative z-10">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Revolutionizing Real Estate in Nigeria
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              We are transforming how people find, buy, and rent properties across Nigeria. 
              Our platform brings transparency, security, and convenience to the real estate market.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Verified Properties</h3>
                  <p className="text-gray-600">Every listing is thoroughly vetted to ensure authenticity.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Secure Transactions</h3>
                  <p className="text-gray-600">End-to-end encrypted payments and documentation.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Expert Support</h3>
                  <p className="text-gray-600">Our team guides you through every step of the process.</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                Learn More About Us
              </button>
              <button className="border border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors font-medium">
                View Our Services
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default About;