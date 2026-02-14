import React, { useEffect } from 'react';
import Team from '../components/Team';
import AnimatedGrid from '../components/AnimatedGrid';

const TeamPage: React.FC = () => {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, []);

  return (
    <div className="h-screen bg-haast-black text-haast-text flex flex-col overflow-hidden" style={{ position: 'relative' }}>
      <AnimatedGrid />
      <div className="max-w-6xl mx-auto px-6 py-6 flex-1 overflow-auto w-full" style={{ position: 'relative', zIndex: 1 }}>
        <Team />
      </div>
    </div>
  );
};

export default TeamPage;
