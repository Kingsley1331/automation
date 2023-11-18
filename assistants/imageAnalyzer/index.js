import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// const file = await openai.files.create({
//   file: fs.createReadStream("mydata.csv"),
//   purpose: "assistants",
// });

async function main() {
 console.log('Hello I am an image analyzer. I can tell you what is in an image. Please send me an image.')
   const assistant = await openai.beta.assistants.create({
      name: "Image Analyzer",
      instructions:
        "You are an image analyzer, you will tell a user what is in an image.",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4-vision-preview",
    });

    // Create a thread
    const thread = await openai.beta.threads.create();

    // Pass in the user question into the existing thread
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: [
                {type:"text", text: "Can you tell me what is in this image?"},
                {type: "image_url", image_url: {url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"}},
            ],
      });

    // Use runs to wait for the assistant response and then retrieve it
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
      });

       const messages = await openai.beta.threads.messages.list(thread.id);

       console.log('messages ==>', messages.data[0].content);

}


main()