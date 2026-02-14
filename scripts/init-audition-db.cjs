const Database = require('better-sqlite3');
const crypto = require('crypto');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'auditions.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// --- Create tables ---
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

// --- Seed default form ---
const checkForm = db.prepare('SELECT * FROM forms WHERE id = ?').get('default-audition-form');

if (!checkForm) {
    const defaultQuestions = [
        { id: 'name', type: 'text', label: 'Full Name', required: true, placeholder: 'Jane Doe' },
        { id: 'email', type: 'email', label: 'Email Address', required: true, placeholder: 'jane@example.com' },
        { id: 'phone', type: 'tel', label: 'Phone Number', required: true, placeholder: '+31 6 12345678' },
        { id: 'role', type: 'select', label: 'Role Applying For', options: ['Actor', 'Director', 'Cinematographer', 'Editor', 'Sound Design', 'Other'], required: true },
        { id: 'headshot', type: 'file', label: 'Headshot Photo', required: false },
        { id: 'audition_video', type: 'file', label: 'Audition Video', required: false },
        { id: 'portfolio', type: 'url', label: 'Portfolio / Showreel URL', required: false, placeholder: 'https://vimeo.com/...' },
        { id: 'motivation', type: 'textarea', label: 'Why do you want to join this project?', required: true, placeholder: 'Tell us about your passion...' },
    ];

    db.prepare('INSERT INTO forms (id, name, questions) VALUES (?, ?, ?)').run(
        'default-audition-form',
        'Main Audition Form',
        JSON.stringify(defaultQuestions)
    );
    console.log('✓ Default audition form created.');
} else {
    console.log('• Default form already exists.');
}

// --- Seed default admin user ---
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
}

const existingAdmin = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
if (!existingAdmin) {
    const id = crypto.randomUUID();
    db.prepare('INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)').run(
        id, 'admin', hashPassword('haast2026'), 'admin'
    );
    console.log('✓ Admin user created (username: admin, password: haast2026)');
} else {
    console.log('• Admin user already exists.');
}

console.log('✓ Database initialized successfully at:', dbPath);
db.close();
