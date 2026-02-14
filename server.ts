import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser('haast-secret-key-2026'));

// --- Serve uploaded files ---
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// ============================================================
// DATABASE SETUP
// ============================================================
const dbPath = path.join(__dirname, 'auditions.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Ensure tables exist
db.exec(`
  CREATE TABLE IF NOT EXISTS forms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    questions JSON NOT NULL,
    active INTEGER DEFAULT 1
  )
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    form_id TEXT NOT NULL,
    data JSON NOT NULL,
    status TEXT DEFAULT 'pending',
    internal_notes TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(form_id) REFERENCES forms(id)
  )
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'viewer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// ============================================================
// PASSWORD UTILITIES
// ============================================================
function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(':');
    const testHash = crypto.scryptSync(password, salt, 64).toString('hex');
    return hash === testHash;
}

// ============================================================
// DB HELPER FUNCTIONS
// ============================================================
function getForm(id: string) {
    const form = db.prepare('SELECT * FROM forms WHERE id = ?').get(id) as any;
    if (form) return { ...form, questions: JSON.parse(form.questions) };
    return null;
}

function saveSubmission(formId: string, data: any) {
    const id = crypto.randomUUID();
    db.prepare('INSERT INTO submissions (id, form_id, data, status) VALUES (?, ?, ?, ?)').run(id, formId, JSON.stringify(data), 'pending');
    return id;
}

function getSubmissions(formId?: string) {
    let query = 'SELECT * FROM submissions';
    const params: any[] = [];
    if (formId) { query += ' WHERE form_id = ?'; params.push(formId); }
    query += ' ORDER BY created_at DESC';
    const submissions = db.prepare(query).all(...params) as any[];
    return submissions.map(sub => ({ ...sub, data: JSON.parse(sub.data) }));
}

function updateSubmission(id: string, updates: { data?: any; status?: string; internal_notes?: string }) {
    const parts: string[] = [];
    const params: any[] = [];
    if (updates.data !== undefined) { parts.push('data = ?'); params.push(JSON.stringify(updates.data)); }
    if (updates.status !== undefined) { parts.push('status = ?'); params.push(updates.status); }
    if (updates.internal_notes !== undefined) { parts.push('internal_notes = ?'); params.push(updates.internal_notes); }
    if (parts.length === 0) return;
    params.push(id);
    db.prepare(`UPDATE submissions SET ${parts.join(', ')} WHERE id = ?`).run(...params);
}

function deleteSubmissionById(id: string) {
    db.prepare('DELETE FROM submissions WHERE id = ?').run(id);
}

function updateFormQuestions(id: string, questions: any[]) {
    db.prepare('UPDATE forms SET questions = ? WHERE id = ?').run(JSON.stringify(questions), id);
}

function getUserByUsername(username: string) {
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;
}

function getAllUsers() {
    return db.prepare('SELECT id, username, role, created_at FROM users ORDER BY created_at DESC').all() as any[];
}

function createUser(username: string, password: string, role: string) {
    const id = crypto.randomUUID();
    const passwordHash = hashPassword(password);
    db.prepare('INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)').run(id, username, passwordHash, role);
    return id;
}

function deleteUserById(id: string) {
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
}

// ============================================================
// FILE UPLOAD (MULTER)
// ============================================================
import fs from 'fs';

const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `${crypto.randomUUID()}-${safeName}`);
    },
});
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB limit

// ============================================================
// EMAIL SETUP
// ============================================================
const transporter = nodemailer.createTransport({
    host: 'smtp.strato.com',
    port: 465,
    secure: true,
    auth: {
        user: 'info@haastproductions.com',
        pass: 'hicwY7-xirrig-dogtaf',
    },
});

// HTML template voor contact email
const getEmailTemplate = (email: string, phone?: string, message?: string): string => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Monaco', monospace; background: #050505; color: #fff; }
        .container { max-width: 600px; margin: 0 auto; background: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 20px; }
        .header { border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; letter-spacing: 3px; color: #fff; margin-bottom: 10px; }
        .tagline { font-size: 12px; color: rgba(255,255,255,0.5); }
        .content { margin: 30px 0; line-height: 1.6; }
        .message-box { background: rgba(59,130,246,0.1); border-left: 3px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 4px; word-break: break-word; }
        .sender-info { background: rgba(255,255,255,0.05); padding: 20px; border-radius: 4px; margin-top: 20px; font-size: 12px; }
        .info-row { margin-bottom: 15px; }
        .info-label { font-weight: bold; color: #3b82f6; margin-bottom: 5px; }
        .info-value { color: #fff; word-break: break-all; }
        .footer { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 30px; text-align: center; font-size: 11px; color: rgba(255,255,255,0.3); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">HAAST</div>
            <div class="tagline">Visual alchemy for the digital age</div>
        </div>
        <div class="content">
            <p>New inquiry received from your website.</p>
            <div class="sender-info">
                <div class="info-row"><div class="info-label">EMAIL:</div><div class="info-value">${email}</div></div>
                <div class="info-row"><div class="info-label">PHONE:</div><div class="info-value">${phone || 'Niet opgegeven'}</div></div>
            </div>
            <div class="message-box">
                <strong style="color: #3b82f6;">MESSAGE:</strong>
                <p style="margin-top: 10px; white-space: pre-wrap;">${message || 'Geen bericht toegevoegd'}</p>
            </div>
        </div>
        <div class="footer">© 2025 HAAST Productions | Inquiry from website contact form</div>
    </div>
</body>
</html>
`;

// ============================================================
// CONTACT FORM ENDPOINT
// ============================================================
app.post('/api/contact', async (req, res) => {
    const { email, phone, message } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    try {
        await transporter.sendMail({
            from: 'info@haastproductions.com',
            to: 'info@haastproductions.com',
            subject: `Nieuw bericht van ${email}`,
            html: getEmailTemplate(email, phone, message),
            replyTo: email,
        });

        await transporter.sendMail({
            from: 'info@haastproductions.com',
            to: email,
            subject: 'We received your message - HAAST Productions',
            html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8">
<style>
body { font-family: 'Monaco', monospace; background: #050505; color: #fff; }
.container { max-width: 600px; margin: 0 auto; background: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 40px; }
.header { border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 30px; }
.logo { font-size: 28px; font-weight: bold; letter-spacing: 3px; color: #fff; margin-bottom: 10px; }
.content { margin: 30px 0; line-height: 1.6; }
.footer { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 30px; text-align: center; font-size: 11px; color: rgba(255,255,255,0.3); }
</style>
</head>
<body>
<div class="container">
  <div class="header"><div class="logo">HAAST</div></div>
  <div class="content">
    <p>Thanks for reaching out!</p>
    <p>We received your message and will get back to you as soon as possible.</p>
    <p style="margin-top: 20px; color: rgba(255,255,255,0.7);">— The HAAST Team</p>
  </div>
  <div class="footer">© 2025 HAAST Productions</div>
</div>
</body>
</html>
      `,
        });

        res.status(200).json({ success: 'Email sent successfully' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// ============================================================
// AUDITION SYSTEM - PUBLIC ENDPOINTS
// ============================================================

// Get form questions
app.get('/api/audition/questions', (_req, res) => {
    const form = getForm('default-audition-form');
    res.json(form ? form.questions : []);
});

// Submit audition (with file uploads)
app.post('/api/audition/submit', upload.any(), async (req, res) => {
    const rawData: any = {};

    // Process text fields
    for (const [key, value] of Object.entries(req.body)) {
        rawData[key] = value;
    }

    // Process uploaded files
    if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
            rawData[file.fieldname] = `/uploads/${file.filename}`;
        }
    }

    try {
        saveSubmission('default-audition-form', rawData);
    } catch (e) {
        console.error('DB Error:', e);
        return res.status(500).json({ success: false, message: 'Failed to save submission.' });
    }

    // Send notification email
    try {
        await transporter.sendMail({
            from: 'info@haastproductions.com',
            to: 'info@haastproductions.com',
            subject: `Nieuwe auditie-aanmelding: ${rawData.name || 'Candidate'}`,
            html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 30px; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;">
  <h1 style="font-size: 24px; letter-spacing: 3px; margin-bottom: 20px;">HAAST</h1>
  <p style="color: rgba(255,255,255,0.5); margin-bottom: 20px;">Nieuwe auditie-aanmelding</p>
  ${Object.entries(rawData).map(([key, val]) =>
                `<p><strong style="color: #3b82f6;">${key}:</strong> ${val}</p>`
            ).join('')}
  <hr style="border-color: rgba(255,255,255,0.1); margin: 20px 0;" />
  <small style="color: rgba(255,255,255,0.3);">© 2025 HAAST Productions</small>
</div>`,
            replyTo: rawData.email || undefined,
        });

        // Auto-reply
        if (rawData.email) {
            await transporter.sendMail({
                from: 'info@haastproductions.com',
                to: rawData.email,
                subject: 'We ontvingen je auditie-aanmelding - HAAST',
                html: `<p>Hi ${rawData.name || ''},</p><p>Bedankt voor je aanmelding voor een auditie. We hebben je gegevens ontvangen en nemen zo snel mogelijk contact met je op.</p><p>— HAAST Team</p>`,
            });
        }
    } catch (emailErr) {
        console.error('Email send failed (submission still saved):', emailErr);
    }

    res.json({ success: true, message: 'Application received.' });
});

// ============================================================
// ADMIN AUTH
// ============================================================
function getSession(req: any) {
    const session = req.signedCookies?.admin_session;
    if (!session) return null;
    try {
        return JSON.parse(session);
    } catch {
        return null;
    }
}

function requireAuth(req: any, res: any, next: any) {
    const session = getSession(req);
    if (!session) return res.status(401).json({ error: 'Unauthorized' });
    req.session = session;
    next();
}

function requireAdmin(req: any, res: any, next: any) {
    if (req.session?.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    next();
}

// Login
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, message: 'Username and password are required.' });

    const user = getUserByUsername(username);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid username or password.' });

    const isValid = verifyPassword(password, user.password_hash);
    if (!isValid) return res.status(401).json({ success: false, message: 'Invalid username or password.' });

    const sessionData = JSON.stringify({ userId: user.id, username: user.username, role: user.role });
    res.cookie('admin_session', sessionData, {
        signed: true,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax',
    });

    res.json({ success: true, user: { username: user.username, role: user.role } });
});

// Logout
app.post('/api/admin/logout', (_req, res) => {
    res.clearCookie('admin_session');
    res.json({ success: true });
});

// ============================================================
// ADMIN DATA ENDPOINTS
// ============================================================

// Get all admin data
app.get('/api/admin/data', requireAuth, (req: any, res) => {
    const submissions = getSubmissions('default-audition-form');
    const form = getForm('default-audition-form');
    const questions = form ? form.questions : [];
    const users = req.session.role === 'admin' ? getAllUsers() : [];
    res.json({ submissions, questions, users, currentUser: req.session });
});

// Update form questions
app.put('/api/admin/questions', requireAuth, (req: any, res) => {
    if (req.session.role === 'viewer') return res.status(403).json({ success: false, message: 'No permission.' });
    try {
        updateFormQuestions('default-audition-form', req.body.questions);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Failed to update questions.' });
    }
});

// Update submission
app.put('/api/admin/submissions/:id', requireAuth, (req: any, res) => {
    const { status, internal_notes, data } = req.body;
    if (req.session.role === 'viewer' && data) return res.status(403).json({ success: false, message: 'Viewers cannot edit submission data.' });
    try {
        updateSubmission(req.params.id, { status, internal_notes, data });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Failed to update submission.' });
    }
});

// Delete submission
app.delete('/api/admin/submissions/:id', requireAuth, (req: any, res) => {
    if (req.session.role === 'viewer') return res.status(403).json({ success: false, message: 'No permission.' });
    try {
        deleteSubmissionById(req.params.id);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Failed to delete submission.' });
    }
});

// Create user
app.post('/api/admin/users', requireAuth, requireAdmin, (req: any, res) => {
    const { username, password, role } = req.body;
    try {
        createUser(username, password, role);
        res.json({ success: true });
    } catch (e: any) {
        if (e.message?.includes('UNIQUE')) return res.status(400).json({ success: false, message: 'Username already exists.' });
        res.status(500).json({ success: false, message: 'Failed to create user.' });
    }
});

// Delete user
app.delete('/api/admin/users/:id', requireAuth, requireAdmin, (req: any, res) => {
    if (req.session.userId === req.params.id) return res.status(400).json({ success: false, message: 'Cannot delete yourself.' });
    try {
        deleteUserById(req.params.id);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Failed to delete user.' });
    }
});

// ============================================================
// START SERVER
// ============================================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
