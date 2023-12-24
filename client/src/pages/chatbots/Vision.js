import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../../components/Navigation";
import Messager from "../../components/Messager";

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

  const sendMessageFn = (callback, selectedFileName, isSoundOn) => {
    console.log("========================>selectedFileName", selectedFileName);
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
      isSoundOn
    );
  };

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
