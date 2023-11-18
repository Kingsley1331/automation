import React from "react";
import Navigation from "./Navigation";
import "./Messager.css";

function Messager({ message, handleUserInput, sendMessage, userInput }) {
  return (
    <>
      <Navigation />
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
