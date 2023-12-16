import fs from "fs";
import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function speechToText() {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream("uploads/audioFiles/output.mp3"),
    model: "whisper-1",
  });
  return transcription.text;
}

export default speechToText;
