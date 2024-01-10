import mongoose from "mongoose";
import "dotenv/config";
import assistants from "../../../models/assistants.js";

export const getAssistant = async (assistant_Id) => {
  await mongoose.connect(process.env.MONGODB_URI);
  const assistantList = await assistants.find();

  const assistant = assistantList.filter(
    ({ assistantId }) => assistantId === assistant_Id
  )[0];

  return assistant;
};
