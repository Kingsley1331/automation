import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  startRecording,
  stopRecording,
  sendAudio,
  getTextFromAudio,
  playAudio,
  sendMessage,
} from "../utilities/audio";
import "./Messager.css";

function Messager({
  handleUserInput,
  sendMessageFn,
  userInput,
  setUserInput,
  messages,
  name,
}) {
  const [recordButtonText, setRecordButtonText] = useState("Start Recording");
  const [recorder, setRecorder] = useState(null);
  const [disableRecord, setDisableRecord] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  // const [imageUrl, setImageUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // const handleImageUpload = (event) => {
  //   setImageUrl(URL.createObjectURL(event.target.files[0]));
  // };

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  //   const reader = new FileReader();

  //   reader.onloadend = () => {
  //     setImageUrl(reader.result);
  //   };

  //   reader.readAsDataURL(file);
  // };

  // const handleSubmit = async () => {
  //   try {
  //     await axios.post("http://localhost:3001/vision/message", { imageUrl });
  //     console.log("Image uploaded successfully");
  //   } catch (error) {
  //     console.error("Error uploading the image", error);
  //   }
  // };
  console.log("selectedFile", selectedFile);
  const uploadFile = async () => {
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch("http://localhost:3001/vision/message", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSelectedFile("");
        console.log("File successfully uploaded");
      } else {
        console.log("Upload failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (audioBlob) {
      sendAudio(audioBlob, setUserInput);
      getTextFromAudio(setUserInput);
    }
  }, [audioBlob, setUserInput]);

  console.log("===============>userInput", userInput);

  return (
    <div>
      Assistant Name: {name}
      <div className="chatBox">
        {messages?.length &&
          messages.map((message) => {
            const { content } = message;
            return (
              <>
                <p key={message.id}>
                  <strong>{message.name || message.role}</strong>:{" "}
                  {typeof content === "string" ? content : content[0].text}
                </p>

                {content[0]?.metadata && (
                  <img width="300" src={content[0]?.metadata} alt="vision" />
                )}
                {/* {content[1]?.image_url?.url && (
                  <img
                    width="300"
                    src={content[1]?.image_url?.url}
                    alt="vision"
                  />
                )} */}
              </>
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
            onClick={async () => {
              await uploadFile();
              sendMessageFn(sendMessage, selectedFile?.name);
              // sendMessageFn(sendMessage, imageUrl, setImageUrl);
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
              if (!disableRecord) {
                startRecording(setAudioBlob, setDisableRecord, setRecorder);
                setRecordButtonText("Stop Recording");
              } else {
                stopRecording(recorder, setDisableRecord);
                setRecordButtonText("Start Recording");
              }
            }}
          >
            {recordButtonText}
          </button>
          {/* <div>
            <input type="file" onChange={handleImageChange} />
            <button onClick={handleSubmit}>Upload</button>
          </div> */}
          <div>
            <input type="file" onChange={handleFileInput} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messager;
