import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getAssistantIds() {
  const assistantList = (await openai.beta.assistants.list()).data;
  const assistantIds = assistantList.map(({ id, name }) => ({
    id,
    name,
  }));

  return assistantIds;
}

export default getAssistantIds;
