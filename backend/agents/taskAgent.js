import { callGemini } from "../services/geminiService.js";

export const taskAgent = async ({ topic, memory }) => {
  const prompt = `
You are an expert AI Learning Task Generator Agent.

Your job is to generate structured, practical learning tasks.

---

# 📘 CURRENT TOPIC
"${topic}"

---

# 🧠 USER CONTEXT (MEMORY)
- Difficulty Level: ${memory?.difficulty || "beginner"}
- Weak Areas: ${memory?.weakAreas?.join(", ") || "None"}
- Previous Scores: ${memory?.scores?.join(", ") || "None"}
- Current Status: ${memory?.status || "learning"}

---

# ⚙️ INSTRUCTIONS

1. Generate tasks in 3 stages:

   A. Concept Learning Task
   - Understand theory
   - Simple exercises

   B. Practice Task
   - Apply concepts
   - Medium difficulty problems

   C. Mini Project Task (VERY IMPORTANT)
   - Real-world application
   - Build something practical

---

2. Personalization:

- If score is low → easier + more practice tasks
- If weak areas exist → include targeted tasks
- If advanced → include challenging project

---

3. Each task must include:

- title
- description
- type ("learning" | "practice" | "project")
- difficulty ("easy" | "medium" | "hard")
- estimatedTime (e.g., "30 mins", "2 hours")
- expectedOutcome (what user will learn)

---

4. Generate 4–6 tasks total

---

# 📦 OUTPUT FORMAT (STRICT JSON ONLY)

{
  "tasks": [
    {
      "title": "Task title",
      "description": "Detailed description",
      "type": "learning",
      "difficulty": "easy",
      "estimatedTime": "30 mins",
      "expectedOutcome": "What the student will gain"
    }
  ]
}

---

# 🚫 RULES

- DO NOT return text outside JSON
- DO NOT generate vague tasks
- Tasks must be actionable
- Include at least 1 mini project
- Match difficulty with user level

Generate now.
`;

  return await callGemini(prompt);
};