
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle, Instagram, Youtube, Music, Linkedin } from 'lucide-react';
import emailjs from '@emailjs/browser';

// Memoized motion heading
const MemoizedHeading = memo(() => (
  <motion.h2
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="font-display font-bold text-2xl sm:text-3xl text-white mb-2 uppercase tracking-wide"
  >
    HAAST
  </motion.h2>
));

const Contact: React.FC = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    emailjs.init('IlghnkwhGKWz5VTV2');
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('submitting');

    const templateParams = {
      to_email: 'info@haastproductions.com',
      from_email: email,
      phone: phone || 'Niet opgegeven',
      message: message || 'Geen bericht toegevoegd',
      reply_to: email,
    };

    emailjs
      .send('service_79smssp', 'template_pbl7xtl', templateParams)
      .then(
        () => {
          setStatus('success');
          setEmail('');
          setPhone('');
          setMessage('');
          setTimeout(() => setStatus('idle'), 3000);
        },
        (error) => {
          console.error('EmailJS error:', error);
          setStatus('error');
          setTimeout(() => setStatus('idle'), 3000);
        }
      );
  }, [email, phone, message]);

  return (
    <footer id="contact" className="bg-[#050505] py-12 sm:py-16 px-4 sm:px-6 border-t border-white/5 relative">
        <div className="max-w-5xl mx-auto relative z-10">
            <div className="flex flex-col gap-12 sm:gap-12 md:gap-24 md:flex-row items-start justify-between">

                {/* Left: Branding & Direct Contact */}
                <div className="w-full md:w-1/3 order-2 md:order-1">
                    <MemoizedHeading />
                    <p className="font-sans text-haast-muted text-xs leading-relaxed mb-6">
                        Visual alchemy for the digital age.
                    </p>

                    <a href="mailto:info@haastproductions.com" className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-white hover:text-haast-accent transition-colors group mb-6 break-all">
                        info@haastproductions.com 
                        <ArrowUpRight size={12} className="opacity-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
                    </a>

                    <div className="flex gap-4">
                        {[Instagram, Youtube, Music, Linkedin].map((Icon, i) => (
                            <a key={i} href="#" className="text-white/30 hover:text-white transition-colors">
                                <Icon size={16} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Right: Minimal Form */}
                <div className="w-full md:w-2/3 order-1 md:order-2">
                     <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
                        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="EMAIL ADDRESS"
                                className="w-full bg-white/[0.03] border border-white/10 rounded px-3 sm:px-4 py-3 font-mono text-xs text-white placeholder-white/20 outline-none focus:border-haast-accent focus:bg-white/[0.05] transition-all"
                            />
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="06 NUMMER (OPTIONEEL)"
                                className="w-full bg-white/[0.03] border border-white/10 rounded px-3 sm:px-4 py-3 font-mono text-xs text-white placeholder-white/20 outline-none focus:border-haast-accent focus:bg-white/[0.05] transition-all"
                            />
                            <button
                                type="submit"
                                disabled={status === 'submitting' || status === 'success'}
                                className="w-full sm:col-span-2 bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-haast-accent hover:text-white transition-all disabled:opacity-50 rounded flex items-center justify-center gap-2 py-3 active:scale-95"
                            >
                                {status === 'submitting' ? 'VERZENDEN...' : status === 'success' ? 'VERZONDEN' : status === 'error' ? 'ERROR' : 'VERSTUREN'}
                                {status === 'success' && <CheckCircle size={12} />}
                            </button>
                        </div>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="BRIEF / MESSAGE (OPTIONAL)"
                            rows={3}
                            className="w-full bg-white/[0.03] border border-white/10 rounded px-3 sm:px-4 py-3 font-mono text-xs text-white placeholder-white/20 outline-none focus:border-haast-accent focus:bg-white/[0.05] transition-all resize-none"
                        />
                     </form>
                </div>
            </div>

            <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 opacity-30 hover:opacity-100 transition-opacity duration-500">
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
