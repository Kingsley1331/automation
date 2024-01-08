import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Threads.css";
import close from "./icons/close.png";
import NewChatIcon from "./icons/new-chat.js";

function Threads({ threads, getMessages, setThreads }) {
  const [selectedThread, setSelectedThread] = useState("");
  const { assistantId } = useParams();

  const startNewChat = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:3001/create_chat/${assistantId}`)
      .then((res) => res)
      .then(({ data }) => {
        const threadId = data.message.id;
        setThreads([...threads, threadId]);
        console.log("NEW THREAD ==>", data);
        getMessages(threadId);
        setSelectedThread(threadId);
      });
  };

  const deleteThread = (threadId) => {
    const deleteThread = window.confirm(
      "Are you sure you want to delete this thread?"
    );

    if (deleteThread) {
      console.log("delete thread");
      axios
        .delete(`http://localhost:3001/delete_chat/${assistantId}/${threadId}`)
        .then((res) => res)
        .then(({ data }) => {
          console.log("DELETE THREAD ==>", data);
          setThreads(threads.filter((thread) => thread !== threadId));
        });
    }
  };

  return (
    <div className="threads">
      <div className="new-chat" role="button" onClick={startNewChat}>
        <NewChatIcon />
      </div>
      <div className="message-threads">
        {threads &&
          threads.map((thread, index) => (
            <div className="thread-container">
              <div
                key={thread}
                className={`message-thread ${
                  thread && selectedThread === thread && "--selected"
                }`}
              >
                <div
                  className="thread"
                  role="button"
                  onClick={() => {
                    getMessages(thread);
                    setSelectedThread(thread);
                  }}
                >
                  <p>Chat {index + 1}</p>
                </div>
              </div>
              <div
                className="close-button"
                role="button"
                onClick={() => deleteThread(thread)}
              >
                <img width="10" src={close} alt="close" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Threads;
