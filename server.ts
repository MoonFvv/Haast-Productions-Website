import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

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
// START SERVER
// ============================================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
