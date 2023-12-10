import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../../components/Navigation";
import {
  sendMessage,
  playAudio,
  startRecording,
  stopRecording,
  sendAudio,
  getTextFromAudio,
} from "../../utilities/audio";

function Chatbot({ endpoint }) {
  const [audioBlob, setAudioBlob] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [messages, setMessages] = useState("");
  const [disableRecord, setDisableRecord] = useState(false);
  const [userInput, setUserInput] = useState(
    "How many faces does an icosahedron have?"
  );

  console.log("endpoint", endpoint);
  // what is the shape of each face?
  useEffect(() => {
    axios
      .get(`http://localhost:3001${endpoint}`)
      .then((res) => res)
      .then(({ data }) => {
        console.log("get data ==>", data);
        // playAudio(); visit: https://developer.chrome.com/blog/autoplay/
        return setMessages(data.messages);
      });
  }, [endpoint]);

  useEffect(() => {
    if (audioBlob) {
      sendAudio(audioBlob, setUserInput);
      getTextFromAudio(setUserInput);
    }
  }, [audioBlob]);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  console.log("messages", messages);

  return (
    <>
      <Navigation />
      <div>
        <div className="chatBox">
          {messages?.length &&
            messages.map((message) => {
              return (
                <p key={message.id}>
                  <strong>{message.role}</strong> {message.content}
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
            <button
              onClick={(e) => {
                e.preventDefault();
                sendMessage(
                  userInput,
                  setUserInput,
                  `http://localhost:3001${endpoint}`,
                  messages,
                  setMessages
                );
              }}
            >
              Send
            </button>
            <button onClick={playAudio}>Replay</button>
          </div>
          <div>
            <button
              onClick={(e) => {
                e.preventDefault();
                startRecording(setAudioBlob, setDisableRecord, setRecorder);
              }}
              disabled={disableRecord}
            >
              Start Recording
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                stopRecording(recorder, setDisableRecord);
              }}
            >
              Stop Recording
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chatbot;
