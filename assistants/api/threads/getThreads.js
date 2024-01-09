import mongoose from "mongoose";
import "dotenv/config";
import assistants from "../../../models/assistants.js";

const getThreads = async (assistant_id) => {
  await mongoose.connect(process.env.MONGODB_URI);
  const assistantList = await assistants.find();
  const threads = assistantList
    .filter(({ assistantId }) => assistantId === assistant_id)
    .map(({ threadIds }) => threadIds)[0];
  return threads;
};

export default getThreads;
