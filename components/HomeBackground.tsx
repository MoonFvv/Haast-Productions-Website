import React from 'react';

const HomeBackground: React.FC = () => {
  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Video background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute min-w-full min-h-full object-cover"
        >
          <source src="/websitehomepager.webm" type="video/webm" />
        </video>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-haast-black/90 pointer-events-none" />
      </div>
    </>
  );
};

export default HomeBackground;
