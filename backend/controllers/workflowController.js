import Progress from "../models/Progress.js";
import { evaluatorAgent } from './../agents/evaluatorAgent.js';
import { plannerAgent } from './../agents/plannerAgent.js';
import { resourceAgent } from './../agents/resourceAgent.js';
import { taskAgent } from './../agents/taskAgent.js';
import { orchestratorAgent } from './../agents/orchestratorAgent.js';
import { revisionAgent } from './../agents/revisionAgent.js';
import { getMemory, updateMemory } from "../agents/memoryAgent.js";

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
      map.set(topic, existing);
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


// 🔥 AGENT LOGGER
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
    console.log("Session:", sessionId);

    // 🧠 STEP 1: GET MEMORY
    let memory = await getMemory(sessionId);

    // 🔗 LINK USER + SESSION
    await updateMemory(sessionId, { userId });

    await logAgent(sessionId, "memory_before", memory);

    // 📅 STEP 2: SKIPPED DAYS + ACTIVITY
    const today = new Date();
    const lastActive = new Date(memory.lastActiveDate || today);

    const diffDays = Math.floor(
      (today - lastActive) / (1000 * 60 * 60 * 24)
    );

    await updateMemory(sessionId, {
      skippedDays: diffDays > 1 ? diffDays : 0,
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

    // 📚 STEP 4: RESOURCES
    const resources = await resourceAgent({ topic, memory });
    await logAgent(sessionId, "resource", resources);

    // 📝 STEP 5: TASKS
    const tasks = await taskAgent({ topic, memory });
    await logAgent(sessionId, "task", tasks);

    // 📊 STEP 6: EVALUATION
    let evaluation = null;

    if (!answers) {
      evaluation = await evaluatorAgent({ topic, memory });
      await logAgent(sessionId, "quiz_generation", evaluation);
    } else {
      evaluation = await evaluatorAgent({ topic, answers, memory });
      await logAgent(sessionId, "evaluation", evaluation);

      // 📊 SCORE HISTORY
      const updatedScores = [
        ...(memory.scores || []),
        {
          topic,
          score: evaluation.score,
          date: new Date()
        }
      ];

      // 🧠 WEAK AREA TRACKING
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

      // 🔥 STREAK SYSTEM
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      let streak = memory.streak || 0;

      if (
        memory.lastActiveDate &&
        new Date(memory.lastActiveDate).toDateString() ===
          yesterday.toDateString()
      ) {
        streak += 1;
      } else {
        streak = 1;
      }

      // 💾 SAVE ALL
      await updateMemory(sessionId, {
        scores: updatedScores,
        weakAreas: updatedWeakAreas,
        dailyProgress: updatedDailyProgress,
        status: evaluation.performanceLevel,
        streak
      });
    }

    // 🧠 STEP 7: ORCHESTRATOR
    const decision = await orchestratorAgent({
      memory,
      evaluation
    });

    await logAgent(sessionId, "orchestrator", decision);

    // 🔁 STEP 8: REVISION
    let revision = null;

    if (decision.action === "assign_revision") {
      revision = await revisionAgent({
        weakAreas: evaluation?.weakAreas || [],
        memory
      });

      await logAgent(sessionId, "revision", revision);
    }

    // 🔥 STEP 9: FINAL MEMORY UPDATE
    await updateMemory(sessionId, {
      currentTopic: decision.nextTopic || topic,
      difficulty: decision.difficultyAction || memory.difficulty
    });

    const finalMemory = await getMemory(sessionId);
    await logAgent(sessionId, "memory_after", finalMemory);

    console.log("✅ WORKFLOW COMPLETE");

    // 🚀 RESPONSE
    res.json({
      success: true,
      sessionId,
      data: {
        planner: plan,
        resource: resources,
        task: tasks,
        evaluation,
        orchestrator: decision,
        revision,
        memory: finalMemory
      }
    });

  } catch (err) {
    console.error("❌ WORKFLOW ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};