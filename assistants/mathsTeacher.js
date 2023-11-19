import OpenAI from "openai";

// Create a OpenAI connection

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function startNewChat() {}

async function mathsTeacher(userInput) {
  const {
    threadId,
    runId,
    message: userMessage,
    assistantId,
  } = userInput || {};
  let thread;
  let threadId2;
  let assistant = {};
  const assistantList = (await openai.beta.assistants.list()).data;
  console.log("========================================userInput", userInput);
  console.log("List of assistants", assistantList);
  // async function mathsTeacher(assistantId, threadId, userInput) {
  try {
    if (!assistantList.length) {
      assistant = await openai.beta.assistants.create({
        name: "Math Tutor",
        instructions:
          "You are a personal math tutor. Write and run code to answer math questions.",
        tools: [{ type: "code_interpreter" }],
        model: "gpt-4-1106-preview",
        //   file_ids: [file.id]
      });
    } else {
      if (assistantId) {
        assistant = assistantList.filter(
          (assist) => assist.id === assistantId
        )[0];
      }
    }

    console.log("==============================assistant", assistant);

    // Create a thread
    if (!threadId) {
      thread = await openai.beta.threads.create();
      threadId2 = thread.id;
    } else {
      threadId2 = threadId;
    }

    console.log({ userInput });

    // Pass in the user question into the existing thread
    if (userInput) {
      await openai.beta.threads.messages.create(threadId2, {
        role: "user",
        content: userMessage,
      });
    } else {
      await openai.beta.threads.messages.create(threadId2, {
        role: "user",
        content:
          "Hello there, I'm your personal math tutor. Ask some complicated questions.",
      });
    }

    // Use runs to wait for the assistant response and then retrieve it
    //=================================================================================================
    let lastMessage = "";
    if (assistant.id) {
      const run = await openai.beta.threads.runs.create(threadId2, {
        assistant_id: assistant.id,
      });

      let runStatus = await openai.beta.threads.runs.retrieve(
        threadId2,
        run.id
      );

      // Polling mechanism to see if runStatus is completed
      // This should be made more robust. eg should have error handling, also need to exit loop if it takes too long
      while (runStatus.status !== "completed") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        runStatus = await openai.beta.threads.runs.retrieve(threadId2, run.id);
      }

      // Get the last assistant message from the messages array
      const messages = await openai.beta.threads.messages.list(threadId2);

      // Find the last message for the current run
      const lastMessageForRun = messages.data
        .filter(
          (message) => message.run_id === run.id && message.role === "assistant"
        )
        .pop();

      // If an assistant message is found, console.log() it
      // if (lastMessageForRun) {
      lastMessage = lastMessageForRun.content[0].text.value;
      console.log(lastMessage);
    }

    return {
      message: lastMessage,
      threadId: threadId2,
      assistantId: assistant.id || "",
      assistantList,
      runId: "",
    };
    // }
  } catch (error) {
    console.error(error);
  }
}

export default mathsTeacher;
