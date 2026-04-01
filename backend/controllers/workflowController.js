import Progress from "../models/Progress.js";
import { evaluatorAgent } from './../agents/evaluatorAgent.js';
import { plannerAgent } from './../agents/plannerAgent.js';
import { resourceAgent } from './../agents/resourceAgent.js';
import { taskAgent } from './../agents/taskAgent.js';
import { orchestratorAgent } from './../agents/orchestratorAgent.js';
import { revisionAgent } from './../agents/revisionAgent.js';
import { getMemory, updateMemory } from "../agents/memoryAgent.js";


// 🔥 MERGE WEAK AREAS (GOOD - KEEP)
const mergeWeakAreas = (existingWeakAreas = [], newWeakAreas = []) => {
  const map = new Map();

  for (const item of existingWeakAreas) {
    if (!item?.topic) continue;
    map.set(item.topic, {
      topic: item.topic,
      count: item.count || 1,
      lastSeen: item.lastSeen || new Date()
    });
  }

  for (const topic of newWeakAreas) {
    if (!topic) continue;
    const existing = map.get(topic);

    if (existing) {
      existing.count += 1;
      existing.lastSeen = new Date();
    } else {
      map.set(topic, {
        topic,
        count: 1,
        lastSeen: new Date()
      });
    }
  }

  return Array.from(map.values());
};


// 🔥 LOGGER
const logAgent = async (sessionId, agent, output) => {
  console.log(`\n🧠 ${agent.toUpperCase()} OUTPUT:`);
  console.log(JSON.stringify(output, null, 2));

  await Progress.findOneAndUpdate(
    { sessionId },
    {
      $push: {
        agentLogs: {
          agent,
          output,
          timestamp: new Date()
        }
      }
    }
  );
};


// 🚀 MAIN WORKFLOW
export const runWorkflow = async (req, res) => {
  try {
    const { goal, answers } = req.body;
    const sessionId = req.sessionId;
    const userId = req.userId;

    console.log("\n🚀 START WORKFLOW");

    // 🧠 STEP 1: MEMORY
    let memory = await getMemory(sessionId);

    await updateMemory(sessionId, { userId });

    await logAgent(sessionId, "memory_before", memory);

    // 🔥 STEP 2: STREAK + ACTIVITY (FIXED)
    const today = new Date();
    const lastActive = new Date(memory.lastActiveDate || today);

    const diffDays = Math.floor(
      (today - lastActive) / (1000 * 60 * 60 * 24)
    );

    let streak = memory.streak || 0;

    if (diffDays === 1) {
      streak += 1;
    } else if (diffDays > 1) {
      streak = 1;
    }

    const skippedDays = diffDays > 1 ? diffDays - 1 : 0;

    await updateMemory(sessionId, {
      streak,
      skippedDays,
      lastActiveDate: today
    });

    // 🧠 STEP 3: PLANNER
    let plan = {
      roadmap: memory.roadmap,
      currentTopic: memory.currentTopic
    };

    if (!memory.roadmap || memory.roadmap.length === 0) {
      plan = await plannerAgent({ goal, memory });
      await logAgent(sessionId, "planner", plan);

      await updateMemory(sessionId, {
        roadmap: plan.roadmap,
        currentTopic: plan.currentTopic
      });
    }

    const topic = memory.currentTopic || plan.currentTopic;

    // 📚 STEP 4
    const resources = await resourceAgent({ topic, memory });
    await logAgent(sessionId, "resource", resources);

    const tasks = await taskAgent({ topic, memory });
    await logAgent(sessionId, "task", tasks);

    // 📊 STEP 5: EVALUATION
    let evaluation = null;

    if (!answers) {
      evaluation = await evaluatorAgent({ topic, memory });
      await logAgent(sessionId, "quiz_generation", evaluation);
    } else {
      evaluation = await evaluatorAgent({ topic, answers, memory });
      await logAgent(sessionId, "evaluation", evaluation);

      // 📊 SCORES
      const updatedScores = [
        ...(memory.scores || []),
        { topic, score: evaluation.score, date: new Date() }
      ];

      // 🧠 WEAK AREAS
      const updatedWeakAreas = mergeWeakAreas(
        memory.weakAreas || [],
        evaluation.weakAreas || []
      );

      // 📈 DAILY PROGRESS
      const todayStr = new Date().toISOString().split("T")[0];

      const existingDay = memory.dailyProgress?.find(
        d => new Date(d.date).toISOString().split("T")[0] === todayStr
      );

      let updatedDailyProgress;

      if (existingDay) {
        updatedDailyProgress = memory.dailyProgress.map(d => {
          if (
            new Date(d.date).toISOString().split("T")[0] === todayStr
          ) {
            return {
              ...d,
              score: evaluation.score,
              tasksCompleted: (d.tasksCompleted || 0) + 1
            };
          }
          return d;
        });
      } else {
        updatedDailyProgress = [
          ...(memory.dailyProgress || []),
          {
            date: new Date(),
            topic,
            score: evaluation.score,
            tasksCompleted: 1
          }
        ];
      }

      // 📚 🔥 LEARNING HISTORY (ADDED)
      const updatedHistory = [
        ...(memory.learningHistory || []),
        {
          topic,
          action: "completed",
          score: evaluation.score,
          date: new Date()
        }
      ];

      // 💾 SAVE
      await updateMemory(sessionId, {
        scores: updatedScores,
        weakAreas: updatedWeakAreas,
        dailyProgress: updatedDailyProgress,
        learningHistory: updatedHistory,
        streak,
        lastActiveDate: new Date()
      });
    }

    // 🧠 STEP 6
    const decision = await orchestratorAgent({
      memory,
      evaluation
    });

    await logAgent(sessionId, "orchestrator", decision);

    // 🔁 STEP 7
    let revision = null;

    if (decision.action === "assign_revision") {
      revision = await revisionAgent({
        weakAreas: evaluation?.weakAreas || [],
        memory
      });

      await logAgent(sessionId, "revision", revision);
    }

    // 🔥 FINAL UPDATE
    await updateMemory(sessionId, {
      currentTopic: decision.nextTopic || topic,
      difficulty: decision.difficultyAction || memory.difficulty
    });

    const finalMemory = await getMemory(sessionId);

    await logAgent(sessionId, "memory_after", finalMemory);

    console.log("✅ WORKFLOW COMPLETE");

    res.json({
      success: true,
      sessionId,
      data: {
        day: currentDay,
        topic,
        resource: resources,
        task: tasks,
        evaluation,
        orchestrator: decision,
        revision,
        streak: finalMemory.streak,
        history: finalMemory.dailyLogs,
        currentDay: finalMemory.currentDay
      }
    });

  } catch (err) {
    console.error("❌ WORKFLOW ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};