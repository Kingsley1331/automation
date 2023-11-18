import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/chatbots/chat/message")
      .then((res) => res)
      .then(({ data }) => {
        console.log(data);
        return setMessage(data.message);
      });
  }, []);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/chatbots/chat/message", { userInput })
      .then((res) => res)
      .then(({ data }) => {
        console.log(data);
        return setMessage(data.message);
      });
  };

  return (
    <div className="App">
      <p>{message}</p>
      <input type="text" onChange={handleUserInput} value={userInput} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
