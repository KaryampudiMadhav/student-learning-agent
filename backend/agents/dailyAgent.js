import { callGemini } from "../services/geminiService.js";

export const dailyAgent = async ({ topic, difficulty, memory }) => {

  const prompt = `
You are an AI Daily Learning Agent.

Generate content for ONE DAY.

---

# 📘 TOPIC
${topic}

# 🎯 DIFFICULTY
${difficulty}

---

# 🧠 CONTEXT

Weak Areas:
${memory?.weakAreas?.map(w => w.topic).join(", ") || "None"}

---

# ⚙️ TASK

Generate:

1. Tasks (3)
2. Assignment (1)
3. Practice Questions (3 MCQs)

---

# 📦 OUTPUT JSON

{
  "tasks": [{ "title": "" }],
  "assignment": { "title": "", "description": "" },
  "quiz": [
    {
      "question": "",
      "options": ["", "", "", ""],
      "correctIndex": 0
    }
  ]
}

---

ONLY JSON.
`;

  return await callGemini(prompt);
};