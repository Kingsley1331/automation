import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../../components/Navigation";
import { sendMessage } from "../../utilities/audio";
import Messager from "../../components/Messager";

function Chatbot({ endpoint }) {
  const [messages, setMessages] = useState("");
  const [userInput, setUserInput] = useState("");

  console.log("endpoint", endpoint);

  useEffect(() => {
    axios.get(`http://localhost:3001${endpoint}`).then(({ data }) => {
      console.log("get data ==>", data);
      // playAudio(); //visit: https://developer.chrome.com/blog/autoplay/
      return setMessages(data.messages);
    });
  }, [endpoint]);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  console.log("messages", messages);
  console.log("userInput", userInput);

  return (
    <>
      <Navigation />
      <Messager
        handleUserInput={handleUserInput}
        sendMessage={(e) => {
          e.preventDefault();
          sendMessage(
            [...messages, { role: "user", content: userInput }],
            setUserInput,
            `http://localhost:3001${endpoint}`,
            setMessages
          );
        }}
        userInput={userInput}
        setUserInput={setUserInput}
        messages={messages}
      />
    </>
  );
}

export default Chatbot;
