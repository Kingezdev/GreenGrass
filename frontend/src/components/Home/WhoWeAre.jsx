// components/Home/WhoWeAre.jsx
import React from 'react';

const WhoWeAre = () => {
  
  return (
    <section className="relative py-16 bg-white z-30 ">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img 
              src="/team-image.jpg" 
              alt="Our Team" 
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Who We Are</h2>
            <p className="text-gray-600 mb-4">
              We are a team of passionate real estate professionals and technologists dedicated to 
              transforming how people find and secure properties in Nigeria.
            </p>
            <p className="text-gray-600 mb-4">
              Our mission is to make property search transparent, secure, and hassle-free for everyone.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-gray-600">
                <span className="text-green-600 mr-2">✓</span>
                Experienced team with 10+ years in real estate
              </li>
              <li className="flex items-center text-gray-600">
                <span className="text-green-600 mr-2">✓</span>
                Technology-driven solutions
              </li>
              <li className="flex items-center text-gray-600">
                <span className="text-green-600 mr-2">✓</span>
                Customer-centric approach
              </li>
            </ul>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Learn More About Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;