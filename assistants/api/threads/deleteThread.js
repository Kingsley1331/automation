import OpenAI from "openai";
import "dotenv/config";
import assistants from "../../../models/assistants.js";
import { getAssistant } from "./utility.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const removeThreadFromAssistant = async (assistant_Id, threadId) => {
  const assistant = await getAssistant(assistant_Id);

  if (!assistant) {
    return;
  }

  assistant.threadIds = assistant.threadIds.filter((id) => id !== threadId);

  await assistants.updateOne(
    { assistantId: assistant_Id },
    { threadIds: assistant.threadIds }
  );
};

const deleteThread = async (assistantId, threadId) => {
  const response = await openai.beta.threads.del(threadId);

  removeThreadFromAssistant(assistantId, threadId);

  console.log("deleteThread threadId ==>", threadId);
  return response;
};

export default deleteThread;
