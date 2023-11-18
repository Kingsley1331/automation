import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// async function main() {
//   const completion = await openai.chat.completions.create(
//     {
//     messages: [
//     { role: "system", content: "You are a helpful assistant." },
//     { role: "user", content: "How many days are there in a year?" }
//   ],
//     model: "gpt-3.5-turbo-1106",
//     // model: "gpt-4-1106-preview",
//      },
     
//   );

//   const response = completion.choices[0]?.message?.content;
//   console.log(response);
// }

// main();

async function main(userInput) {
    const messages = [{ role: "system", content: "You are a helpful assistant." }];
    if (userInput){
        messages.push({ role: "user", content: userInput })
    }

    const completion = await openai.chat.completions.create(
        {
        messages,
        model: "gpt-3.5-turbo-1106",
        // model: "gpt-4-1106-preview",
        },
        
    );

    const response = completion.choices[0]?.message?.content;
    console.log(response);
    return response;
}

export default main;