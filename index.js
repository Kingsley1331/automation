import express from "express";
import cors from "cors";
import "dotenv/config";
import main from "./chatbots/chat.js";
import assistantChat from "./assistants/assistantChat.js";
import getAssistantIds from "./assistants/api/getAssistantIds.js";
import getAssistant from "./assistants/api/getAssistant.js";
import getAssistants from "./assistants/api/getAssistants.js";
import getThreads from "./assistants/api/getThreads.js";

const THREAD_ID = process.env.THREAD_ID;

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/chatbots/chat/message", async (req, res) => {
  const message = await main();
  res.json({ message });
});

app.post("/chatbots/chat/message", async (req, res) => {
  const { userInput } = req.body;
  const message = await main(userInput);
  res.json({ message });
});

app.get("/assistants/message", async (req, res) => {
  const messages = await getThreads(THREAD_ID);
  const assistantList = (await getAssistants()).map(({ id, name }) => ({
    id,
    name,
  }));

  res.json({ messages, assistantList });
});
/** Is this still needed? */
app.post("/assistants/message", async (req, res) => {
  const { userInput } = req.body;
  const data = await assistantChat(userInput);
  const { message, threadId, runId, assistantId, assistantList, messages } =
    data || {};
  res.json({ message, threadId, runId, assistantId, assistantList, messages });
});

app.get("/assistants", async (req, res) => {
  const assistantIds = await getAssistantIds();
  res.json({ assistantIds });
});

app.get("/assistant/:id", async (req, res) => {
  const { id } = req.params;
  const assistant = await getAssistant(id);
  res.json({ assistant });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
