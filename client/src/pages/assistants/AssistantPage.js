import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Messager from "../../components/Messager";
import { useParams } from "react-router-dom";
import { Context } from "../../App";

function Assistant({ endpoint }) {
  const [message, setMessage] = useState("");
  const [threadId, setThreadId] = useState("");
  const [thread, setThread] = useState([]);
  const [assistant, setAssistant] = useState("");
  const [assistantList, setAssistantList] = useState("");
  const [userInput, setUserInput] = useState(
    "How many vertices does an icosahedron have?"
  );

  const { assistants } = useContext(Context);

  const { assistantId } = useParams();
  console.log("assistantList", assistants.assistantList);
  // what is the shape of each face?

  const convertThreadToMessages = (thread, assistants) => {
    const messages = thread.map((message) => {
      let name = assistants.filter((assistant) => {
        return assistant.id === message.assistant_id;
      })[0]?.name;

      if (!name && message.role === "assistant") {
        name = "Assistant";
      }

      return {
        id: message.id,
        content: message.content[0].text.value,
        role: message.role,
        name: name ? name : "User",
      };
    });
    return messages;
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3001${endpoint}`)
      .then((res) => res)
      .then(({ data }) => {
        console.log("get data ==>", data);
        if (data?.messages) {
          setThread(data.messages?.data?.reverse()); // do this on the server
        }
        if (assistants.assistantList.length) {
          setAssistantList(assistants.assistantList);
        } else {
          setAssistantList(data?.assistantList);
        }
        // return setMessage(data.message);
      });
  }, [assistants.assistantList, endpoint]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/assistant/${assistantId}`)
      .then((res) => res)
      .then(({ data }) => {
        console.log("get assistant ==>", data);
        setAssistant(data?.assistant);
        // setAssistantId(data?.assistant?.id);
      });
  }, [assistantId]);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:3001${endpoint}`, {
        userInput: { message: userInput, threadId, assistantId },
        // userInput: { message: userInput, threadId, assistantId },
      })
      .then((res) => res)
      .then(({ data }) => {
        // console.log("post data ==>", data);
        setThread(data?.messages?.reverse()); // do this on the server
        if (data.threadId) {
          console.log("data.threadId", data.threadId);
          setThreadId(data.threadId);
        }
        return setMessage(data.message);
      });
  };

  return (
    <div>
      <Messager
        message={message}
        name={assistant.name}
        handleUserInput={handleUserInput}
        sendMessage={sendMessage}
        userInput={userInput}
        messages={convertThreadToMessages(thread, assistantList)}
      />
    </div>
  );
}

export default Assistant;
