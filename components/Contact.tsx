
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle, Instagram, Youtube, Twitter } from 'lucide-react';

const Contact: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('submitting');
    setTimeout(() => {
        setStatus('success');
        setEmail('');
        setMessage('');
        setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <footer id="contact" className="bg-[#050505] py-16 px-6 border-t border-white/5 relative">
        <div className="max-w-5xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-start justify-between">

                {/* Left: Branding & Direct Contact */}
                <div className="md:w-1/3">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-display font-bold text-3xl text-white mb-2 uppercase tracking-wide"
                    >
                        HAAST
                    </motion.h2>
                    <p className="font-sans text-haast-muted text-xs leading-relaxed mb-6">
                        Visual alchemy for the digital age.
                    </p>

                    <a href="mailto:hello@haast.prod" className="inline-flex items-center gap-2 font-mono text-sm text-white hover:text-haast-accent transition-colors group mb-6">
                        hello@haast.prod 
                        <ArrowUpRight size={12} className="opacity-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>

                    <div className="flex gap-4">
                        {[Instagram, Youtube, Twitter].map((Icon, i) => (
                            <a key={i} href="#" className="text-white/30 hover:text-white transition-colors">
                                <Icon size={16} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Right: Minimal Form */}
                <div className="md:w-2/3 w-full">
                     <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="EMAIL ADDRESS"
                                className="w-full bg-white/[0.03] border border-white/10 rounded px-4 py-3 font-mono text-xs text-white placeholder-white/20 outline-none focus:border-haast-accent focus:bg-white/[0.05] transition-all"
                            />
                            <button
                                type="submit"
                                disabled={status === 'submitting' || status === 'success'}
                                className="bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-haast-accent hover:text-white transition-all disabled:opacity-50 rounded flex items-center justify-center gap-2 py-3"
                            >
                                {status === 'submitting' ? 'SENDING...' : status === 'success' ? 'SENT' : 'INITIATE'}
                                {status === 'success' && <CheckCircle size={12} />}
                            </button>
                        </div>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="BRIEF / MESSAGE (OPTIONAL)"
                            rows={2}
                            className="w-full bg-white/[0.03] border border-white/10 rounded px-4 py-3 font-mono text-xs text-white placeholder-white/20 outline-none focus:border-haast-accent focus:bg-white/[0.05] transition-all resize-none"
                        />
                     </form>
                </div>
            </div>

            <div className="mt-12 pt-6 border-t border-white/5 flex justify-between items-center opacity-30 hover:opacity-100 transition-opacity duration-500">
                <span className="font-mono text-[9px] text-white uppercase">© 2025 Haast Productions.</span>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})} className="font-mono text-[9px] text-white uppercase hover:text-haast-accent">
                    Back to Top
                </button>
            </div>
        </div>
    </footer>
  );
};

export default Contact;
