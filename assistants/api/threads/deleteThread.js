import OpenAI from "openai";
import fs from "fs";
import "dotenv/config";
import { getAssistant, getOtherAssistants } from "./utility.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const removeThreadFromAssistant = (assistant_Id, threadId) => {
  const assistant = getAssistant(assistant_Id);

  if (!assistant) {
    return;
  }

  assistant.threadIds = assistant.threadIds.filter((id) => id !== threadId);

  const assistants = getOtherAssistants(assistant_Id);

  if (!assistants) {
    return;
  }
  assistants.push(assistant); // add the updated assistant to the array

  fs.writeFileSync("database/assistants.json", JSON.stringify(assistants));
};

const deleteThread = async (assistantId, threadId) => {
  const response = await openai.beta.threads.del(threadId);

  removeThreadFromAssistant(assistantId, threadId);

  console.log("deleteThread threadId ==>", threadId);
  return response;
};

export default deleteThread;
