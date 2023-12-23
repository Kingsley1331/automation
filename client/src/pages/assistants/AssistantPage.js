import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Messager from "../../components/Messager";
import { useParams } from "react-router-dom";
import { Context } from "../../App";
import Threads from "../../components/Threads";
import Navigation from "../../components/Navigation";
import "./AssistantPage.css";

function Assistant({ endpoint }) {
  const [selectedThread, setSelectedThread] = useState("");
  const [threads, setThreads] = useState([]);
  const [thread, setThread] = useState([]);
  const [assistant, setAssistant] = useState("");
  const [assistantList, setAssistantList] = useState("");
  const [userInput, setUserInput] = useState("");
  const [showChatBox, setShowChatBox] = useState(false);

  const { assistants } = useContext(Context);

  const { assistantId } = useParams();

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

  const getMessages = async (threadId) => {
    setSelectedThread(threadId);
    setShowChatBox(true);
    axios
      .get(`http://localhost:3001${endpoint}/${threadId}`)
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
      });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3001/assistant/${assistantId}`)
      .then((res) => res)
      .then(({ data }) => {
        console.log("get assistant ==>", data);
        setAssistant(data?.assistant);
      });
  }, [assistantId]);

  useEffect(() => {
    axios.get(`http://localhost:3001/threads/${assistantId}`).then((res) => {
      const { data: threads } = res;
      if (threads) {
        setThreads(threads.threads);
      }
    });
  }, [assistantId]);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessageFn = (callback) =>
    callback(
      { message: userInput, assistantId },
      setUserInput,
      `http://localhost:3001${endpoint}/${selectedThread}`,
      setThread
    );

  return (
    <>
      <Navigation />
      <div className="messages-wrapper">
        <div className="messages-container">
          <Threads
            threads={threads}
            getMessages={getMessages}
            setThreads={setThreads}
          />
          {threads.length && showChatBox && (
            <Messager
              name={assistant.name}
              handleUserInput={handleUserInput}
              sendMessageFn={sendMessageFn}
              userInput={userInput}
              setUserInput={setUserInput}
              messages={convertThreadToMessages(thread, assistantList)}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Assistant;
