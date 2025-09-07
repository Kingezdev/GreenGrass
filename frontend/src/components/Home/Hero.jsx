// components/Home/Hero.jsx
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const Hero = () => {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      const maxDim = 0.92; // Maximum opacity for the overlay
      
      // Calculate opacity based on scroll position
      const opacity = Math.min(scrollY / heroHeight, maxDim);
      
      // Animate the overlay opacity
      gsap.to(overlayRef.current, {
        opacity: opacity,
        duration: 0.18,
        overwrite: true
      });
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div 
      className="min-h-screen bg-[url('/herobg.jpg')] bg-cover bg-center bg-fixed relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-black/70"></div>
      {/* Black overlay that changes opacity on scroll */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-black opacity-0"
      ></div>
      
      {/* Fixed content container */}
      <div 
        ref={contentRef}
        className="fixed inset-0 z-10 flex flex-col items-center justify-center text-white px-4"
      >
        <div className="max-w-md lg:max-w-xl absolute bottom-5 left-5">
          <h1
            className="animate-fade-in font-medium leading-tight text-xl md:text-2xl xl:text-3xl">
            The GreenGrass way is simple: integrity, insight, and value that lasts — helping you find the right rental with confidence.
          </h1>
        </div>
        
        <p className="text-xl md:text-2xl mb-10 max-w-2xl animate-fade-in-delay">
          Discover premium properties in Nigeria's most desirable locations
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 animate-fade-in-delay-3">
          <div className="text-center">
            <div className="text-3xl font-bold">10,000+</div>
            <div className="text-gray-300">Properties</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">25+</div>
            <div className="text-gray-300">Cities</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">98%</div>
            <div className="text-gray-300">Satisfaction</div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.3s forwards;
          opacity: 0;
        }
        .animate-fade-in-delay-2 {
          animation: fade-in 1s ease-out 0.6s forwards;
          opacity: 0;
        }
        .animate-fade-in-delay-3 {
          animation: fade-in 1s ease-out 0.9s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Hero;