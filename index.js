import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import multer from "multer";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
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

ffmpeg.setFfmpegPath(ffmpegStatic);

const upload = multer({ dest: "uploads/" });

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

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
/*****************************************************************************************************************/
app.get("/text-to-speech/message", async (req, res) => {
  const messages = await textToSpeech();
  res.json({ messages });
});

app.post("/text-to-speech/message", async (req, res) => {
  const { userInput } = req.body;
  const messages = await textToSpeech(userInput);
  const text = await speechToText();
  res.json({ messages, text });
});

// Route to stream MP3
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.get("/speech", async (req, res) => {
  const filePath = path.join(__dirname, "speech/speech.mp3");
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;
  console.log("range ==>", range);
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "audio/mp3",
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "audio/mp3",
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

app.post("/speech", upload.single("audio"), (req, res) => {
  const { audioBlob } = req.body;
  console.log("======================> audioBlob", audioBlob);
  const audioPath = req.file.path;
  const outputPath = "uploads/audioFiles/output.mp3";

  ffmpeg(audioPath)
    .toFormat("mp3")
    .on("end", () => {
      console.log("Conversion finished.");
      res.send("File converted to MP3 successfully.");
    })
    .on("error", (err) => {
      console.error("Error:", err);
      res.status(500).send("Error converting file");
    })
    .saveToFile(outputPath);

  // res.json({ audioBlob });
});

/*****************************************************************************************************************/
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
