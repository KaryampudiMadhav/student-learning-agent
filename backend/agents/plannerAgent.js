import { callGemini } from "../services/geminiService.js";

export const plannerAgent = async ({ goal, memory }) => {
  const prompt = `
You are an expert AI Learning Planner Agent.

Your job is to create a structured, personalized learning roadmap.

---

# 🎯 USER GOAL
"${goal}"

---

# 🧠 USER CONTEXT (MEMORY)
- Current Topic: ${memory?.currentTopic || "None"}
- Difficulty Level: ${memory?.difficulty || "beginner"}
- Weak Areas: ${memory?.weakAreas?.join(", ") || "None"}
- Previous Scores: ${memory?.scores?.join(", ") || "None"}

---

# ⚙️ INSTRUCTIONS

1. Break the goal into 3 levels:
   - Beginner
   - Intermediate
   - Advanced

2. Each level must have:
   - Clear topics (ordered logically)
   - Real-world progression

3. Personalize roadmap:
   - If weak areas exist → include reinforcement topics
   - Adjust based on difficulty

4. Select CURRENT TOPIC:
   - If no memory → first beginner topic
   - Else → continue from last progress

---

# 📦 OUTPUT FORMAT (STRICT JSON ONLY)

{
  "roadmap": [
    {
      "level": "beginner",
      "topics": ["topic1", "topic2"]
    },
    {
      "level": "intermediate",
      "topics": []
    },
    {
      "level": "advanced",
      "topics": []
    }
  ],
  "currentTopic": "selected topic",
  "reason": "Why this topic was selected",
  "estimatedDuration": "e.g. 2 weeks"
}

---

# 🚫 RULES

- DO NOT return text outside JSON
- DO NOT explain outside JSON
- DO NOT leave fields empty
- Ensure topics are realistic and practical

Generate now.
`;

  return await callGemini(prompt);
};