import express from "express";
import cors from "cors";
import main from "./chatbots/chat.js";
import mathsTeacher from "./assistants/mathsTeacher.js";

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
  // res.json({ message: "Hello from your server!" });
});

app.get("/assistants/mathsTeacher/message", async (req, res) => {
  const data = await mathsTeacher();
  const { message, threadId, runId } = data || {};
  console.log("=========================================message", message);
  res.json({ message, threadId, runId });
  // res.json({ message: "Hello from your server!" });
});

app.post("/assistants/mathsTeacher/message", async (req, res) => {
  const { userInput } = req.body;
  const data = await mathsTeacher(userInput);
  const { message, threadId, runId } = data || {};
  res.json({ message, threadId, runId });
});

app.post("/chatbots/chat/message", async (req, res) => {
  const { userInput } = req.body;
  const message = await main(userInput);
  res.json({ message });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
