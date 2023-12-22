import OpenAI from "openai";
import "dotenv/config";
import convertTextToMp3 from "../utilities/convertTextToMp3.js";
import { convertImageToBase64 } from "../utilities/convertBufferToImage.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function vision(payload) {
  if (payload) {
    console.log(
      "payload ==>",
      payload.map((message) => message.content)
    );
  }

  if (payload) {
    payload.forEach((message) => {
      if (message.role === "user" && message.content[0].metadata) {
        const filename = message.content[0].metadata.split("/").pop();
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

  const completion = await openai.chat.completions.create({
    messages,
    model: "gpt-4-vision-preview",
    max_tokens: 300,
  });

  const response = completion.choices[0]?.message?.content;
  console.log(response);
  console.log("choices", completion.choices);
  const message = completion.choices[0]?.message?.content;
  console.log("message", message);
  await convertTextToMp3(message);
  messages.map((msg) => {
    if (typeof msg.content[1] === "object" && msg.role === "user") {
      msg.content = [msg.content[0]];
    }
    return msg;
  });
  return [...messages, ...completion.choices.map((choice) => choice.message)];
}

export default vision;

// const express = require("express");
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");

// const app = express();

// // Set up multer to store uploaded files in the 'uploads' directory
// const upload = multer({ dest: "uploads/" });

// // POST route to handle the file upload
// app.post("/upload", upload.single("image"), (req, res) => {
//   // req.file is the 'image' file
//   // req.body will hold the text fields, if there were any

//   // Create a URL for the uploaded file
//   let imageUrl = "http://yourserver.com/" + req.file.path;
//   console.log("Image URL:", imageUrl);

//   res.status(200).send("File uploaded and URL created");
// });

// app.listen(3000, () => {
//   console.log("Server started on port 3000");
// });
