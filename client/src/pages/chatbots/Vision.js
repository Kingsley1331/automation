import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../../components/Navigation";
import Messager from "../../components/Messager";

const images = [
  "https://www.tatesofsussex.co.uk/wp-content/uploads/2021/06/Orchids.jpeg",
  "https://cdn.britannica.com/79/232779-050-6B0411D7/German-Shepherd-dog-Alsatian.jpg",
];

function Chatbot({ endpoint }) {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful assistant." },
  ]);
  const [userInput, setUserInput] = useState("");

  console.log("endpoint", endpoint);

  useEffect(() => {
    axios.get(`http://localhost:3001${endpoint}`).then(({ data }) => {
      console.log("get data ==>", data);
      // playAudio(); //visit: https://developer.chrome.com/blog/autoplay/
      if (data?.messages) {
        return setMessages(data.messages);
      }
    });
  }, [endpoint]);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  console.log("messages", messages);
  console.log("userInput", userInput);

  const sendMessageFn = (callback, selectedFileName) => {
    console.log("========================>selectedFileName", selectedFileName);
    // const sendMessageFn = (callback, imageUrl, setImageUrl) => {

    // const content = [
    //   {
    //     type: "text",
    //     text: "Can you describe what you see in this image?",
    //   },
    //   {
    //     type: "image_url",
    //     image_url: {
    //       url: images[0],
    //     },
    //   },
    // ];
    // setMessages((msgs) =>
    //   msgs.map((msg) => {
    //     if (msg.content[1]) {
    //       msg.content = [msg.content[0]];
    //     }
    //     return msg;
    //   })
    // );
    callback(
      [
        ...messages,
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userInput,
              ...(selectedFileName && {
                metadata: `http://localhost:3001/imageFiles/${selectedFileName}`,
              }),
            },
            // {
            //   type: "image_url",
            //   image_url: {
            //     url: imageUrl,
            //   },
            // },
          ],
        },
      ],
      setUserInput,
      `http://localhost:3001${endpoint}`,
      setMessages,
      selectedFileName
      // setImageUrl
    );
  };
  // const sendMessageFn = (callback) =>
  //   callback(
  //     [...messages, { role: "user", content: userInput }],
  //     setUserInput,
  //     `http://localhost:3001${endpoint}`,
  //     setMessages
  //   );

  return (
    <>
      <Navigation />
      <Messager
        handleUserInput={handleUserInput}
        sendMessageFn={sendMessageFn}
        userInput={userInput}
        setUserInput={setUserInput}
        messages={messages}
      />
    </>
  );
}

export default Chatbot;
