import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
    initialSubmissions: any[];
    initialQuestions: any[];
    initialUsers: any[];
    currentUser: { userId: string; username: string; role: string };
}

function isFileUrl(v: string) { return typeof v === 'string' && v.startsWith('/uploads/'); }
function isVideo(v: string) { return /\.(mp4|mov|webm|avi|mkv)$/i.test(v); }
function isImage(v: string) { return /\.(jpg|jpeg|png|gif|webp|bmp|heic)$/i.test(v); }
function getMime(u: string) { return u.endsWith('.mov') ? 'video/quicktime' : u.endsWith('.webm') ? 'video/webm' : 'video/mp4'; }
function ago(d: string) {
    const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (s < 60) return 'now';
    if (s < 3600) return `${Math.floor(s / 60)}m`;
    if (s < 86400) return `${Math.floor(s / 3600)}h`;
    return `${Math.floor(s / 86400)}d`;
}
function labelText(k: string) {
    return k.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
}

const STATUSES = [
    { key: 'pending', label: 'Pending', color: '#f59e0b' },
    { key: 'reviewed', label: 'Reviewed', color: '#3b82f6' },
    { key: 'callback', label: 'Callback', color: '#22c55e' },
    { key: 'rejected', label: 'Rejected', color: '#ef4444' },
];

const API_BASE = '/api/admin';

async function apiCall(url: string, options: RequestInit = {}) {
    const res = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...options.headers },
    });
    return res.json();
}

