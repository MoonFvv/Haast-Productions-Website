import React from 'react';
import Audition from '../components/Audition';
import AnimatedGrid from '../components/AnimatedGrid';

const AuditionPage: React.FC = () => {
  return (
    <div className="audition-system" style={{
      minHeight: '100vh', background: '#020202', color: '#ECECEC',
      position: 'relative',
    }}>
      <AnimatedGrid />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Audition />
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '2rem',
        borderTop: '1px solid #1a1a1a',
        color: '#333', fontSize: '0.75rem',
      }}>
        © {new Date().getFullYear()} Haast Productions. All rights reserved.
      </footer>
    </div>
  );
};

export default AuditionPage;
