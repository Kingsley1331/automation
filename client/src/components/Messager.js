import React from "react";
import Navigation from "./Navigation";
import "./Messager.css";

function Messager({
  message,
  handleUserInput,
  sendMessage,
  userInput,
  thread,
}) {
  return (
    <>
      <Navigation />
      <div className="chatBox">
        <p>
          <strong>ChatGPT</strong>: {message}
        </p>
        {thread?.length &&
          thread.map((message) => {
            return (
              <p key={message.id}>
                <strong>{message.role}</strong>: {message.content[0].text.value}
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
    </>
  );
}

export default Messager;
