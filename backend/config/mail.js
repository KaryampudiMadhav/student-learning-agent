import "dotenv/config";
import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL_USER?.trim();
const emailPass = process.env.EMAIL_PASS?.trim();

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // 🔥 IMPORTANT (change this)
  auth: {
    user: emailUser,
    pass: emailPass
  }
});

transporter.verify((error, success) => {
  if (!emailUser || !emailPass) {
    console.error("❌ Mail config error: EMAIL_USER or EMAIL_PASS is missing");
    return;
  }

  if (error) {
    console.error("❌ Mail server error:", error.message);
  } else {
    console.log("✅ Mail server ready");
  }
});