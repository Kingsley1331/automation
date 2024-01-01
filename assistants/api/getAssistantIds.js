import OpenAI from "openai";
import "dotenv/config";
import fs from "fs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getAssistantIds() {
  const assistantList = (await openai.beta.assistants.list()).data;
  const assistantIds = assistantList.map(({ id, name }) => ({
    id,
    name,
  }));

  const assistantIdList = assistantIds.map((assistant) => assistant.id);

  addAsisstantsToDatabase(assistantIdList);
  return assistantIds;
}

export default getAssistantIds;

const addAsisstantsToDatabase = (assistantsFromOpenAI) => {
  const assistantListFromDatabase = getAssistantIdsFromDatabase();

  const missingAssistants = assistantsFromOpenAI.filter(
    (id) => !assistantListFromDatabase.includes(id)
  );
  const allAsssistantsFromDatabase = getAllAssistantsFromDatabase();

  missingAssistants.forEach((missingId) => {
    allAsssistantsFromDatabase.push({ assistantId: missingId, threadIds: [] });
  });

  fs.writeFileSync(
    "database/assistants.json",
    JSON.stringify(allAsssistantsFromDatabase)
  );
};

const getAssistantIdsFromDatabase = () => {
  const assistants = getAllAssistantsFromDatabase();
  const assistantIds = assistants.map(({ assistantId }) => assistantId);

  return assistantIds;
};

const getAllAssistantsFromDatabase = () => {
  const assistants = JSON.parse(
    fs.readFileSync("database/assistants.json", "utf8")
  );
  return assistants;
};
