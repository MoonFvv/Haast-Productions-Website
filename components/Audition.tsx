import React, { useState } from 'react';

const Audition: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    role: '',
    headshot: '',
    showreel: '',
    message: '',
  });
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/audition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', age: '', role: '', headshot: '', showreel: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section id="audition" className="py-24 px-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-4xl font-bold text-white">Auditie — Meld je aan als acteur</h2>
        <p className="text-white/70 mt-2">We organiseren regelmatig audities voor korte films, commercials en projecten. Vul het formulier in; voeg headshot/showreel-links toe.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input name="name" value={form.name} onChange={handleChange} required placeholder="Naam" className="p-3 rounded bg-white/5 border border-white/10 text-white" />
        <input name="email" value={form.email} onChange={handleChange} required placeholder="E-mail" type="email" className="p-3 rounded bg-white/5 border border-white/10 text-white" />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Telefoon (optioneel)" className="p-3 rounded bg-white/5 border border-white/10 text-white" />
        <input name="age" value={form.age} onChange={handleChange} placeholder="Leeftijd (optioneel)" className="p-3 rounded bg-white/5 border border-white/10 text-white" />
        <input name="role" value={form.role} onChange={handleChange} placeholder="Rol / typecasting (optioneel)" className="p-3 rounded bg-white/5 border border-white/10 text-white" />
        <input name="headshot" value={form.headshot} onChange={handleChange} placeholder="Headshot URL (optioneel)" className="p-3 rounded bg-white/5 border border-white/10 text-white" />
        <input name="showreel" value={form.showreel} onChange={handleChange} placeholder="Showreel URL (optioneel)" className="p-3 rounded bg-white/5 border border-white/10 text-white" />
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Kort bericht / beschikbaarheid" rows={4} className="p-3 rounded bg-white/5 border border-white/10 text-white" />

        <div className="flex items-center gap-3">
          <button type="submit" className="px-6 py-3 bg-haast-accent text-white rounded font-bold">Aanmelden</button>
          {status === 'sending' && <span className="text-white/60">Versturen…</span>}
          {status === 'success' && <span className="text-green-400">Aanmelding ontvangen — we nemen contact op.</span>}
          {status === 'error' && <span className="text-red-400">Er is iets misgegaan. Probeer opnieuw.</span>}
        </div>
      </form>
    </section>
  );
};

export default Audition;
