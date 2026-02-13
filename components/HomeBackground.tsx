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
        {/* Light overlay for better text readability without darkening too much */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>
    </>
  );
};

export default HomeBackground;
