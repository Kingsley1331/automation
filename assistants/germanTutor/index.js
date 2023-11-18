import OpenAI from "openai";
import readlineModule from "readline";

// Create a readline interface
const readline = readlineModule.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Create a OpenAI connection


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


async function askQuestion(question) {
  return new Promise((resolve, reject) => {
    readline.question(question, (answer) => {
      resolve(answer);
    });
  });
}


// const file = await openai.files.create({
//   file: fs.createReadStream("mydata.csv"),
//   purpose: "assistants",
// });

async function main() {
  try {
    const assistant = await openai.beta.assistants.create({
      name: "Deutsch Lehrer",
      instructions:
        "Hilf mir, mein Deutsch zu üben. Lass uns ein Gespräch führen, bei dem du mich jedes Mal, wenn ich einen Grammatikfehler mache, erst korrigierst, bevor du das Gespräch weiterführst",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4-1106-preview",
    //   file_ids: [file.id]
    });

    // Log the first greeting
    console.log(
      "\nHallo, ich bin dein persönlicher Deutschlehrer. Frag ruhig alles, was du möchtest.\n"
    );

    // Create a thread
    const thread = await openai.beta.threads.create();

    // Use keepAsking as state for keep asking questions
    let keepAsking = true;
    while (keepAsking) {
      const userQuestion = await askQuestion("\nWhat is your question? ");

      console.log({userQuestion})

      // Pass in the user question into the existing thread
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: userQuestion,
      });

      // Use runs to wait for the assistant response and then retrieve it
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
      });

      let runStatus = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );

      // Polling mechanism to see if runStatus is completed
      // This should be made more robust. eg should have error handling, also need to exit loop if it takes too long
      while (runStatus.status !== "completed") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      }

      // Get the last assistant message from the messages array
      const messages = await openai.beta.threads.messages.list(thread.id);

      // Find the last message for the current run
      const lastMessageForRun = messages.data
        .filter(
          (message) => message.run_id === run.id && message.role === "assistant"
        )
        .pop();

      // If an assistant message is found, console.log() it
      if (lastMessageForRun) {
        console.log(`${lastMessageForRun.content[0].text.value} \n`);
      }

      // Then ask if the user wants to ask another question and update keepAsking state
      const continueAsking = await askQuestion(
        "Do you want to ask another question? (yes/no) "
      );
      keepAsking = continueAsking.toLowerCase() === "yes";

      // If the keepAsking state is falsy show an ending message
      if (!keepAsking) {
        console.log("Alrighty then, I hope you learned something!\n");
      }
    }

    // close the readline
    readline.close();
  } catch (error) {
    console.error(error);
  }
}

// Call the main function
main();