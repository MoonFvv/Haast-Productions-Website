import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload';

interface Question {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
}

const Audition: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/audition/questions')
      .then(res => res.json())
      .then(data => { setQuestions(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/audition/submit', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message || 'Something went wrong.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
        Loading...
      </div>
    );
  }

  if (success) {
    return (
      <div className="aud-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'rgba(34, 197, 94, 0.1)', border: '2px solid #22c55e',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem', fontSize: '1.5rem',
        }}>✓</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.8rem', color: '#fff' }}>Application Received</h2>
        <p style={{ color: '#666', maxWidth: '400px', margin: '0 auto', lineHeight: 1.7, fontSize: '0.9rem' }}>
          Thank you for your interest. We'll review your submission and reach out if selected.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="aud-btn aud-btn-outline"
          style={{ marginTop: '2rem' }}
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section style={{
        padding: '8rem 2rem 4rem', textAlign: 'center',
        position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto',
      }}>
        {/* Blue ambient glow */}
        <div style={{
          position: 'fixed', top: '-200px', left: '50%', transform: 'translateX(-50%)',
          width: '800px', height: '500px', background: '#3b82f6',
          filter: 'blur(250px)', opacity: 0.07, pointerEvents: 'none', zIndex: 0,
        }} />

        <div style={{
          display: 'inline-block', padding: '0.4rem 1rem', borderRadius: '20px',
          background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
          fontSize: '0.75rem', color: '#3b82f6', fontWeight: 500,
          marginBottom: '2rem', letterSpacing: '0.05em',
        }}>
          NOW ACCEPTING SUBMISSIONS
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', fontWeight: 700,
          lineHeight: 1.15, marginBottom: '1.5rem', paddingBottom: '0.1em',
          background: 'linear-gradient(to bottom, #fff 40%, #666)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Casting Call
        </h1>

        <p style={{
          fontSize: '1.05rem', color: '#666', lineHeight: 1.7,
          maxWidth: '500px', margin: '0 auto 3rem',
        }}>
          We're looking for talented individuals for our upcoming short film.
          Submit your profile and audition video below.
        </p>

        {/* Requirement pills */}
        <div style={{
          display: 'flex', gap: '0.75rem', justifyContent: 'center',
          flexWrap: 'wrap' as const, marginBottom: '3rem',
        }}>
          {[
            { icon: '📸', text: 'Headshot' },
            { icon: '🎬', text: 'Audition Video' },
            { icon: '📝', text: 'Motivation' },
          ].map((r, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1rem', borderRadius: '8px',
              background: '#111', border: '1px solid #1a1a1a',
              fontSize: '0.8rem', color: '#aaa',
            }}>
              <span>{r.icon}</span> {r.text}
            </div>
          ))}
        </div>

        <a href="#apply" className="aud-btn aud-btn-blue" style={{ padding: '0.85rem 2.5rem', textDecoration: 'none' }}>
          Start Application →
        </a>
      </section>

      {/* Divider line */}
      <div style={{
        width: '1px', height: '80px',
        background: 'linear-gradient(to bottom, transparent, #333, transparent)',
        margin: '0 auto',
      }} />

      {/* Form Section */}
      <section id="apply" style={{
        padding: '4rem 1.5rem 6rem', maxWidth: '640px', margin: '0 auto',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{
            fontSize: '0.7rem', color: '#3b82f6', fontWeight: 500,
            textTransform: 'uppercase' as const, letterSpacing: '0.15em', marginBottom: '0.5rem',
          }}>
            Application Form
          </p>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#fff' }}>Tell us about yourself</h2>
        </div>

        <form onSubmit={handleSubmit} className="aud-card" style={{ padding: '2rem' }}>
          {questions.map((q) => (
            <div key={q.id} className="aud-field-group">
              {q.type !== 'file' && (
                <label htmlFor={q.id}>{q.label} {q.required && <span className="aud-req">*</span>}</label>
              )}

              {q.type === 'textarea' ? (
                <textarea
                  id={q.id} name={q.id} required={q.required}
                  placeholder={q.placeholder} className="aud-field" rows={4}
                />
              ) : q.type === 'select' ? (
                <select id={q.id} name={q.id} required={q.required} className="aud-field">
                  <option value="">Select...</option>
                  {q.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : q.type === 'file' ? (
                <FileUpload
                  id={q.id} label={q.label} required={q.required}
                  accept={q.id.toLowerCase().includes('video') ? 'video/*' : 'image/*,.pdf'}
                />
              ) : (
                <input
                  type={q.type} id={q.id} name={q.id} required={q.required}
                  placeholder={q.placeholder} className="aud-field"
                />
              )}
            </div>
          ))}

          {error && (
            <p style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1rem' }}>
              {error}
            </p>
          )}

          <button
            type="submit" disabled={submitting}
            className="aud-btn aud-btn-blue"
            style={{ width: '100%', padding: '0.9rem', marginTop: '0.5rem', opacity: submitting ? 0.6 : 1 }}
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </section>
    </>
  );
};

export default Audition;
