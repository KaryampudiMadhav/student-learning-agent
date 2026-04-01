import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import workflowRoutes from "./routes/workflowRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import { sessionMiddleware } from "./middleware/sessionMiddleware.js";
import { log } from "./utils/logger.js";

dotenv.config();

// ✅ CREATE APP FIRST (IMPORTANT FIX)
const app = express();


// 🔥 GLOBAL MIDDLEWARE
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(sessionMiddleware);

console.log("ENV CHECK:");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

// 🔥 REQUEST LOGGER (VERY USEFUL)
app.use((req, res, next) => {
  console.log(`\n📥 ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});


// 🔥 ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/workflow", workflowRoutes);


// 🔥 GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message);
  res.status(500).json({ error: err.message });
});


// 🔥 DB CONNECTION (OPTIMIZED)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
};


// 🔥 START SERVER
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});