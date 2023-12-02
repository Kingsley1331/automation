import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const speechFile = path.resolve("./speech/speech.mp3");

async function main(message) {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: message,
  });
  console.log(speechFile);
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
}

async function speaker(userInput) {
  const messages = [
    { role: "system", content: "You are a helpful assistant." },
  ];
  if (userInput) {
    messages.push({ role: "user", content: userInput });
  }

  const completion = await openai.chat.completions.create({
    messages,
    model: "gpt-3.5-turbo-1106",
    // model: "gpt-4-1106-preview",
  });

  const response = completion.choices[0]?.message?.content;
  console.log(response);
  console.log("choices", completion.choices);
  const message = completion.choices[0]?.message?.content;
  console.log("message", message);
  await main(message);
  return completion.choices;
}

export default speaker;
