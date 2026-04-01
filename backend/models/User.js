import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    // 🔥 FOR FORGOT PASSWORD
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // 🔥 OPTIONAL
    lastLogin: Date
  },
  { timestamps: true }
);


// 🔐 HASH PASSWORD (FIXED)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// 🔐 MATCH PASSWORD
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// 🔥 GENERATE RESET TOKEN
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min

  return resetToken;
};


const User = mongoose.model("User", userSchema);

export default User;