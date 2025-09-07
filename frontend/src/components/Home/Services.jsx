// components/Home/Services.jsx
import React from 'react';

const Services = () => {
  return (
    <section className="relative z-30 py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Our Services</h2>
          <p className="text-gray-600 mt-4">Comprehensive real estate solutions for all your needs</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="text-green-600 text-3xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Property Search</h3>
            <p className="text-gray-600">
              Find apartments, houses, and commercial properties that match your criteria.
            </p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="text-green-600 text-3xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">Property Listing</h3>
            <p className="text-gray-600">
              List your property to reach genuine buyers and tenants quickly.
            </p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="text-green-600 text-3xl mb-4">⚖️</div>
            <h3 className="text-xl font-semibold mb-2">Legal Support</h3>
            <p className="text-gray-600">
              Get assistance with documentation and legal processes for property transactions.
            </p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="text-green-600 text-3xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">Valuation Services</h3>
            <p className="text-gray-600">
              Professional property valuation for sales, purchases, or rental purposes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;