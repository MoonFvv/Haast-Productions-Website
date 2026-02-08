import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Portfolio from '../components/Portfolio';

const Home: React.FC = () => {
  return (
    <main className="relative z-10">
      <Hero />
      <About />
      <Portfolio />
    </main>
  );
};

export default Home;
