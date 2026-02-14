import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedGrid from './AnimatedGrid';

const AdminLogin: React.FC = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });
            const result = await res.json();
            if (result.success) {
                navigate('/admin');
            } else {
                setError(result.message || 'Login failed.');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="audition-system" style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', background: '#020202',
        }}>
            <AnimatedGrid />
            {/* Blue glow */}
            <div style={{
                position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)',
                width: '600px', height: '400px', background: '#3b82f6',
                filter: 'blur(200px)', opacity: 0.06, pointerEvents: 'none',
            }} />

            <form onSubmit={handleSubmit} className="aud-card" style={{
                padding: '2.5rem', width: '100%', maxWidth: '400px',
                position: 'relative', zIndex: 1,
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        fontSize: '28px', fontWeight: 'bold', letterSpacing: '3px',
                        color: '#fff', marginBottom: '10px',
                    }}>HAAST</div>
                    <p style={{
                        fontSize: '0.75rem', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase',
                    }}>
                        Producers Panel
                    </p>
                </div>

                <div className="aud-field-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" placeholder="Enter username"
                        required className="aud-field" autoComplete="username" />
                </div>

                <div className="aud-field-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="Enter password"
                        required className="aud-field" autoComplete="current-password" />
                </div>

                {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

                <button type="submit" className="aud-btn aud-btn-blue" disabled={loading}
                    style={{ width: '100%', opacity: loading ? 0.6 : 1 }}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;
