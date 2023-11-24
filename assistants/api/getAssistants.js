import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getAssistants() {
  const assistantList = (await openai.beta.assistants.list()).data;
  //   console.log("assistantList ==>", assistantList);
  return assistantList;
}

export default getAssistants;
