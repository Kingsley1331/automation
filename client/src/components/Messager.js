import React, { useState, useEffect } from "react";
import axios from "axios";
import List from "./Navigation";
import "./Messager.css";

function Messager({ endpoint }) {
  const [message, setMessage] = useState("");
  const [threadId, setThreadId] = useState("");
  const [userInput, setUserInput] = useState(
    "How many faces does an icosahedron have?"
  );
  // what is the shape of each face?
  useEffect(() => {
    axios
      .get(`http://localhost:3001${endpoint}`)
      .then((res) => res)
      .then(({ data }) => {
        console.log(data);
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
        userInput: { message: userInput, threadId },
      })
      .then((res) => res)
      .then(({ data }) => {
        console.log(data);
        if (data.threadId) {
          console.log("data.threadId", data.threadId);
          setThreadId(data.threadId);
        }
        return setMessage(data.message);
      });
  };

  return (
    <>
      <List />
      <div className="chatBox">
        <p>ChatGPT: {message}</p>
        <div className="inputWrapper">
          <textarea
            type="text"
            onChange={handleUserInput}
            value={userInput}
            placeholder="Ask me anything"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </>
  );
}

export default Messager;
