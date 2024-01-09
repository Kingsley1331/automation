import OpenAI from "openai";
import "dotenv/config";
import assistants from "../../../models/assistants.js";
import { getAssistant, getOtherAssistants } from "./utility.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const addThreadToAssistant = async (assistant_Id, threadId) => {
  const assistant = await getAssistant(assistant_Id);

  if (!assistant) {
    return;
  }

  await assistants.updateOne(
    { assistantId: assistant_Id },
    { threadIds: [...assistant.threadIds, threadId] }
  );
};

const createThread = async (assistantId) => {
  const thread = await openai.beta.threads.create();
  addThreadToAssistant(assistantId, thread.id);

  return thread;
};

export default createThread;
