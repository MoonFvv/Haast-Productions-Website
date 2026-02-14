import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="text-white/80">© {new Date().getFullYear()} HAAST Productions</div>
            <div className="text-white/70">info@haastproductions.com</div>
          </div>
        <div className="flex items-center gap-4">
          <Link to="/shortfilm" className="text-white/70 hover:text-white">Shortfilm — uitleg</Link>
          <Link to="/gear" className="text-white/70 hover:text-white">Gear</Link>
          <a href="#" className="text-white/60 hover:text-white/80">Privacy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
