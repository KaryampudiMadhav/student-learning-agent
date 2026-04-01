// import { callGeminiApi } from '../services/geminiService.js';
// import Progress from '../models/Progress.js';

// // 7. Memory Agent (NO LLM)
// export const getMemory = async (userId) => {
//   let progress = await Progress.findOne({ userId });
//   if (!progress) {
//     progress = new Progress({ userId });
//     await progress.save();
//   }
//   return progress;
// };

// export const saveProgress = async (userId, updateData) => {
//   return await Progress.findOneAndUpdate({ userId }, updateData, { new: true, upsert: true });
// };

// // 1. Planner Agent
// export const PlannerAgent = async (userInput) => {
//   const prompt = `Break the learning goal "${userInput}" into a structured roadmap with levels (beginner -> advanced). Return JSON strictly matching this format: { "roadmap": [{ "level": "beginner", "topics": ["topic1", "topic2"] }, ...], "currentTopic": "first_topic" }`;
//   return await callGeminiApi(prompt);
// };

// // 2. Resource Agent
// export const ResourceAgent = async (topic) => {
//   const prompt = `Provide high-quality learning resources (YouTube + articles) for the topic "${topic}" with difficulty tagging. Return JSON strictly matching this format: { "resources": [{ "title": "...", "url": "...", "type": "video|article", "difficulty": "beginner|intermediate|advanced" }] }`;
//   return await callGeminiApi(prompt);
// };

// // 3. Task Agent
// export const TaskAgent = async (topic, difficulty) => {
//   const prompt = `Generate practical tasks and mini projects based on the topic "${topic}" and difficulty "${difficulty}". Return JSON strictly matching this format: { "tasks": [{ "title": "...", "description": "...", "type": "task|project" }] }`;
//   return await callGeminiApi(prompt);
// };

// // 4. Evaluator Agent
// export const EvaluatorAgent = async (topic, userAnswers) => {
//   if (!userAnswers) {
//     // Generate questions
//     const prompt = `Generate a 3-question multiple choice quiz for the topic "${topic}". Return JSON: { "questions": [{ "id": 1, "question": "...", "options": ["a", "b", "c", "d"], "correctIndex": 0 }] }`;
//     return await callGeminiApi(prompt);
//   } else {
//     // Evaluate answers
//     const prompt = `Evaluate these answers for a quiz on "${topic}": ${JSON.stringify(userAnswers)}. Return JSON: { "score": 80, "weakAreas": ["subtopic1", "subtopic2"], "feedback": "overall feedback" }`;
//     return await callGeminiApi(prompt);
//   }
// };

// // 5. Revision Agent
// export const RevisionAgent = async (weakAreas) => {
//   if (!weakAreas || weakAreas.length === 0) return { revisionPlan: "No revision needed." };
//   const prompt = `Create a revision plan for these weak topics: ${weakAreas.join(", ")}. Return JSON: { "revisionPlan": [{ "topic": "...", "action": "..." }] }`;
//   return await callGeminiApi(prompt);
// };

// // 6. Orchestrator Agent (MOST IMPORTANT)
// export const OrchestratorAgent = async (score, weakAreas, memory) => {
//   const prompt = `User scored ${score}% in ${memory.currentTopic}. Weak areas: ${weakAreas.join(", ")}. Difficulty was ${memory.difficulty}. Describe the user's progress. Decide next action out of strictly: ["move forward", "repeat topic", "assign revision"]. Explain WHY. Return JSON strictly matching this format: { "action": "move forward", "explanation": "Detailed explanation of why", "nextDifficulty": "intermediate" }`;
//   return await callGeminiApi(prompt);
// };
