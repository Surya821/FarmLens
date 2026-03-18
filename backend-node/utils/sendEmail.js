import nodemailer from 'nodemailer';

/**
 * Send an OTP email for password reset.
 * Transporter is created inside the function so env vars are always available.
 * @param {string} toEmail  - Recipient email
 * @param {string} otp      - The 6-digit OTP
 */
export async function sendOtpEmail(toEmail, otp) {
  console.log(`[Email] Attempting to send OTP to: ${toEmail}`);
  console.log(`[Email] Using Gmail account: ${process.env.EMAIL_USER}`);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('EMAIL_USER or EMAIL_PASS not set in environment variables');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password (16 chars, no spaces)
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Verify connection before sending
  await transporter.verify();
  console.log('[Email] SMTP connection verified successfully');

  const mailOptions = {
    from: `"FarmLens 🌿" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your FarmLens Password Reset OTP',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: auto; background: #f0faf3; border-radius: 24px; overflow: hidden; border: 1px solid #d1fae5;">
        <div style="background: linear-gradient(135deg, #16a34a, #059669); padding: 36px 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px;">🌿 FarmLens</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 13px; font-weight: 600;">Password Reset Request</p>
        </div>
        <div style="padding: 36px 32px; background: #ffffff;">
          <p style="color: #374151; font-size: 15px; margin-top: 0;">Hello 👋,</p>
          <p style="color: #374151; font-size: 15px;">We received a request to reset your FarmLens password. Use the OTP below to proceed:</p>
          
          <div style="background: #f0fdf4; border: 2px dashed #16a34a; border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0;">
            <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">Your OTP</p>
            <p style="font-size: 42px; font-weight: 900; color: #16a34a; letter-spacing: 12px; margin: 0;">${otp}</p>
          </div>

          <p style="color: #6b7280; font-size: 13px;">⏱️ This OTP is valid for <strong>10 minutes</strong>.</p>
          <p style="color: #6b7280; font-size: 13px;">🔐 If you did not request this, simply ignore this email. Your account is safe.</p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">FarmLens · AI-Powered Livestock Management</p>
        </div>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[Email] Message sent: ${info.messageId}`);
}

