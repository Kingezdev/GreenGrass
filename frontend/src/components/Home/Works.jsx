// components/Home/Works.jsx
import React from 'react';

const Works = () => {
  return (
    <section className="relative z-30 py-16 bg-gray-50 z-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">How It Works</h2>
          <p className="text-gray-600 mt-4">Simple steps to find your perfect property</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-4xl text-green-600 mb-4">1</div>
            <h3 className="text-xl font-semibold mb-2">Search & Explore</h3>
            <p className="text-gray-600">
              Browse through our verified properties using filters to find exactly what you need.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-4xl text-green-600 mb-4">2</div>
            <h3 className="text-xl font-semibold mb-2">Schedule Viewing</h3>
            <p className="text-gray-600">
              Book appointments to view properties at your convenience with our easy scheduling system.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-4xl text-green-600 mb-4">3</div>
            <h3 className="text-xl font-semibold mb-2">Secure Transaction</h3>
            <p className="text-gray-600">
              Complete your transaction securely through our platform with full documentation support.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Works;