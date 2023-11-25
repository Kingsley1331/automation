import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getThreads(threadId) {
  const messages = await openai.beta.threads.messages.list(threadId);
  return messages;
}

export default getThreads;
