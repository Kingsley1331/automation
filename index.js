import express from "express";
import cors from "cors";
import "dotenv/config";
import main from "./chatbots/chat.js";
import assistantChat from "./assistants/assistantChat.js";
import getAssistantIds from "./assistants/api/getAssistantIds.js";
import getAssistant from "./assistants/api/getAssistant.js";
import getAssistants from "./assistants/api/getAssistants.js";
import getThread from "./assistants/api/getThread.js";
import getThreads from "./assistants/api/threads/getThreads.js";
import createThread from "./assistants/api/threads/createThread.js";
import deleteThread from "./assistants/api/threads/deleteThread.js";

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

app.get("/assistants/message/:threadId", async (req, res) => {
  const { threadId } = req.params;
  const messages = await getThread(threadId);
  const assistantList = (await getAssistants()).map(({ id, name }) => ({
    id,
    name,
  }));

  res.json({ messages, assistantList });
});
/** Is this still needed? */
app.post("/assistants/message/:threadId", async (req, res) => {
  const { threadId } = req.params;
  const { userInput } = req.body;
  const data = await assistantChat(userInput, threadId);
  const { message, runId, assistantId, assistantList, messages } = data || {};
  res.json({ message, runId, assistantId, assistantList, messages });
});

app.post("/create_chat/:assistantId", async (req, res) => {
  const { assistantId } = req.params;
  const message = await createThread(assistantId);
  res.json({ message });
});

app.delete("/delete_chat/:assistantId/:threadId", async (req, res) => {
  const { assistantId, threadId } = req.params;
  console.log({ assistantId, threadId });
  const message = await deleteThread(assistantId, threadId);
  res.json({ message });
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

app.get("/threads/:assistantId", async (req, res) => {
  const { assistantId } = req.params;
  const threads = await getThreads(assistantId);
  console.log("threads ==>", threads);
  res.json({ threads });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
