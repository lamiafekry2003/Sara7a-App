import nodemailer from "nodemailer";

export async function sendEmail({
  to = "",
  subject = "Sara7a Application",
  text = "",
  html = "",
  cc = "",
  bcc = "",
  attachments = [],
}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"Sara7a App Service 🤞" <${process.env.EMAIL}>`,
    to,
    subject,
    text, // plain‑text body
    html, // HTML body
    cc,
    bcc,
    attachments,
  });
}

export const emailSubject = {
  confirmEmail: "Confirm your email",
  resetPassword: "Reset your password",
  welcome: "Welcome to sara7a application",
  
};
