import OpenAI from "openai";
import convertTextToMp3 from "../utilities/convertTextToMp3.js";
import "dotenv/config";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function speaker(payload) {
  console.log("payload ==>", payload);
  let messages;
  if (!payload) {
    messages = [{ role: "system", content: "You are a helpful assistant." }];
  }

  if (payload) {
    messages = [...payload];
  }

  const completion = await openai.chat.completions.create({
    messages,
    // model: "gpt-3.5-turbo-1106",
    model: "gpt-4-1106-preview",
  });

  const response = completion.choices[0]?.message?.content;
  console.log(response);
  console.log("choices", completion.choices);
  const message = completion.choices[0]?.message?.content;
  console.log("message", message);
  await convertTextToMp3(message);
  return [...messages, ...completion.choices.map((choice) => choice.message)];
}

export default speaker;
