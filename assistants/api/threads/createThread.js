import OpenAI from "openai";
import fs from "fs";
import "dotenv/config";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const getAssistant = (assistant_Id) => {
  const file = JSON.parse(fs.readFileSync("database/assistants.json", "utf8"));

  const assistant = file.filter(
    ({ assistantId }) => assistantId === assistant_Id
  )[0];

  return assistant;
};

const getOtherAssistants = (assistant_Id) => {
  const file = JSON.parse(fs.readFileSync("database/assistants.json", "utf8"));

  const assistants = file.filter(
    ({ assistantId }) => assistantId !== assistant_Id
  );

  return assistants;
};

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

  const assistant = getAssistant(assistantId);

  if (assistant) {
    addThreadToAssistant(assistantId, thread.id);
  }
  return thread;
};

export default createThread;
