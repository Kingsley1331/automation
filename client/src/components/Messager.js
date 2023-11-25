import React from "react";
import Navigation from "./Navigation";
import "./Messager.css";

function Messager({
  message,
  handleUserInput,
  sendMessage,
  userInput,
  messages,
  name,
}) {
  return (
    <div>
      Assistant Name: {name}
      <div className="chatBox">
        <p>
          <strong>ChatGPT</strong>: {message}
        </p>
        {messages?.length &&
          messages.map((message) => {
            return (
              <p key={message.id}>
                <strong>{message.name}</strong>: {message.content}
              </p>
            );
          })}
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
    </div>
  );
}

export default Messager;
