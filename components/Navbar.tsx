import React from 'react';
import { motion } from 'framer-motion';
import { NAV_LINKS } from '../constants';
import { Mail, Home } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <div className="fixed bottom-8 left-0 w-full z-50 flex justify-center pointer-events-none">
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "backOut" }}
        className="relative group pointer-events-auto"
      >
        {/* Fluid Glass Container */}
        <div className="absolute inset-0 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Fluid Blobs inside the glass */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-haast-accent/30 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl translate-x-1/2 translate-y-1/2 animate-pulse delay-1000" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
        </div>

        {/* Content */}
        <div className="relative px-2 py-1 flex items-center gap-1 z-10">
            {/* Logo Icon - Home */}
            <a href="#home" className="w-10 h-10 bg-haast-black/80 rounded-full flex items-center justify-center text-white mr-2 border border-white/10 hover:bg-haast-accent transition-colors duration-300">
                <Home size={18} />
            </a>

            {/* Links */}
            <div className="flex items-center">
                {NAV_LINKS.map((link) => (
                    <a 
                        key={link.name} 
                        href={link.href}
                        className="relative px-5 py-2 rounded-full font-sans text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                    >
                        {link.name}
                    </a>
                ))}
            </div>

            {/* CTA - Contact */}
            <a href="#contact" className="group/cta ml-2 w-40 h-10 bg-haast-accent text-white rounded-full flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.8)] transition-all duration-300">
                <Mail size={16} className="transition-transform duration-300 group-hover/cta:rotate-12 flex-shrink-0" />
                <span className="font-mono text-xs font-bold uppercase whitespace-nowrap">
                    Neem Contact Op
                </span>
            </a>
        </div>
      </motion.nav>
    </div>
  );
};

export default Navbar;