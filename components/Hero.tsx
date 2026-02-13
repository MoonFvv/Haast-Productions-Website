import React from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import BlurText from './BlurText';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <section id="home" className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-haast-black pt-20">

      {/* Video Background */}


      {/* Glassmorphism Background Overlay (Hero-specific) */}
      <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-[3px] pointer-events-none z-0" />

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 select-none">

        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          transition={{ duration: 1, ease: "circOut", delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-8 whitespace-nowrap overflow-hidden mx-auto"
        >
          <span className="h-[1px] w-8 bg-haast-accent"></span>
          <span className="font-sans text-xs font-bold tracking-[0.3em] text-haast-accent uppercase">
            Visual Alchemy
          </span>
          <span className="h-[1px] w-8 bg-haast-accent"></span>
        </motion.div>

        {/* Replaced standard text with BlurText effect */}
        <div className="flex flex-col items-center">
          <div className="font-display font-extrabold text-[12vw] leading-[0.85] text-white perspective-text mix-blend-overlay">
            <BlurText text="HAAST" delay={0.5} />
          </div>

          <div className="mt-2 md:mt-4">
            <div className="font-display font-bold text-4xl md:text-6xl text-transparent text-outline tracking-tighter">
              <BlurText text="PRODUCTIONS" delay={1.2} direction="up" className="justify-center" />
            </div>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="font-sans text-haast-muted text-sm md:text-base max-w-md mx-auto mt-12 leading-relaxed"
        >
          We define the new wave of cinematic storytelling.
          <br className="hidden md:block" /> No rules. Just pure visual impact.
        </motion.p>

      </div>

      {/* Scroll Indicator - Right Side */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-2 z-10"
      >
        <span className="font-sans text-xs tracking-widest text-haast-muted whitespace-nowrap">SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-[1px] h-8 bg-gradient-to-b from-haast-accent to-transparent"
        />
      </motion.div>

    </section>
  );
};

export default Hero;