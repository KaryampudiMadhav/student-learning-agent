import mongoose from "mongoose";

const weakAreaSchema = new mongoose.Schema({
  topic: String,
  count: { type: Number, default: 1 },   // 🔥 frequency tracking
  lastSeen: { type: Date, default: Date.now }
});

const scoreSchema = new mongoose.Schema({
  topic: String,
  score: Number,
  date: { type: Date, default: Date.now }
});

const progressSchema = new mongoose.Schema({
  // 🔑 SESSION (VERY IMPORTANT)
  sessionId: {
    type: String,
    required: true,
    unique: true
  },

  userId: {
    type: String
  },

  // 🧠 CURRENT LEARNING STATE
  currentTopic: {
    type: String,
    default: ""
  },

  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner"
  },

  status: {
    type: String,
    enum: ["learning", "revision", "completed"],
    default: "learning"
  },

  // 📊 SCORES HISTORY (BETTER THAN MAP)
  scores: [scoreSchema],

  // 🔥 WEAK AREAS WITH TRACKING
  weakAreas: [weakAreaSchema],

  // 📅 CONSISTENCY TRACKING
  skippedDays: {
    type: Number,
    default: 0
  },

  lastActiveDate: {
    type: Date,
    default: Date.now
  },

  // 🧠 ROADMAP
  roadmap: {
    type: Array,
    default: []
  },

  // 📚 COMPLETED TOPICS
  completedTopics: {
    type: [String],
    default: []
  },

  // 🔁 REVISION HISTORY
  revisionHistory: [
    {
      topic: String,
      date: { type: Date, default: Date.now }
    }
  ],

  // 🧠 AGENT TRACE (🔥 VERY IMPORTANT FOR UI)
  agentLogs: [
    {
      agent: String,
      output: Object,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  dailyProgress: [
  {
    date: { type: Date, default: Date.now },
    topic: String,
    score: Number,
    tasksCompleted: Number
  },
  
],// 📚 FULL LEARNING HISTORY (IMPORTANT)
learningHistory: [
  {
    topic: String,
    action: String, // started / completed / revision
    score: Number,
    date: { type: Date, default: Date.now }
  }
],

// 🎯 USER PLAN
totalDays: Number,
currentDay: {
  type: Number,
  default: 1
},

goal: String,

// 📅 DAILY RECORD (ONLY COMPLETED DAYS)
dailyLogs: [
  {
    day: Number,
    topic: String,
    score: Number,
    difficulty: String,
    status: String, // completed / revision
    date: { type: Date, default: Date.now }
  }
],

// 🔥 STREAK TRACKING
streak: {
  type: Number,
  default: 0
},

}, { timestamps: true });

const Progress = mongoose.model("Progress", progressSchema);

export default Progress;