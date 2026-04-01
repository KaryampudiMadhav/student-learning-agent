import { callGemini } from "../services/geminiService.js";

export const plannerAgent = async ({ goal, memory }) => {

  const currentDay = memory?.currentDay || 1;

  const prompt = `
You are an AI Learning Planner in a STATEFUL system.

⚠️ IMPORTANT:
You MUST use previous learning data to generate next plan.

---

# 🎯 GOAL
"${goal}"

# 📍 CURRENT DAY
${currentDay}

---

# 🧠 MEMORY (VERY IMPORTANT)

## Previous Days Performance:
${memory?.dailyLogs?.map(d =>
  `Day ${d.day}: ${d.topic} → Score: ${d.score}`
).join("\n") || "No previous data"}

## Weak Areas:
${memory?.weakAreas?.map(w => `${w.topic} (${w.count})`).join(", ") || "None"}

## Current Difficulty:
${memory?.difficulty || "beginner"}

---

# ⚙️ TASK

Generate NEXT 3 DAYS:

- Day ${currentDay}
- Day ${currentDay + 1}
- Day ${currentDay + 2}

---

# 🧠 ADAPTIVE RULES

1. If last scores are LOW:
   → reduce difficulty
   → add reinforcement topics

2. If scores are HIGH:
   → increase difficulty
   → move forward

3. If weak areas exist:
   → include them again

4. Maintain logical topic order

---

# 📦 OUTPUT (STRICT JSON)

{
  "days": [
    { "day": ${currentDay}, "topic": "", "difficulty": "" },
    { "day": ${currentDay + 1}, "topic": "", "difficulty": "" },
    { "day": ${currentDay + 2}, "topic": "", "difficulty": "" }
  ],

  "reason": "",
  "adaptation": ""
}

---

# 🚫 RULES

- Must use memory
- Must adapt
- Only 3 days
- No extra text

Generate now.
`;

  return await callGemini(prompt);
};