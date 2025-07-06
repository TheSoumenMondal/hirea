import { createTransport } from "nodemailer";

const frontendUrl = process.env.FRONTEND_URL;

const sendMail = async (
  subject: string,
  data: { email: string; token: string }
) => {
  const resetLink = `${frontendUrl}/reset/${data.token}`;

  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9; padding: 40px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <h2 style="color: #333;">🔐 Reset Your Password</h2>
        <p style="color: #555;">We received a request to reset your password. Click the button below to set a new one:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Reset Password
          </a>
        </div>
        
        <p style="color: #999; font-size: 14px;">If you didn't request a password reset, you can safely ignore this email.</p>
        <p style="color: #999; font-size: 13px;">This link will expire in 5 minutes for security reasons.</p>

        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #bbb;">If you're having trouble clicking the button, copy and paste this URL into your browser:</p>
        <p style="font-size: 12px; color: #007bff;">${resetLink}</p>
      </div>
    </div>
  `;

  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASS,
    },
  });

  await transport.sendMail({
    from: `"Hirea Support" <${process.env.GMAIL}>`,
    to: data.email,
    subject,
    html,
  });
};

export { sendMail };
