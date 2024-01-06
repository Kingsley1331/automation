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
  /**TODO: refactor code below, remove duplication */
  let completion;
  let stream;

  if (!payload) {
    completion = await openai.chat.completions.create({
      messages,
      model: "gpt-4-1106-preview",
      // stream: true,
    });
  }
  if (payload) {
    stream = await openai.chat.completions.create({
      messages,
      model: "gpt-4-1106-preview",
      stream: true,
    });

    let sumOfTextStream = "";

    let textStream = "";

    for await (const chunk of stream) {
      textStream = chunk.choices[0]?.delta?.content || "";
      sumOfTextStream += textStream;
      res.write(textStream); // Stream the textStream to the client
    }
    res.end(); // End the response

    await convertTextToMp3(sumOfTextStream);
  } else {
    // return [...messages, ...completion.choices.map((choice) => choice.message)];
    res?.json({
      messages: [
        ...messages,
        ...completion.choices.map((choice) => choice.message),
      ],
    });
  }
}

export default textToSpeech;
