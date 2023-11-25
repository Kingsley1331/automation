import React from "react";
import axios from "axios";
import "./Threads.css";
import { useParams } from "react-router-dom";

function Threads({ threads, getMessages }) {
  const { assistantId } = useParams();

  const startNewChat = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:3001/create_chat/${assistantId}`)
      .then((res) => res)
      .then(({ data }) => {
        console.log("NEW THREAD ==>", data);
      });
  };

  return (
    <div className="threads">
      <h1>Threads</h1>
      <div className="message-threads">
        {threads &&
          threads.map((thread) => (
            <div key={thread} className="message-thread">
              <p>{thread.substr(0, 8)}</p>
              <button onClick={() => getMessages(thread)}>Resume chat</button>
            </div>
          ))}
        <br></br>
        <button onClick={startNewChat}>Start new chat</button>
      </div>
    </div>
  );
}

export default Threads;
