import OpenAI from "openai";
import "dotenv/config";
import convertTextToMp3 from "../utilities/convertTextToMp3.js";
import convertBufferToImage, {
  convertImageToBase64,
} from "../utilities/convertBufferToImage.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function vision(req, res, payload) {
  if (req?.file) {
    console.log("req.file", req.file);
    convertBufferToImage(req, res);
  }
  console.log(
    "=====================================================================VISION",
    payload
  );
  if (payload) {
    console.log(
      "=====================================================================payload"
    );
    payload.forEach((message) => {
      if (message.role === "user" && message.content[0].metadata) {
        const filename = message.content[0].metadata.split("/").pop();
        console.log("filename", filename);
        message.content.push({
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,
          ${convertImageToBase64(filename)}`,
          },
        });
      }
    });
  }

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
      model: "gpt-4-vision-preview",
      max_tokens: 600, // 4096 is the maximum possible
    });
  }

  if (payload) {
    stream = await openai.chat.completions.create({
      messages,
      model: "gpt-4-vision-preview",
      max_tokens: 600, // 4096 is the maximum possible
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

    // const response = completion.choices[0]?.message?.content;
    // console.log(response);
    // console.log("choices", completion.choices);
    // const message = completion.choices[0]?.message?.content;
    // console.log("message", message);
    await convertTextToMp3(sumOfTextStream);
  } else {
    messages.map((msg) => {
      if (typeof msg.content[1] === "object" && msg.role === "user") {
        msg.content = [msg.content[0]]; // remove image_url
      }
      return msg;
    });
    // return [...messages, ...completion.choices.map((choice) => choice.message)];
    res?.json({
      messages: [
        ...messages,
        ...completion.choices.map((choice) => choice.message),
      ],
    });
  }
}
export default vision;
