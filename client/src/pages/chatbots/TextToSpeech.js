import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../../components/Navigation";

function Chatbot({ endpoint }) {
  const [messages, setMessages] = useState("");
  const [audio, setAudio] = useState();
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
    setAudio(audio);
    audio.play();
  };

  // useEffect(() => {
  //   playAudio();
  // }, []);

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
            <button onClick={playAudio}>replay</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chatbot;
