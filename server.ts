import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Email transporter met Strato SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.strato.com',
  port: 465,
  secure: true,
  auth: {
    user: 'info@haastproductions.com',
    pass: 'hicwY7-xirrig-dogtaf',
  },
});

// HTML template voor de email
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
        
        @media (max-width: 600px) {
            .container { padding: 15px; }
            .logo { font-size: 20px; }
            .tagline { font-size: 11px; }
            .message-box { padding: 15px; }
            .sender-info { padding: 15px; }
            .info-row { margin-bottom: 12px; }
            .info-label { font-size: 11px; }
            .info-value { font-size: 11px; }
        }
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
                <div class="info-row">
                    <div class="info-label">EMAIL:</div>
                    <div class="info-value">${email}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">PHONE:</div>
                    <div class="info-value">${phone || 'Niet opgegeven'}</div>
                </div>
            </div>
            
            <div class="message-box">
                <strong style="color: #3b82f6;">MESSAGE:</strong>
                <p style="margin-top: 10px; white-space: pre-wrap;">${message || 'Geen bericht toegevoegd'}</p>
            </div>
        </div>
        
        <div class="footer">
            © 2025 HAAST Productions | Inquiry from website contact form
        </div>
    </div>
</body>
</html>
`;

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { email, phone, message } = req.body;

  // Validation
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Stuur email naar jou
    await transporter.sendMail({
      from: 'info@haastproductions.com',
      to: 'info@haastproductions.com',
      subject: `Nieuw bericht van ${email}`,
      html: getEmailTemplate(email, phone, message),
      replyTo: email,
    });

    // Auto-reply naar de bezoeker
    await transporter.sendMail({
      from: 'info@haastproductions.com',
      to: email,
      subject: 'We received your message - HAAST Productions',
      html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
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
        <div class="header">
            <div class="logo">HAAST</div>
        </div>
        <div class="content">
            <p>Thanks for reaching out!</p>
            <p>We received your message and will get back to you as soon as possible.</p>
            <p style="margin-top: 20px; color: rgba(255,255,255,0.7);">— The HAAST Team</p>
        </div>
        <div class="footer">
            © 2025 HAAST Productions
        </div>
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

const getAuditionTemplate = (data: { name: string; email: string; phone?: string; age?: string; role?: string; headshot?: string; showreel?: string; message?: string; }): string => `
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
                .content { margin: 30px 0; line-height: 1.6; }
                .info { background: rgba(255,255,255,0.03); padding: 15px; border-radius: 6px; }
                .row { margin-bottom: 10px; }
                .label { color: #3b82f6; font-weight: bold; }
                .value { color: #fff; }
        </style>
</head>
<body>
        <div class="container">
                <div class="header">
                        <div class="logo">HAAST</div>
                        <div class="tagline">Nieuwe auditie-aanmelding</div>
                </div>
                <div class="content">
                        <div class="info">
                                <div class="row"><div class="label">Naam:</div><div class="value">${data.name}</div></div>
                                <div class="row"><div class="label">E-mail:</div><div class="value">${data.email}</div></div>
                                <div class="row"><div class="label">Telefoon:</div><div class="value">${data.phone || 'Niet opgegeven'}</div></div>
                                <div class="row"><div class="label">Leeftijd:</div><div class="value">${data.age || 'Niet opgegeven'}</div></div>
                                <div class="row"><div class="label">Rol / typecasting:</div><div class="value">${data.role || 'Niet opgegeven'}</div></div>
                                <div class="row"><div class="label">Headshot:</div><div class="value">${data.headshot || 'Geen'}</div></div>
                                <div class="row"><div class="label">Showreel:</div><div class="value">${data.showreel || 'Geen'}</div></div>
                                <div class="row"><div class="label">Bericht:</div><div class="value">${data.message || 'Geen'}</div></div>
                        </div>
                </div>
                <div class="footer" style="margin-top:20px; font-size:11px; color:rgba(255,255,255,0.3);">© 2025 HAAST Productions</div>
        </div>
</body>
</html>
`;

// Audition form endpoint
app.post('/api/audition', async (req, res) => {
    const { name, email, phone, age, role, headshot, showreel, message } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    try {
        await transporter.sendMail({
            from: 'info@haastproductions.com',
            to: 'info@haastproductions.com',
            subject: `Nieuwe auditie-aanmelding: ${name}`,
            html: getAuditionTemplate({ name, email, phone, age, role, headshot, showreel, message }),
            replyTo: email,
        });

        await transporter.sendMail({
            from: 'info@haastproductions.com',
            to: email,
            subject: 'We ontvingen je auditie-aanmelding - HAAST',
            html: `<p>Hi ${name},</p><p>Bedankt voor je aanmelding voor een auditie. We hebben je gegevens ontvangen en nemen zo snel mogelijk contact met je op.</p><p>— HAAST Team</p>`,
        });

        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Audition error:', err);
        res.status(500).json({ error: 'Failed to send audition email' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
