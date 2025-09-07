// components/Home/Achievement.jsx
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Achievement = () => {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    // Animate each achievement counter
    itemsRef.current.forEach((item, index) => {
      if (!item) return;
      
      const number = item.getAttribute('data-target');
      let counter = 0;
      const duration = 2000;
      const increment = number / (duration / 16);
      
      const updateCounter = () => {
        if (counter < number) {
          counter += increment;
          if (counter > number) counter = number;
          item.textContent = Math.round(counter).toLocaleString() + (index === 3 ? '%' : '+');
          requestAnimationFrame(updateCounter);
        }
      };
      
      ScrollTrigger.create({
        trigger: item,
        start: "top 80%",
        onEnter: () => {
          counter = 0;
          updateCounter();
        },
        once: true
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 bg-green-600 text-blue-800 z-30 "
    >
      <div className="max-w-7xl mx-auto px-4 relative z-40">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-6 bg-red-600 bg-opacity-10 rounded-xl backdrop-blur-sm">
            <h3 
              ref={el => itemsRef.current[0] = el}
              data-target="10000"
              className="text-4xl font-bold mb-2"
            >0+</h3>
            <p className="text-green-100">Properties Listed</p>
          </div>
          <div className="p-6 bg-red-600 bg-opacity-10 rounded-xl backdrop-blur-sm">
            <h3 
              ref={el => itemsRef.current[1] = el}
              data-target="5000"
              className="text-4xl font-bold mb-2"
            >0+</h3>
            <p className="text-green-100">Happy Customers</p>
          </div>
          <div className="p-6 bg-red-600 bg-opacity-10 rounded-xl backdrop-blur-sm">
            <h3 
              ref={el => itemsRef.current[2] = el}
              data-target="25"
              className="text-4xl font-bold mb-2"
            >0+</h3>
            <p className="text-green-100">Cities Covered</p>
          </div>
          <div className="p-6 bg-red-600 bg-opacity-10 rounded-xl backdrop-blur-sm">
            <h3 
              ref={el => itemsRef.current[3] = el}
              data-target="98"
              className="text-4xl font-bold mb-2"
            >0%</h3>
            <p className="text-green-100">Customer Satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievement;