import React, { useState, useEffect } from "react";
import axios from "axios";
import Messager from "../../components/Messager";

function Chatbot({ endpoint }) {
  const [message, setMessage] = useState("");
  const [userInput, setUserInput] = useState(
    "How many faces does an icosahedron have?"
  );
  // what is the shape of each face?
  useEffect(() => {
    axios
      .get(`http://localhost:3001${endpoint}`)
      .then((res) => res)
      .then(({ data }) => {
        console.log("get data ==>", data);
        return setMessage(data.message);
      });
  }, [endpoint]);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:3001${endpoint}`, {
        userInput,
      })
      .then((res) => res)
      .then(({ data }) => {
        console.log("post data ==>", data);
        return setMessage(data.message);
      });
  };

  return (
    <Messager
      message={message}
      handleUserInput={handleUserInput}
      sendMessage={sendMessage}
      userInput={userInput}
    />
  );
}

export default Chatbot;
