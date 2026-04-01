import express from "express";
import { runWorkflow } from "../controllers/workflowController.js";
import { protect } from "../middleware/authMiddleware.js";
import Progress from "../models/Progress.js";

const router = express.Router();


// 🚀 MAIN AI WORKFLOW (CORE)
router.post("/run", protect, runWorkflow);


// 📊 GET USER PROGRESS (FOR DASHBOARD)
router.get("/progress", protect, async (req, res) => {
  try {
    const data = await Progress.findOne({
      userId: req.userId
    });

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔁 RESET SESSION (FOR DEMO)
router.post("/reset", protect, async (req, res) => {
  try {
    await Progress.deleteOne({
      userId: req.userId
    });

    res.json({ message: "Session reset successful" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🧠 GET AGENT LOGS (VERY USEFUL FOR UI)
router.get("/logs", protect, async (req, res) => {
  try {
    const data = await Progress.findOne({
      userId: req.userId
    });

    res.json(data?.agentLogs || []);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ❤️ HEALTH CHECK
router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.get("/history", async (req, res) => {
  const sessionId = req.headers["x-session-id"];

  const data = await Progress.findOne({ sessionId });

  res.json({
    history: data?.dailyLogs || [],
    streak: data?.streak || 0,
    currentDay: data?.currentDay || 1
  });
});

export default router;