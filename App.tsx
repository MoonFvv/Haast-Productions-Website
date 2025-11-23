import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import Gear from './components/Services';
import Team from './components/Team';
import About from './components/About';
import Contact from './components/Contact';

function App() {
  return (
    <div className="bg-haast-black min-h-screen text-haast-text font-sans selection:bg-haast-accent selection:text-white">
      <Navbar />
      
      <main className="relative z-10">
        <Hero />
        <About />
        <Portfolio />
        <Gear />
        <Team />
        <Contact />
      </main>
    </div>
  );
}

export default App;