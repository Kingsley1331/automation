import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../../components/Navigation";
import Messager from "../../components/Messager";

function Chatbot({ endpoint }) {
  const [messages, setMessages] = useState("");

  console.log("endpoint", endpoint);

  useEffect(() => {
    axios.get(`http://localhost:3001${endpoint}`).then(({ data }) => {
      console.log("get data ==>", data);
      // playAudio(); //visit: https://developer.chrome.com/blog/autoplay/
      return setMessages(data.messages);
    });
  }, [endpoint]);

  return (
    <>
      <Navigation />
      <Messager
        messages={messages}
        endpoint={`http://localhost:3001${endpoint}`}
        setMessages={setMessages}
      />
    </>
  );
}

export default Chatbot;
