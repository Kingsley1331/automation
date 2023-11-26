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
// database/assistants.json
// [
//   {
//     assistantId: "asst_nsN6ZIzVHRtkL89Lwyg1deO4",
//     threadIds: [
//       "thread_a6SlWfJ9gnItdxibdfpTYyoL",
//       "thread_mIxTuiTzK2Y1NkDMrmPpI13l",
//     ],
//   },
//   {
//     assistantId: "asst_jQN8jrgUQlSpotKHuHoGbBNH",
//     threadIds: [
//       "thread_pezwGJ8s8z2AXEeX1HUscwIE",
//       "thread_hxuh6xDJIvDvdGToiBrD5tzh",
//     ],
//   },
//   {
//     assistantId: "asst_Hvvslw02GyI1r8kFQRRVSKPe",
//     threadIds: ["thread_qNjBZTcVIHCpqYI3fXEriFwI"],
//   },
// ];
