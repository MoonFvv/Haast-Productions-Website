import React, { useEffect } from 'react';
import Team from '../components/Team';

const TeamPage: React.FC = () => {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className="min-h-screen bg-haast-black text-haast-text py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-white mb-8">Team</h1>
        <Team />
      </div>
    </div>
  );
};

export default TeamPage;
