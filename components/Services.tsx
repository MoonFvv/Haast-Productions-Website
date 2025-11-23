
import React from 'react';
import { GEAR_CATEGORIES } from '../constants';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const Gear: React.FC = () => {
  return (
    <section id="gear" className="py-32 bg-[#080808] relative overflow-hidden">
        {/* Subtle Technical Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-20">
                <div>
                     <div className="flex items-center gap-2 mb-3">
                        <Activity size={16} className="text-haast-accent animate-pulse" />
                        <span className="font-mono text-[10px] text-haast-accent tracking-widest uppercase bg-haast-accent/10 px-2 py-1 rounded">
                            Technical Manifest
                        </span>
                     </div>
                     <h2 className="font-display font-bold text-5xl md:text-7xl text-white tracking-tighter leading-none">
                        THE ARSENAL
                     </h2>
                </div>
                <div className="mt-8 md:mt-0 font-mono text-[10px] text-haast-muted text-right space-y-1">
                    <p>STATUS: <span className="text-green-500">ONLINE</span></p>
                    <p>LAST DEPLOYMENT: 24H AGO</p>
                    <p>REGION: GLOBAL</p>
                </div>
            </div>

            {/* Tactical Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {GEAR_CATEGORIES.map((category, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="group relative bg-white/[0.02] backdrop-blur-sm border border-white/5 hover:border-haast-accent/40 transition-all duration-500 p-8 md:p-12 overflow-visible z-10 hover:z-20"
                    >
                        {/* HUD Corner Accents */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-haast-accent group-hover:w-4 group-hover:h-4 transition-all duration-300" />
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-haast-accent group-hover:w-4 group-hover:h-4 transition-all duration-300" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-haast-accent group-hover:w-4 group-hover:h-4 transition-all duration-300" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-haast-accent group-hover:w-4 group-hover:h-4 transition-all duration-300" />

                        {/* Content Header */}
                        <div className="flex justify-between items-start mb-10 border-b border-white/5 pb-6 border-dashed">
                            <div className="flex items-center gap-4">
                                <div className="bg-white/5 p-3 rounded text-white group-hover:text-haast-accent group-hover:bg-haast-accent/10 transition-all duration-300">
                                    <category.icon size={22} />
                                </div>
                                <h3 className="font-display font-bold text-2xl text-white uppercase tracking-wide">
                                    {category.category}
                                </h3>
                            </div>
                            <span className="font-mono text-xl text-white/5 font-bold group-hover:text-haast-accent/20 transition-colors">
                                0{idx + 1}
                            </span>
                        </div>

                        {/* Inventory List */}
                        <ul className="space-y-3 relative z-10">
                            {category.items.map((item, i) => (
                                <li key={i} className="group/item relative flex items-center gap-4 font-mono text-xs text-haast-muted cursor-default">
                                    <span className="w-1.5 h-1.5 bg-haast-accent/50 rounded-full group-hover/item:bg-haast-accent group-hover/item:shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-300" />
                                    <span className="group-hover/item:text-white transition-colors duration-300">{item.name}</span>
                                    
                                    {/* Tooltip */}
                                    <div className="absolute left-0 bottom-full mb-2 w-max max-w-[200px] hidden group-hover/item:block z-50">
                                        <div className="bg-[#111] border border-white/10 rounded px-3 py-2 shadow-xl relative">
                                            <p className="text-[10px] text-white/90 leading-normal">{item.description}</p>
                                            {/* Arrow */}
                                            <div className="absolute -bottom-1 left-2 w-2 h-2 bg-[#111] border-b border-r border-white/10 rotate-45"></div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Scanline Effect - Moved inside a wrapper to allow card overflow-visible for tooltips if needed, but styling adjusted for internal popups */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-lg">
                             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-haast-accent/[0.03] to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-in-out" />
                        </div>
                    </motion.div>
                ))}
            </div>
            
            <div className="mt-8 flex justify-between border-t border-white/5 pt-4">
                 <p className="font-mono text-[9px] text-white/20">HAAST_INTERNAL_SYSTEMS_V4.2</p>
                 <p className="font-mono text-[9px] text-white/20">AUTHORIZED_PERSONNEL_ONLY</p>
            </div>
        </div>
    </section>
  );
};

export default Gear;
