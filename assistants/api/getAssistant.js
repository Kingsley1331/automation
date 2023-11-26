import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getAssistant(assistantId) {
  const assistantList = (await openai.beta.assistants.list()).data;
  const assistant = assistantList.filter(({ id }) => id === assistantId)[0];
  return assistant;
}

export default getAssistant;
