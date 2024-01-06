import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const speechFile = path.resolve("./speech/speech.mp3");

async function convertTextToMp3(text) {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    // voice: "onyx",
    voice: "shimmer",
    // voice: "nova",
    // voice: "fable",
    // voice: "alloy",
    input: text,
  });
  // console.log(speechFile);
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
  // console.log(
  //   "========================================================= CONVERSION COMMPKETE"
  // );
  global.convertTextToMp3 = true;
}

export default convertTextToMp3;
