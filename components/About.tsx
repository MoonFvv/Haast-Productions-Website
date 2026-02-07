import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 md:py-40 px-6 bg-haast-panel relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        <div>
            <motion.h2 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="font-display font-bold text-4xl md:text-6xl text-white leading-tight mb-8"
            >
                Filming at the <br/>
                <span className="text-haast-accent">speed</span> of ambition.
            </motion.h2>
        </div>

        <div>
             <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-sans text-haast-muted text-lg md:text-xl leading-relaxed mb-6"
            >
                Haast Productions is a new-age creative studio. We moved away from traditional agency models to create something faster, bolder, and more authentic.
            </motion.p>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="font-sans text-haast-muted text-base leading-relaxed"
            >
                Whether it's the intense action of <em>Urban Heat</em> or the quiet drama of <em>The Lost Soldier</em>, we apply cinematic rigor to every frame. No filler. No fluff. Just story.
            </motion.p>
        </div>

      </div>
    </section>
  );
};

export default About;