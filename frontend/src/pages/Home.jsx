// pages/Home.jsx
import React from 'react';
import Hero from '../components/Home/Hero';
import About from '../components/Home/About';
import Achievement from '../components/Home/Achievement';
import WhoWeAre from '../components/Home/WhoWeAre';
import Works from '../components/Home/Works';
import Services from '../components/Home/Services';
import Listings from '../components/Home/Listings';
import Testimonial from '../components/Home/Testimonial';
import Contact from '../components/Home/Contact';
import Footer from '../components/Home/Footer';

const Home = () => {
  return (
    <div className=" bg-gray-50">
      <Hero />
      <About />
      <Achievement />
      <WhoWeAre />
      <Works />
      <Services />
      <Listings />
      <Testimonial />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;