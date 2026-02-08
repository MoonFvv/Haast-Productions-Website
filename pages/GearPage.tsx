import React, { useEffect } from 'react';
import Gear from '../components/Services';
import { Link } from 'react-router-dom';

const GearPage: React.FC = () => {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div className="min-h-screen bg-haast-black text-haast-text py-16 flex flex-col overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 flex-1">
        <h1 className="text-4xl font-bold text-white mb-8">Gear</h1>
        <Gear />
      </div>

      <footer className="mt-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white/70 text-sm">© {new Date().getFullYear()} HAAST Productions</div>
          <div className="flex items-center gap-4">
            <a href="mailto:info@haastproductions.com" className="text-sm text-white/80 hover:text-white">info@haastproductions.com</a>
            <Link to="/shortfilm" className="text-sm text-white/70 hover:text-white">Shortfilm</Link>
            <a href="/privacy" className="text-sm text-white/60 hover:text-white/80">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GearPage;
