// components/Home/Testimonial.jsx
import React from 'react';

const Testimonial = () => {
  const testimonials = [
    {
      id: 1,
      name: "Chinedu Okoro",
      role: "Property Owner",
      content: "This platform made it so easy to find tenants for my apartment. The verification process gave me peace of mind knowing I was dealing with serious people.",
      avatar: "C"
    },
    {
      id: 2,
      name: "Amara Nwosu",
      role: "Tenant",
      content: "I found my dream apartment within a week! The process was transparent and the support team was incredibly helpful throughout.",
      avatar: "A"
    },
    {
      id: 3,
      name: "Tunde Adeyemi",
      role: "Real Estate Investor",
      content: "As someone who owns multiple properties, this platform has simplified my management process. The analytics and reporting features are exceptional.",
      avatar: "T"
    }
  ];

  return (
    <section className="relative z-30 py-16 bg-white z-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">What Our Customers Say</h2>
          <p className="text-gray-600 mt-4">Hear from people who have used our platform</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                  {testimonial.avatar}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700">"{testimonial.content}"</p>
              <div className="flex mt-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;