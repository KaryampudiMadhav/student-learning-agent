import User from "../models/User.js";
import crypto from "crypto";
import { generateToken } from "../utils/token.js";
import { sendEmail } from "../utils/sendEmail.js";
import { forgotPasswordTemplate } from "../utils/emailTemplates.js";


// 🔥 REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("🧾 Register request:", email);

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ❌ DO NOT HASH HERE (model handles it)
    const user = await User.create({
      name,
      email,
      password
    });

    const token = generateToken(user._id);

    res.json({
      message: "User registered successfully",
      user,
      token
    });

  } catch (err) {
    console.error("❌ Register error:", err.message);
    res.status(500).json({ error: err.message });
  }
};



// 🔥 LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 Login attempt:", email);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      user,
      token
    });

  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ error: err.message });
  }
};



// 🔥 FORGOT PASSWORD (EMAIL + UI)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("📧 Forgot password:", email);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 🔥 Generate token (from model)
    const resetToken = user.getResetPasswordToken();
    await user.save();

    // 🔗 FRONTEND URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // 🎨 EMAIL TEMPLATE
    const { subject, html } = forgotPasswordTemplate(resetUrl, user.name);

    // 📧 SEND EMAIL
    await sendEmail({
      to: user.email,
      subject,
      html
    });

    res.json({
      message: "Reset email sent successfully"
    });

  } catch (err) {
    console.error("❌ Forgot password error:", err.message);
    res.status(500).json({ error: err.message });
  }
};



// 🔥 RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    console.log("🔁 Reset password attempt");

    // 🔐 HASH TOKEN (IMPORTANT)
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Token invalid or expired"
      });
    }

    // ❌ DO NOT HASH HERE (model handles it)
    user.password = password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      message: "Password reset successful"
    });

  } catch (err) {
    console.error("❌ Reset error:", err.message);
    res.status(500).json({ error: err.message });
  }
};