const AdminDashboard: React.FC<Props> = ({ initialSubmissions, initialQuestions, initialUsers, currentUser }) => {
    const navigate = useNavigate();
    const [page, setPage] = useState<'submissions' | 'form' | 'team'>('submissions');
    const [subs, setSubs] = useState(initialSubmissions);
    const [questions, setQuestions] = useState(initialQuestions);
    const [users, setUsers] = useState(initialUsers);
    const [selected, setSelected] = useState<any>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [saving, setSaving] = useState(false);
    const [nu, setNu] = useState('');
    const [np, setNp] = useState('');
    const [nr, setNr] = useState('viewer');

    const isAdmin = currentUser.role === 'admin';

    const counts = useMemo(() => {
        const c: Record<string, number> = { all: subs.length };
        STATUSES.forEach(s => { c[s.key] = subs.filter(x => (x.status || 'pending') === s.key).length; });
        return c;
    }, [subs]);

    const filtered = useMemo(() => subs.filter(s => {
        if (statusFilter !== 'all' && (s.status || 'pending') !== statusFilter) return false;
        if (search) {
            const q = search.toLowerCase();
            return Object.values(s.data).some(v => String(v).toLowerCase().includes(q));
        }
        return true;
    }), [subs, statusFilter, search]);

    const thumb = (d: any) => {
        for (const v of Object.values(d)) {
            const s = String(v);
            if (isFileUrl(s) && isImage(s)) return s;
        }
        return null;
    };

    // Actions
    const changeStatus = async (id: string, status: string) => {
        const r = await apiCall(`${API_BASE}/submissions/${id}`, {
            method: 'PUT', body: JSON.stringify({ status }),
        });
        if (r.success) {
            setSubs(p => p.map(s => s.id === id ? { ...s, status } : s));
            if (selected?.id === id) setSelected((p: any) => ({ ...p, status }));
        }
    };

    const saveNotes = async (id: string, notes: string) => {
        await apiCall(`${API_BASE}/submissions/${id}`, {
            method: 'PUT', body: JSON.stringify({ internal_notes: notes }),
        });
    };

    const deleteSub = async (id: string) => {
        if (!confirm('Delete this submission permanently?')) return;
        const r = await apiCall(`${API_BASE}/submissions/${id}`, { method: 'DELETE' });
        if (r.success) { setSubs(p => p.filter(s => s.id !== id)); setSelected(null); }
    };

    // Form builder
    const addQ = () => setQuestions([...questions, { id: `q_${Date.now()}`, type: 'text', label: '', required: false, placeholder: '' }]);
    const updQ = (i: number, f: string, v: any) => { const q = [...questions]; q[i] = { ...q[i], [f]: v }; setQuestions(q); };
    const delQ = (i: number) => setQuestions(questions.filter((_, j) => j !== i));
    const moveQ = (i: number, d: number) => { const q = [...questions];[q[i], q[i + d]] = [q[i + d], q[i]]; setQuestions(q); };
    const saveForm = async () => {
        setSaving(true);
        await apiCall(`${API_BASE}/questions`, {
            method: 'PUT', body: JSON.stringify({ questions }),
        });
        setSaving(false);
    };

    // Team
    const addUser = async () => {
        if (!nu || !np) return;
        const r = await apiCall(`${API_BASE}/users`, {
            method: 'POST', body: JSON.stringify({ username: nu, password: np, role: nr }),
        });
        if (r.success) {
            setUsers([...users, { id: Date.now().toString(), username: nu, role: nr, created_at: new Date().toISOString() }]);
            setNu(''); setNp('');
        }
    };

    const removeUser = async (id: string) => {
        if (!confirm('Remove this user?')) return;
        const r = await apiCall(`${API_BASE}/users/${id}`, { method: 'DELETE' });
        if (r.success) setUsers(users.filter(u => u.id !== id));
    };

    const handleLogout = async () => {
        await apiCall(`${API_BASE}/logout`, { method: 'POST' });
        navigate('/admin/login');
    };

    return (
        <div className="admin-layout">
            {/* ===== SIDEBAR ===== */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-top">
                    <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '3px', color: '#fff' }}>HAAST</div>
                </div>

                <nav className="admin-nav">
                    <div className="admin-nav-section">
                        <span className="admin-nav-label">Overview</span>
                        <button className={`admin-nav-item ${page === 'submissions' ? 'admin-nav-active' : ''}`}
                            onClick={() => { setPage('submissions'); setSelected(null); }}>
                            <span className="admin-nav-icon">📋</span>
                            Submissions
                            <span className="admin-nav-badge">{counts.all}</span>
                        </button>
                    </div>

                    {isAdmin && (
                        <div className="admin-nav-section">
                            <span className="admin-nav-label">Settings</span>
                            <button className={`admin-nav-item ${page === 'form' ? 'admin-nav-active' : ''}`}
                                onClick={() => { setPage('form'); setSelected(null); }}>
                                <span className="admin-nav-icon">📝</span>
                                Form Builder
                            </button>
                            <button className={`admin-nav-item ${page === 'team' ? 'admin-nav-active' : ''}`}
                                onClick={() => { setPage('team'); setSelected(null); }}>
                                <span className="admin-nav-icon">👥</span>
                                Team
                                <span className="admin-nav-badge">{users.length}</span>
                            </button>
                        </div>
                    )}
                </nav>

                <div className="admin-sidebar-bottom">
                    <div className="admin-user-info">
                        <div className="admin-user-avatar">{currentUser.username[0]?.toUpperCase()}</div>
                        <div>
                            <div className="admin-user-name">{currentUser.username}</div>
                            <div className="admin-user-role">{currentUser.role}</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="admin-logout-btn">Sign out</button>
                </div>
            </aside>

            {/* ===== MAIN ===== */}
            <main className="admin-main">

                {/* =================== SUBMISSIONS LIST =================== */}
                {page === 'submissions' && !selected && (
                    <>
                        <div className="admin-page-header">
                            <h1>Submissions</h1>
                            <p className="admin-header-sub">{counts.all} total · {counts.pending || 0} pending</p>
                        </div>

                        {/* Status counters */}
                        <div className="admin-counters">
                            {STATUSES.map(s => (
                                <button key={s.key}
                                    className={`admin-counter ${statusFilter === s.key ? 'admin-counter-active' : ''}`}
                                    style={{ '--c': s.color } as any}
                                    onClick={() => setStatusFilter(statusFilter === s.key ? 'all' : s.key)}>
                                    <span className="admin-counter-num">{counts[s.key]}</span>
                                    <span className="admin-counter-label">{s.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="admin-toolbar">
                            <input type="text" placeholder="Search..." value={search}
                                onChange={e => setSearch(e.target.value)} className="admin-search" />
                            {(search || statusFilter !== 'all') && (
                                <button className="admin-clear-all" onClick={() => { setSearch(''); setStatusFilter('all'); }}>
                                    Clear filters
                                </button>
                            )}
                        </div>

                        {/* Table */}
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '40px' }}></th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                        <th>Submitted</th>
                                        <th style={{ width: '30px' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="admin-empty-row">
                                                {search || statusFilter !== 'all' ? 'No matching submissions' : 'No submissions yet'}
                                            </td>
                                        </tr>
                                    ) : filtered.map(sub => {
                                        const t = thumb(sub.data);
                                        const st = sub.status || 'pending';
                                        const info = STATUSES.find(s => s.key === st)!;
                                        return (
                                            <tr key={sub.id} onClick={() => setSelected(sub)} className="admin-row">
                                                <td>
                                                    {t ? (
                                                        <img src={t} alt="" className="admin-row-thumb" />
                                                    ) : (
                                                        <div className="admin-row-initial">{(sub.data.name || '?')[0]?.toUpperCase()}</div>
                                                    )}
                                                </td>
                                                <td className="admin-row-name">{sub.data.name || sub.data.full_name || '—'}</td>
                                                <td className="admin-row-email">{sub.data.email || '—'}</td>
                                                <td>
                                                    <span className="admin-status-dot" style={{ background: info.color }}></span>
                                                    <span className="admin-status-text">{info.label}</span>
                                                </td>
                                                <td className="admin-row-time">{ago(sub.created_at)} ago</td>
                                                <td className="admin-row-arrow">→</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* =================== DETAIL VIEW =================== */}
                {page === 'submissions' && selected && (
                    <div className="admin-detail">
                        <button className="admin-back-btn" onClick={() => setSelected(null)}>← All submissions</button>

                        <div className="admin-detail-top">
                            <div className="admin-detail-info">
                                {thumb(selected.data) ? (
                                    <img src={thumb(selected.data)!} alt="" className="admin-detail-avatar" />
                                ) : (
                                    <div className="admin-detail-avatar-placeholder">
                                        {(selected.data.name || selected.data.full_name || '?')[0]?.toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h2>{selected.data.name || selected.data.full_name || 'Unknown'}</h2>
                                    <p className="admin-detail-meta">
                                        Submitted {new Date(selected.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <button className="admin-delete-btn" onClick={() => deleteSub(selected.id)}>Delete</button>
                        </div>

                        {/* Status pills */}
                        <div className="admin-detail-status">
                            <span className="admin-field-label">Status</span>
                            <div className="admin-pills">
                                {STATUSES.map(s => (
                                    <button key={s.key}
                                        className={`admin-pill ${(selected.status || 'pending') === s.key ? 'admin-pill-active' : ''}`}
                                        style={(selected.status || 'pending') === s.key ? { borderColor: s.color, color: s.color } : {}}
                                        onClick={() => changeStatus(selected.id, s.key)}>
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* All fields */}
                        <div className="admin-fields">
                            {Object.entries(selected.data).map(([key, val]) => {
                                const s = String(val);
                                const l = labelText(key);

                                if (isFileUrl(s) && isVideo(s)) return (
                                    <div key={key} className="admin-field admin-field-wide">
                                        <span className="admin-field-label">{l}</span>
                                        <video controls preload="metadata" playsInline className="admin-video">
                                            <source src={s} type={getMime(s)} />
                                        </video>
                                        <a href={s} target="_blank" rel="noopener noreferrer" className="admin-link">Open in new tab ↗</a>
                                    </div>
                                );
                                if (isFileUrl(s) && isImage(s)) return (
                                    <div key={key} className="admin-field admin-field-wide">
                                        <span className="admin-field-label">{l}</span>
                                        <a href={s} target="_blank" rel="noopener noreferrer">
                                            <img src={s} alt={l} className="admin-field-img" />
                                        </a>
                                    </div>
                                );
                                if (isFileUrl(s)) return (
                                    <div key={key} className="admin-field">
                                        <span className="admin-field-label">{l}</span>
                                        <a href={s} target="_blank" rel="noopener noreferrer" className="admin-link">📎 Download ↗</a>
                                    </div>
                                );
                                return (
                                    <div key={key} className="admin-field">
                                        <span className="admin-field-label">{l}</span>
                                        <p className="admin-field-value">{s || '—'}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Notes */}
                        <div className="admin-notes-section">
                            <span className="admin-field-label">Internal Notes</span>
                            <textarea className="admin-notes" rows={3}
                                defaultValue={selected.internal_notes || ''}
                                onBlur={e => saveNotes(selected.id, e.target.value)}
                                placeholder="Private notes..." />
                        </div>
                    </div>
                )}

                {/* =================== FORM BUILDER =================== */}
                {page === 'form' && isAdmin && (
                    <>
                        <div className="admin-page-header">
                            <h1>Form Builder</h1>
                            <p className="admin-header-sub">Edit the questions on the public audition form</p>
                        </div>

                        <div className="admin-form-list">
                            {questions.map((q: any, i: number) => (
                                <div key={q.id} className="admin-q-row">
                                    <span className="admin-q-num">{i + 1}</span>
                                    <div className="admin-q-fields">
                                        <input className="admin-q-input" value={q.label}
                                            onChange={e => updQ(i, 'label', e.target.value)} placeholder="Question label" />
                                        <div className="admin-q-meta">
                                            <select className="admin-q-select" value={q.type}
                                                onChange={e => updQ(i, 'type', e.target.value)}>
                                                <option value="text">Text</option>
                                                <option value="email">Email</option>
                                                <option value="tel">Phone</option>
                                                <option value="textarea">Long text</option>
                                                <option value="select">Dropdown</option>
                                                <option value="url">URL</option>
                                                <option value="file">File upload</option>
                                            </select>
                                            <label className="admin-q-check">
                                                <input type="checkbox" checked={q.required}
                                                    onChange={e => updQ(i, 'required', e.target.checked)} />
                                                Required
                                            </label>
                                            {q.type === 'select' && (
                                                <input className="admin-q-input" style={{ flex: 2 }}
                                                    value={q.options?.join(', ') || ''}
                                                    onChange={e => updQ(i, 'options', e.target.value.split(',').map((s: string) => s.trim()))}
                                                    placeholder="Option 1, Option 2, ..." />
                                            )}
                                        </div>
                                    </div>
                                    <div className="admin-q-actions">
                                        <button disabled={i === 0} onClick={() => moveQ(i, -1)}>↑</button>
                                        <button disabled={i === questions.length - 1} onClick={() => moveQ(i, 1)}>↓</button>
                                        <button onClick={() => delQ(i)} className="admin-q-del">×</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="admin-form-actions">
                            <button className="admin-add-btn" onClick={addQ}>+ Add question</button>
                            <button className="admin-save-btn" onClick={saveForm} disabled={saving}>
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </>
                )}

                {/* =================== TEAM =================== */}
                {page === 'team' && isAdmin && (
                    <>
                        <div className="admin-page-header">
                            <h1>Team</h1>
                            <p className="admin-header-sub">Manage access to the admin panel</p>
                        </div>

                        <div className="admin-add-row">
                            <input className="admin-add-input" placeholder="Username" value={nu} onChange={e => setNu(e.target.value)} />
                            <input className="admin-add-input" type="password" placeholder="Password" value={np} onChange={e => setNp(e.target.value)} />
                            <select className="admin-add-select" value={nr} onChange={e => setNr(e.target.value)}>
                                <option value="admin">Admin</option>
                                <option value="editor">Editor</option>
                                <option value="viewer">Viewer</option>
                            </select>
                            <button className="admin-save-btn" onClick={addUser}>Add</button>
                        </div>

                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Role</th>
                                        <th>Added</th>
                                        <th style={{ width: '80px' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u: any) => (
                                        <tr key={u.id}>
                                            <td style={{ fontWeight: 500 }}>
                                                {u.username}
                                                {u.id === currentUser.userId && <span className="admin-you-tag">you</span>}
                                            </td>
                                            <td>
                                                <span className="admin-role-badge" style={{
                                                    color: u.role === 'admin' ? '#3b82f6' : u.role === 'editor' ? '#22c55e' : '#888',
                                                }}>{u.role}</span>
                                            </td>
                                            <td className="admin-row-time">{new Date(u.created_at).toLocaleDateString()}</td>
                                            <td>
                                                {u.id !== currentUser.userId && (
                                                    <button className="admin-remove-btn" onClick={() => removeUser(u.id)}>Remove</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
