import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../../components/Navigation";

function Chatbot({ endpoint }) {
  const [audioBlob, setAudioBlob] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [messages, setMessages] = useState("");
  const [disableRecord, setDisableRecord] = useState(false);
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
        // playAudio(); visit: https://developer.chrome.com/blog/autoplay/
        return setMessages(data.messages);
      });
  }, [endpoint]);

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:3001/speech`)
  //     .then((res) => res)
  //     .then(({ data }) => {
  //       console.log("get sound data ==>", typeof data);
  //       const blob = new Blob([data], { type: "audio/mp3" });
  //       return setAudio(blob);
  //     });
  // }, []);

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
        playAudio();
        return setMessages(data.messages);
      });
  };
  console.log("messages", messages);

  const playAudio = async () => {
    const { data } = await axios.get("http://localhost:3001/speech", {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "audio/mp3",
      },
    });
    const blob = new Blob([data], {
      type: "audio/mp3",
    });

    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const newRecorder = new MediaRecorder(stream);
    newRecorder.ondataavailable = (e) => {
      setAudioBlob(e.data);
      console.log("audioBlob", e.data);
    };
    newRecorder.start();
    setDisableRecord(true);
    setRecorder(newRecorder);
  };

  const stopRecording = () => {
    recorder.stop();
    setDisableRecord(false);
  };

  const sendAudio = () => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "audioFileName.mp3");
    console.log("formData", formData);
    fetch("http://localhost:3001/speech", {
      method: "POST",
      body: formData,
    });
    /**If you want play the recorded sound */
    // const url = URL.createObjectURL(audioBlob);
    // const audio = new Audio(url);
    // audio.play();
  };
  console.log("=========================>disableRecord", disableRecord);
  return (
    <>
      <Navigation />
      <div>
        <div className="chatBox">
          {messages?.length &&
            messages.map((message) => {
              return (
                <p key={message.id}>
                  <strong>{message.name}</strong> {message.message.content}
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
            <button onClick={playAudio}>Replay</button>
          </div>
          <div>
            <button onClick={startRecording} disabled={disableRecord}>
              Start Recording
            </button>
            <button onClick={stopRecording}>Stop Recording</button>
            <button onClick={sendAudio}>Send Audio</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chatbot;
