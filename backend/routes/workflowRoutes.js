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

router.get("/history", protect, async (req, res) => {
  try {
    const sessionId = req.headers["x-session-id"];

    const data = await Progress.findOne({
      $or: [
        { userId: req.userId },
        ...(sessionId ? [{ sessionId }] : []),
      ],
    }).sort?.({ updatedAt: -1 });

    const dailyProgress = (data?.dailyProgress || []).map((entry) => ({
      day: entry.day || undefined,
      topic: entry.topic || 'Learning',
      score: entry.score,
      status: entry.score >= 75 ? 'completed' : 'repeat',
      date: entry.date,
      tasksCompleted: entry.tasksCompleted,
    }));

    const learningHistory = (data?.learningHistory || []).map((entry) => ({
      day: entry.day || undefined,
      topic: entry.topic || 'Learning',
      score: entry.score,
      status: entry.action === 'completed' ? 'completed' : entry.action || 'in_progress',
      date: entry.date,
    }));

    const legacyLogs = (data?.dailyLogs || []).map((entry) => ({
      ...entry,
      status: entry.status || (entry.score >= 75 ? 'completed' : 'repeat'),
    }));

    const history = [...dailyProgress, ...learningHistory, ...legacyLogs].sort(
      (a, b) => new Date(a.date || 0) - new Date(b.date || 0),
    );

    res.json({
      history,
      streak: data?.streak || 0,
      currentDay: data?.currentDay || 1,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;