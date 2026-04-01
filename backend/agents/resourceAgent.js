import { callGemini } from "../services/geminiService.js";

export const resourceAgent = async ({ topic, memory }) => {
  const prompt = `
You are an expert AI Resource Curator Agent.

Your job is to provide the BEST learning resources for a student.

---

# 📘 CURRENT TOPIC
"${topic}"

---

# 🧠 USER CONTEXT (MEMORY)
- Difficulty Level: ${memory?.difficulty || "beginner"}
- Weak Areas: ${memory?.weakAreas?.join(", ") || "None"}
- Previous Scores: ${memory?.scores?.join(", ") || "None"}

---

# ⚙️ INSTRUCTIONS

1. Provide HIGH-QUALITY resources:
   - YouTube (real tutorials)
   - Articles (official docs / trusted blogs)

2. Personalization:
   - If beginner → simple explanations
   - If weak areas exist → include focused resources
   - Match difficulty level

3. Resource Rules:
   - Must be REALISTIC (no fake URLs)
   - Prefer:
     - Official docs
     - Well-known platforms (MDN, freeCodeCamp, GeeksforGeeks, etc.)
     - Popular YouTube channels

4. Each resource must include:
   - title
   - url (valid-looking)
   - type ("video" | "article")
   - difficulty ("beginner" | "intermediate" | "advanced")
   - reason (why recommended)

5. Provide 4–6 resources max (quality > quantity)

---

# 📦 OUTPUT FORMAT (STRICT JSON ONLY)

{
  "resources": [
    {
      "title": "Resource title",
      "url": "https://...",
      "type": "video",
      "difficulty": "beginner",
      "reason": "Why this resource is useful for the student"
    }
  ]
}

---

# 🚫 RULES

- DO NOT return text outside JSON
- DO NOT generate fake or random URLs
- DO NOT exceed 6 resources
- Ensure resources are relevant to topic

Generate now.
`;

  return await callGemini(prompt);
};