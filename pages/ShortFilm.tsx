import React from 'react';

const ShortFilm: React.FC = () => {
  return (
    <div className="min-h-screen bg-haast-black text-haast-text py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">Onze nieuwe shortfilm — Uitleg</h1>
        <p className="text-white/80 leading-relaxed mb-6">
          Hier komt een uitgebreide uitleg over onze nieuwe shortfilm: achtergrond, concept, het creatieve team en hoe we het technisch hebben aangepakt. Voeg hier shots, behind-the-scenes, en credits toe.
        </p>
        <section className="bg-white/5 p-6 rounded">
          <h2 className="text-xl font-semibold text-white mb-2">Waarom deze film?</h2>
          <p className="text-white/70">Korte motivatie en wat we willen bereiken met de film.</p>
        </section>
      </div>
    </div>
  );
};

export default ShortFilm;
