import OpenAI from "openai";
import fs from "fs";
import "dotenv/config";
import { getAssistant, getOtherAssistants } from "./utility.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const addThreadToAssistant = (assistant_Id, threadId) => {
  const assistant = getAssistant(assistant_Id);

  if (!assistant) {
    return;
  }

  assistant.threadIds.push(threadId);

  const assistants = getOtherAssistants(assistant_Id);

  if (!assistants) {
    return;
  }
  assistants.push(assistant); // add the updated assistant to the array

  fs.writeFileSync("database/assistants.json", JSON.stringify(assistants));
};

const createThread = async (assistantId) => {
  const thread = await openai.beta.threads.create();
  console.log("assistantId ==>", assistantId);
  console.log("thread ==>", thread);

  addThreadToAssistant(assistantId, thread.id);

  return thread;
};

export default createThread;
