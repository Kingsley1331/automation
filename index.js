import express from "express";
import cors from "cors";
import multer from "multer";
import "dotenv/config";
import main from "./chatbots/chat.js";
import textToSpeech from "./chatbots/textToSpeech.js";
import speechToText from "./chatbots/speechToText.js";
import assistantChat from "./assistants/assistantChat.js";
import getAssistantIds from "./assistants/api/getAssistantIds.js";
import getAssistant from "./assistants/api/getAssistant.js";
import getAssistants from "./assistants/api/getAssistants.js";
import getThread from "./assistants/api/getThread.js";
import getThreads from "./assistants/api/threads/getThreads.js";
import createThread from "./assistants/api/threads/createThread.js";
import deleteThread from "./assistants/api/threads/deleteThread.js";
import streamAudioToClient from "./utilities/streamAudioToClient.js";
import convertBlobToMp3 from "./utilities/convertBlobToMp3.js";
import vision from "./chatbots/vision.js";
import convertBufferToImage, {
  convertBufferToBase64,
} from "./utilities/convertBufferToImage.js";
import convertTextToMp3 from "./utilities/convertTextToMp3.js";
import { count } from "console";

const upload = multer({ dest: "uploads/" });
const storage = multer.memoryStorage();
const uploadImage = multer({ storage: storage });

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/chatbots/chat/message", async (req, res) => {
  const messages = await main();
  res.json({ messages });
});

app.post("/chatbots/chat/message", async (req, res) => {
  const { userInput } = req.body;
  const messages = await main(userInput);
  res.json({ messages });
});

app.post("/text-to-audio", async (req, res) => {
  const { text } = req.body;
  if (text) {
    await convertTextToMp3(text);
  }

  streamAudioToClient(req, res, "speech/speech.mp3");
});

/************************************************** MESSAGE ***************************************************************/
app.get("/message/:type/:threadId?", async (req, res) => {
  const { type, threadId = "id" } = req.params;
  let messages;
  let assistantList = [];

  if (type === "textToSpeech") {
    messages = await textToSpeech(req, res);
  }
  if (type === "vision") {
    messages = await vision(req, res);
  }
  if (type === "assistant" && threadId) {
    messages = await getThread(threadId);
    assistantList = (await getAssistants()).map(({ id, name }) => ({
      id,
      name,
    }));
    res.json({ messages, assistantList });
  }

  // res.json({ messages, assistantList });
});

app.post(
  "/message/:type/:threadId?",
  uploadImage.single("image"),
  async (req, res) => {
    const { type, threadId } = req.params;
    const { payload } = req.body;
    console.log("payload1", payload);

    let messages;

    if (type === "textToSpeech") {
      await textToSpeech(req, res, payload);
      // messages = await textToSpeech(req, res, payload);

      // console.log("========messages", messages);
      // res.json({ messages });
    }

    if (type === "vision") {
      console.log("vison req.file", req.file);
      await vision(req, res, payload);

      // if (req.file) {
      //   console.log("req.file", req.file);
      //   convertBufferToImage(req, res);
      // }

      // res.json({ messages });
    }

    if (type === "assistant" && threadId) {
      const data = await assistantChat(payload, threadId);
      let { message, runId, assistantId, assistantList, messages } = data || {};
      messages = messages.reverse();
      res.json({ message, runId, assistantId, assistantList, messages });
    }

    // console.log("========messages", messages);
  }
);

/************************************************* USED BY MESSAGER COMPONENT ****************************************************************/

app.get("/speech", (req, res) => {
  console.log("=============================> GET AUDIO");
  const timer = setInterval(() => {
    if (global.convertTextToMp3) {
      streamAudioToClient(req, res, "speech/speech.mp3");
      clearInterval(timer);
      global.convertTextToMp3 = false;
    }
  });
});

app.post("/speech", upload.single("audio"), async (req, res) => {
  convertBlobToMp3(req, res);
});

app.get("/text-from-audio", async (req, res) => {
  const textFromAudio = await speechToText();
  // console.log("===================>textFromAudio", textFromAudio);
  res.json({ textFromAudio });
});

/*****************************************************************************************************************/

app.post("/create_chat/:assistantId", async (req, res) => {
  const { assistantId } = req.params;
  const message = await createThread(assistantId);
  res.json({ message });
});

app.delete("/delete_chat/:assistantId/:threadId", async (req, res) => {
  const { assistantId, threadId } = req.params;
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
  res.json({ threads });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
