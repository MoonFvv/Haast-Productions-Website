
import React, { useState, useRef, useEffect } from 'react';
import { PORTFOLIO_ITEMS } from '../constants';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Play, Crosshair, Aperture, Disc, Maximize2, MoreHorizontal } from 'lucide-react';

const Portfolio: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="work" ref={containerRef} className="bg-haast-black relative min-h-screen py-24 md:py-32">
        
      <div className="max-w-[1800px] mx-auto px-4 md:px-8">
        
        {/* Section Title */}
        <div className="mb-16 md:mb-32 px-2 md:px-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 mb-4"
            >
                <div className="w-2 h-2 bg-haast-accent animate-pulse rounded-full" />
                <span className="font-mono text-xs tracking-[0.2em] text-haast-accent uppercase">
                    Select Archive
                </span>
            </motion.div>
            <h2 className="font-display font-bold text-5xl md:text-8xl text-white leading-[0.85] tracking-tight">
                VISUAL <span className="text-outline md:ml-4">RECORDS</span>
            </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-20">
            
            {/* LEFT COLUMN - SCROLLING LIST */}
            <div className="w-full md:w-5/12 flex flex-col gap-24 md:gap-48 pb-24 md:pb-96 pt-0 md:pt-12 order-2 md:order-1">
                {PORTFOLIO_ITEMS.map((project, index) => (
                    <ProjectItem 
                        key={project.id} 
                        project={project} 
                        index={index} 
                        setActiveIndex={setActiveIndex} 
                    />
                ))}
            </div>

            {/* RIGHT COLUMN - STICKY PREVIEW MONITOR */}
            <div className="hidden md:block w-7/12 h-[80vh] sticky top-24 order-1 md:order-2">
                <div className="w-full h-full relative rounded-lg border border-white/10 bg-[#080808] overflow-hidden group">
                    
                    {/* Monitor Frame & HUD */}
                    <div className="absolute inset-0 z-20 pointer-events-none p-6 flex flex-col justify-between">
                        {/* Top HUD */}
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-haast-accent/80">
                                    <Crosshair size={20} className="animate-spin-slow" />
                                    <span className="font-mono text-[10px] tracking-widest">TRGT_LOCKED</span>
                                </div>
                                <span className="font-mono text-[10px] text-white/40">
                                    ISO 800 • 1/50 • 4K RAW
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="px-2 py-1 border border-white/20 rounded bg-black/50 backdrop-blur-sm">
                                    <span className="font-mono text-[10px] text-white/80">REC</span>
                                    <span className="ml-2 w-2 h-2 bg-red-500 rounded-full inline-block animate-pulse" />
                                </div>
                                <Maximize2 size={16} className="text-white/40" />
                            </div>
                        </div>

                        {/* Center HUD */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/5 rounded-full flex items-center justify-center">
                            <div className="w-1 h-1 bg-white/50 rounded-full" />
                        </div>
                        <div className="absolute top-1/2 left-4 w-1 h-12 bg-white/10 rounded-full">
                             <div className="w-full h-1/2 bg-haast-accent/80 rounded-full" />
                        </div>

                        {/* Bottom HUD */}
                        <div className="flex justify-between items-end">
                            <div className="flex gap-8">
                                <div>
                                    <span className="block font-mono text-[9px] text-white/30 uppercase mb-1">Coordinates</span>
                                    <span className="block font-mono text-xs text-white/80">34.0522° N, 118.2437° W</span>
                                </div>
                                <div>
                                    <span className="block font-mono text-[9px] text-white/30 uppercase mb-1">Drone Link</span>
                                    <span className="flex items-center gap-2 font-mono text-xs text-haast-accent">
                                        <Aperture size={12} className="animate-spin" /> ONLINE
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="font-display text-4xl text-white/10 font-bold">
                                    0{activeIndex + 1}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Image Render Area */}
                    <div className="absolute inset-0 z-10">
                        <AnimatePresence mode="popLayout">
                            <motion.img
                                key={PORTFOLIO_ITEMS[activeIndex].id}
                                src={PORTFOLIO_ITEMS[activeIndex].image}
                                alt="Project Preview"
                                initial={{ opacity: 0, scale: 1.1, filter: "grayscale(100%) blur(5px)" }}
                                animate={{ opacity: 1, scale: 1, filter: "grayscale(0%) blur(0px)" }}
                                exit={{ opacity: 0, scale: 1, filter: "grayscale(100%) blur(5px)" }}
                                transition={{ duration: 0.7, ease: "easeInOut" }}
                                className="w-full h-full object-cover"
                            />
                        </AnimatePresence>
                        
                        {/* Cinematic Grain & Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                        
                        {/* Scanline */}
                        <motion.div 
                            initial={{ top: "-10%" }}
                            animate={{ top: "110%" }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-2 bg-white/10 blur-[1px] z-30 pointer-events-none" 
                        />
                    </div>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
}

interface ProjectItemProps {
    project: typeof PORTFOLIO_ITEMS[0];
    index: number;
    setActiveIndex: (index: number) => void;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, index, setActiveIndex }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start center", "end center"]
    });
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
    const x = useTransform(scrollYProgress, [0, 0.5, 1], [-20, 0, -20]);

    // Update active index when this item is in view
    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            if (latest > 0.2 && latest < 0.8) {
                setActiveIndex(index);
            }
        });
        return () => unsubscribe();
    }, [scrollYProgress, index, setActiveIndex]);

    return (
        <motion.div 
            ref={ref}
            style={{ opacity, scale, x }}
            className="group relative"
        >
            {/* Mobile Image (Visible only on mobile) */}
            <div className="block md:hidden mb-6 rounded-xl overflow-hidden aspect-video border border-white/10 relative">
                 <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/20" />
                 <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur rounded border border-white/10">
                    <span className="font-mono text-[10px] text-haast-accent">REC</span>
                 </div>
            </div>

            <div className="flex flex-col gap-6 p-6 md:p-10 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-500 backdrop-blur-sm">
                
                {/* Header Tags */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex gap-2">
                        {project.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 rounded-sm bg-white/5 text-[10px] font-mono uppercase text-haast-muted">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <span className="font-mono text-xs text-white/30">
                        {project.year}
                    </span>
                </div>

                {/* Title */}
                <div>
                    <h3 className="font-display font-bold text-4xl md:text-6xl text-white uppercase mb-2 group-hover:text-haast-accent transition-colors duration-300">
                        {project.title}
                    </h3>
                    <div className="flex items-center gap-2 text-haast-accent/60 font-mono text-xs tracking-wider">
                         <span className="w-4 h-[1px] bg-haast-accent/60"></span>
                         {project.category}
                    </div>
                </div>

                {/* Description */}
                <p className="font-sans text-haast-muted leading-relaxed text-sm md:text-base max-w-md">
                    {project.description}
                </p>

                {/* Action Button */}
                <div className="pt-4">
                    <button className="flex items-center gap-3 text-white/60 hover:text-white group-hover:gap-6 transition-all duration-300">
                        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-transparent group-hover:bg-haast-accent group-hover:border-haast-accent group-hover:text-black transition-all">
                            <ArrowUpRight size={18} />
                        </div>
                        <span className="font-mono text-xs uppercase tracking-widest">View Case Study</span>
                    </button>
                </div>

            </div>

            {/* Hover Indicator Line (Desktop) */}
            <div className="hidden md:block absolute -left-6 top-10 bottom-10 w-[1px] bg-white/10">
                <motion.div 
                    style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
                    className="w-full bg-haast-accent absolute top-0 bottom-0"
                />
            </div>
        </motion.div>
    );
};

export default Portfolio;
