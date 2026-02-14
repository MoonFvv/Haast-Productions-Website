import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';
import AnimatedGrid from '../components/AnimatedGrid';

const AdminPage: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/admin/data', { credentials: 'include' })
            .then(res => {
                if (res.status === 401) {
                    navigate('/admin/login');
                    return null;
                }
                return res.json();
            })
            .then(d => {
                if (d) setData(d);
                setLoading(false);
            })
            .catch(() => {
                navigate('/admin/login');
            });
    }, [navigate]);

    if (loading) {
        return (
            <div className="audition-system" style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#020202', color: '#666', position: 'relative',
            }}>
                <AnimatedGrid />
                <span style={{ position: 'relative', zIndex: 1 }}>Loading...</span>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="audition-system" style={{ position: 'relative', minHeight: '100vh', background: '#020202' }}>
            <AnimatedGrid />
            <div style={{ position: 'relative', zIndex: 1 }}>
                <AdminDashboard
                    initialSubmissions={data.submissions}
                    initialQuestions={data.questions}
                    initialUsers={data.users}
                    currentUser={data.currentUser}
                />
            </div>
        </div>
    );
};

export default AdminPage;
