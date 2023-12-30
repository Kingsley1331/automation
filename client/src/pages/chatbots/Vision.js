import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../../components/Navigation";
import Messager from "../../components/Messager";

function Chatbot({ endpoint }) {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful assistant." },
  ]);

  console.log("endpoint", endpoint);

  useEffect(() => {
    axios.get("http://localhost:3001/message/vision").then(({ data }) => {
      console.log("get data ==>", data);
      // playAudio(); //visit: https://developer.chrome.com/blog/autoplay/
      if (data?.messages) {
        return setMessages(data.messages);
      }
    });
  }, [endpoint]);

  return (
    <>
      <Navigation />
      <Messager
        metaData={{ type: "vision" }}
        messages={messages}
        setMessages={setMessages}
      />
    </>
  );
}

export default Chatbot;
