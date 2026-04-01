import { callGemini } from "../services/geminiService.js";

export const revisionAgent = async ({ weakAreas, memory }) => {

  if (!weakAreas || weakAreas.length === 0) {
    return { revision: [] };
  }

  const prompt = `
You are an expert AI Revision Agent.

Your job is to help students improve weak areas.

---

# ⚠️ WEAK AREAS
${weakAreas.join(", ")}

---

# 🧠 USER CONTEXT
- Difficulty: ${memory?.difficulty || "beginner"}
- Previous Scores: ${memory?.scores?.join(", ") || "None"}

---

# ⚙️ INSTRUCTIONS

1. For each weak area:
   - Create a revision task
   - Include explanation + practice

2. Include:
   - concept revision
   - practice problems
   - mini task

3. Keep difficulty slightly easier than current level

---

# 📦 OUTPUT (STRICT JSON)

{
  "revision": [
    {
      "topic": "weak topic",
      "action": "What to do",
      "task": "Practice task",
      "estimatedTime": "30 mins",
      "priority": "high"
    }
  ]
}

---

# 🚫 RULES

- No text outside JSON
- Focus on improvement
- Be practical and actionable

Generate now.
`;

  return await callGemini(prompt);
};