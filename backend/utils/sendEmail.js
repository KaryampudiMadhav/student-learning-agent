import { transporter } from "../config/mail.js";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"AI Learning Hub" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("📧 Email sent:", info.messageId);

  } catch (error) {
    console.error("❌ Email error:", error.message);
    throw new Error("Email sending failed");
  }
};