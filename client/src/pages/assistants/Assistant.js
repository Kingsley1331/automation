import React, { useState, useEffect } from "react";
import axios from "axios";
import Messager from "../../components/Messager";
import { useParams } from "react-router-dom";

function Assistant({ endpoint }) {
  const [message, setMessage] = useState("");
  const [threadId, setThreadId] = useState("");
  const [assistantId, setAssistantId] = useState("");
  const [assistant, setAssistant] = useState("");
  const [userInput, setUserInput] = useState(
    "How many faces does an icosahedron have?"
  );

  const { id } = useParams();
  console.log("id", id);
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

  useEffect(() => {
    axios
      .get(`http://localhost:3001/assistant/${id}`)
      .then((res) => res)
      .then(({ data }) => {
        console.log("get assistant ==>", data);
        setAssistant(data?.assistant);
        setAssistantId(data?.assistant?.id);
      });
  }, [id]);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:3001${endpoint}`, {
        userInput: { message: userInput, threadId, assistantId },
      })
      .then((res) => res)
      .then(({ data }) => {
        console.log("post data ==>", data);
        if (data.threadId) {
          console.log("data.threadId", data.threadId);
          setThreadId(data.threadId);
        }
        return setMessage(data.message);
      });
  };

  return (
    <div>
      Assistant Name: {assistant.name}
      <Messager
        message={message}
        handleUserInput={handleUserInput}
        sendMessage={sendMessage}
        userInput={userInput}
      />
    </div>
  );
}

export default Assistant;
