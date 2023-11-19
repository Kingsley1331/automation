import React, { useState, useEffect } from "react";
import axios from "axios";
import Messager from "../../components/Messager";

function MathsTeacher({ endpoint }) {
  const [message, setMessage] = useState("");
  const [threadId, setThreadId] = useState("");
  const [assistantId, setAssistantId] = useState("");
  const [assistantList, setAssistantList] = useState([]);
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
        setAssistantList(data.assistantList);
        if (data.assistantList.length) {
          setAssistantId(data.assistantList[0].id);
        }
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
      Assistant ID: {assistantId}
      <Messager
        message={message}
        handleUserInput={handleUserInput}
        sendMessage={sendMessage}
        userInput={userInput}
      />
    </div>
  );
}

export default MathsTeacher;
