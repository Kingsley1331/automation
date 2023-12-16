import React, { useState, useEffect } from "react";
import {
  startRecording,
  stopRecording,
  sendAudio,
  getTextFromAudio,
  playAudio,
  sendMessage,
} from "../utilities/audio";
import "./Messager.css";

function Messager({
  handleUserInput,
  sendMessageFn,
  userInput,
  setUserInput,
  messages,
  name,
}) {
  const [recordButtonText, setRecordButtonText] = useState("Start Recording");
  const [recorder, setRecorder] = useState(null);
  const [disableRecord, setDisableRecord] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  useEffect(() => {
    if (audioBlob) {
      sendAudio(audioBlob, setUserInput);
      getTextFromAudio(setUserInput);
    }
  }, [audioBlob, setUserInput]);

  console.log("===============>userInput", userInput);
  return (
    <div>
      Assistant Name: {name}
      <div className="chatBox">
        {messages?.length &&
          messages.map((message) => {
            return (
              <p key={message.id}>
                <strong>{message.name || message.role}</strong>:{" "}
                {message.content}
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
          <button onClick={() => sendMessageFn(sendMessage)}>Send</button>
          <button onClick={playAudio}>Replay</button>
        </div>

        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (!disableRecord) {
                startRecording(setAudioBlob, setDisableRecord, setRecorder);
                setRecordButtonText("Stop Recording");
              } else {
                stopRecording(recorder, setDisableRecord);
                setRecordButtonText("Start Recording");
              }
            }}
          >
            {recordButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Messager;
