import React from 'react';
import Audition from '../components/Audition';

const AuditionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-haast-black text-haast-text py-16">
      <div className="max-w-4xl mx-auto px-6">
        <Audition />
      </div>
    </div>
  );
};

export default AuditionPage;
