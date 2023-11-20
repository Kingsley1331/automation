import express from "express";
import cors from "cors";
import main from "./chatbots/chat.js";
import mathsTeacher from "./assistants/assistantChat.js";
import getAssistantIds from "./assistants/api/getAssistantIds.js";
import getAssistant from "./assistants/api/getAssistant.js";

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
  const data = await mathsTeacher();
  const { message, threadId, runId, assistantId, assistantList } = data || {};
  console.log("=========================================data", data);
  res.json({ message, threadId, runId, assistantId, assistantList });
});
/** Is this still needed? */
app.post("/assistants/message", async (req, res) => {
  const { userInput } = req.body;
  const data = await mathsTeacher(userInput);
  const { message, threadId, runId, assistantId, assistantList } = data || {};
  res.json({ message, threadId, runId, assistantId, assistantList });
});

app.get("/assistants", async (req, res) => {
  const assistantIds = await getAssistantIds();
  console.log(
    "=========================================assistantIds",
    assistantIds
  );
  res.json({ assistantIds });
});

app.get("/assistant/:id", async (req, res) => {
  const { id } = req.params;
  console.log("=========================================id", id);
  const assistant = await getAssistant(id);
  console.log("=========================================assistant1", assistant);
  res.json({ assistant });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
