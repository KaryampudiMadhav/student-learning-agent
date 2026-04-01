import Progress from "../models/Progress.js";

export const getMemory = async (sessionId) => {

  let memory = await Progress.findOne({ sessionId });

  if (!memory) {
    memory = await Progress.create({
      sessionId,
      currentTopic: "",
      difficulty: "beginner",
      scores: [],
      weakAreas: [],
      status: "learning"
    });
  }

  return memory;
};

export const updateMemory = async (sessionId, data) => {
  return await Progress.findOneAndUpdate(
    { sessionId },
    { $set: data },
    { returnDocument: "after" }
  );
};