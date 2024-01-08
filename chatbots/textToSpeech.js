import OpenAI from "openai";
import convertTextToMp3 from "../utilities/convertTextToMp3.js";
import "dotenv/config";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function textToSpeech(req, res, payload) {
  console.log("payload ==>", payload);
  let messages;
  if (!payload) {
    messages = [{ role: "system", content: "You are a helpful assistant." }];
  }

  if (payload) {
    messages = [...payload];
  }

  const responseText = await openai.chat.completions.create({
    messages,
    model: "gpt-4-1106-preview",
    stream: !!payload,
  });

  if (payload) {
    let sumOfTextStream = "";
    let textStream = "";

    for await (const chunk of responseText) {
      textStream = chunk.choices[0]?.delta?.content || "";
      sumOfTextStream += textStream;
      res.write(textStream); // Stream the textStream to the client
    }
    res.end(); // End the response

    await convertTextToMp3(sumOfTextStream);
  } else {
    res.json({
      messages: [
        ...messages,
        ...responseText.choices.map((choice) => choice.message),
      ],
    });
  }
}

export default textToSpeech;
