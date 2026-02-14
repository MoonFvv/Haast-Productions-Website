import React, { useEffect } from 'react';
import Gear from '../components/Services';
import AnimatedGrid from '../components/AnimatedGrid';

const GearPage: React.FC = () => {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div className="h-screen bg-haast-black text-haast-text flex flex-col overflow-hidden" style={{ position: 'relative' }}>
      <AnimatedGrid />
      <div className="max-w-6xl mx-auto px-6 py-6 flex-1 overflow-auto w-full" style={{ position: 'relative', zIndex: 1 }}>
        <Gear />
      </div>
    </div>
  );
};

export default GearPage;
