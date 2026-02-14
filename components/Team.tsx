
import React from 'react';
import { TEAM } from '../constants';
import { motion } from 'framer-motion';

const Team: React.FC = () => {
    return (
        <section id="team" className="py-20 md:py-24 relative">

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center mb-16"
                >
                    <span className="font-mono text-[10px] text-haast-accent tracking-[0.3em] uppercase mb-4">
                        Active Personnel
                    </span>
                    <h2 className="font-display font-bold text-4xl md:text-6xl text-white tracking-tight">
                        THE SQUAD
                    </h2>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {TEAM.map((member, idx) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05, duration: 0.5 }}
                            className="group relative cursor-pointer"
                        >
                            {/* Image Card */}
                            <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-white/10 group-hover:border-haast-accent/50 transition-all duration-500">
                                {/* Image */}
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" />

                                {/* Scan Line */}
                                <div className="absolute top-0 w-full h-[1px] bg-haast-accent/50 opacity-0 group-hover:opacity-100 group-hover:top-[120%] transition-all duration-[1.5s] ease-linear" />

                                {/* Text Overlay */}
                                <div className="absolute bottom-0 left-0 w-full p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <p className="font-mono text-[8px] text-haast-accent mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        ID_0{member.id}
                                    </p>
                                    <h4 className="font-display font-bold text-lg text-white uppercase leading-none mb-1">
                                        {member.name}
                                    </h4>
                                    <p className="font-sans text-[10px] text-white/50 tracking-wider uppercase">
                                        {member.role}
                                    </p>
                                </div>
                            </div>

                            {/* Corner Markers */}
                            <div className="absolute -top-1 -left-1 w-1.5 h-1.5 border-t border-l border-white/20 group-hover:border-haast-accent transition-colors duration-300" />
                            <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b border-r border-white/20 group-hover:border-haast-accent transition-colors duration-300" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;
