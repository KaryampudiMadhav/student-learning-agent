import { callGemini } from "../services/geminiService.js";

export const orchestratorAgent = async ({ memory, evaluation }) => {
  const prompt = `
You are an advanced AI Orchestrator Agent.

Your job is to control the student's learning workflow.

---

# 📊 USER PERFORMANCE
- Score: ${evaluation?.score || 0}
- Weak Areas: ${evaluation?.weakAreas?.join(", ") || "None"}
- Performance Level: ${evaluation?.performanceLevel || "unknown"}

---

# 🧠 USER MEMORY
- Current Topic: ${memory?.currentTopic || "None"}
- Difficulty: ${memory?.difficulty || "beginner"}
- Previous Scores: ${memory?.scores?.map(s => s.score).join(", ") || "None"}
- Weak Areas History: ${memory?.weakAreas?.map(w => `${w.topic}(${w.count})`).join(", ") || "None"}
- Skipped Days: ${memory?.skippedDays || 0}
- Status: ${memory?.status || "learning"}

---

# ⚙️ DECISION RULES

You MUST decide:

1. Next Action:
   - "move_forward"
   - "repeat_topic"
   - "assign_revision"

2. Difficulty Adjustment:
   - increase
   - decrease
   - maintain

3. Topic Decision:
   - continue current
   - move to next topic

---

# 🧠 DECISION LOGIC (IMPORTANT)

- Score < 50 → repeat + revision
- Score 50–80 → practice more
- Score > 80 → move forward
- Repeated weak areas (count ≥ 2) → revision priority
- Skipped days > 2 → reduce difficulty
- Good performance → increase difficulty

BUT:
👉 You MUST THINK and decide (not blindly follow rules)

---

# 📦 OUTPUT FORMAT (STRICT JSON)

{
  "action": "move_forward",
  "difficultyAction": "increase",
  "nextTopic": "topic name",
  "reason": "Detailed explanation of decision",
  "confidence": 0.9
}

---

# 🚫 RULES

- No text outside JSON
- Reason must be clear and human-like
- Decision must consider ALL context
- Be adaptive and intelligent

Make the best decision now.
`;

  return await callGemini(prompt);
};