import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Messager from "../../components/Messager";
import { useParams } from "react-router-dom";
import { Context } from "../../App";

function Assistant({ endpoint }) {
  const [message, setMessage] = useState("");
  const [threadId, setThreadId] = useState("");
  const [thread, setThread] = useState([]);
  const [assistantId, setAssistantId] = useState("");
  const [assistant, setAssistant] = useState("");
  const [userInput, setUserInput] = useState(
    "How many faces does an icosahedron have?"
  );

  const {
    assistants: { assistantList },
  } = useContext(Context);

  const { id } = useParams();
  console.log("assistantList", assistantList);
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
  console.log("thread", thread);
  console.log("messages", convertThreadToMessages(thread, assistantList));

  useEffect(() => {
    axios
      .get(`http://localhost:3001${endpoint}`)
      .then((res) => res)
      .then(({ data }) => {
        console.log("get data ==>", data);
        if (data?.messages) {
          setThread(data.messages?.data.reverse()); // do this on the server
        }
        // return setMessage(data.message);
      });
  }, [endpoint, id]);

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
        // console.log("post data ==>", data);
        setThread(data.messages.reverse()); // do this on the server
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
        messages={convertThreadToMessages(thread, assistantList)}
      />
    </div>
  );
}

export default Assistant;
