import { callGemini } from "../services/geminiService.js";

export const evaluatorAgent = async ({ topic, answers, memory }) => {

  // 👉 MODE 1: GENERATE QUIZ
  if (!answers) {
    const prompt = `
You are an expert AI Evaluator Agent.

Your job is to generate a high-quality quiz.

---

# 📘 TOPIC
"${topic}"

---

# 🧠 USER CONTEXT
- Difficulty: ${memory?.difficulty || "beginner"}
- Weak Areas: ${memory?.weakAreas?.join(", ") || "None"}

---

# ⚙️ INSTRUCTIONS

1. Generate 4–7 MCQ questions
2. Questions must:
   - Match difficulty level
   - Focus on weak areas if any
   - Test conceptual understanding (not memorization)

3. Each question must include:
   - id
   - question
   - 4 options
   - correctIndex
   - explanation

---

# 📦 OUTPUT (STRICT JSON)

{
  "mode": "quiz",
  "questions": [
    {
      "id": 1,
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "Why this is correct"
    }
  ]
}

---

# 🚫 RULES

- No text outside JSON
- Ensure correctness of answers
- Questions must be practical

Generate now.
`;

    return await callGemini(prompt);
  }

  // 👉 MODE 2: EVALUATE ANSWERS
  const prompt = `
You are an expert AI Learning Evaluator.

Your job is to analyze student performance deeply.

---

# 📘 TOPIC
"${topic}"

---

# 🧠 USER ANSWERS
${JSON.stringify(answers)}

---

# 🧠 USER CONTEXT
- Previous Scores: ${memory?.scores?.join(", ") || "None"}
- Weak Areas: ${memory?.weakAreas?.join(", ") || "None"}

---

# ⚙️ INSTRUCTIONS

1. Calculate score (0–100)
2. Identify weak areas (specific subtopics)
3. Analyze mistakes:
   - Conceptual gaps
   - Misunderstandings

4. Provide:
   - Feedback (clear explanation)
   - Improvement suggestions

5. Determine learning status:
   - "poor" (<50)
   - "average" (50–80)
   - "good" (>80)

---

# 📦 OUTPUT (STRICT JSON)

{
  "mode": "evaluation",
  "score": 0,
  "weakAreas": ["subtopic1"],
  "strengths": ["subtopic2"],
  "feedback": "Detailed feedback",
  "improvementPlan": [
    "Revise concept X",
    "Practice problems on Y"
  ],
  "performanceLevel": "poor"
}

---

# 🚫 RULES

- No text outside JSON
- Weak areas must be specific
- Feedback must be actionable

Evaluate now.
`;

  return await callGemini(prompt);
};