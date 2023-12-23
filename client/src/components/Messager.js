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
import UploadIcon from "./icons/upload.js";
import Microphone from "./icons/microphone.js";
import Send from "./icons/send.js";
import close from "./icons/close.png";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

function Messager({
  handleUserInput,
  sendMessageFn,
  userInput,
  setUserInput,
  messages,
  name,
}) {
  const [recorder, setRecorder] = useState(null);
  const [disableRecord, setDisableRecord] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // const handleImageUpload = (event) => {
  //   setImageUrl(URL.createObjectURL(event.target.files[0]));
  // };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    console.log("============================>file", file);
    setSelectedFile(file);
    if (!file) {
      setImageUrl(null);
      setSelectedFile(null);
      return;
    }
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageUrl(reader.result);
    };

    reader.readAsDataURL(file);
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
    <div className="message-wrapper">
      <h3 className="title">Assistant Name: {name}</h3>
      <div className="chatBox">
        {!!messages?.length &&
          messages.map((message) => {
            if (message.role === "system") return null;
            const { content } = message;
            return (
              <>
                <div key={message.id}>
                  <ReactMarkdown remarkPlugins={[gfm]}>
                    {`**${message.name || message.role}**: 
                      ${
                        typeof content === "string" ? content : content[0].text
                      }`}
                  </ReactMarkdown>
                </div>
                {content[0]?.metadata && (
                  <img width="300" src={content[0]?.metadata} alt="vision" />
                )}
              </>
            );
          })}
      </div>
      <div className="fixed">
        <div className="inputWrapper">
          <textarea
            type="text"
            onChange={handleUserInput}
            value={userInput}
            placeholder="Ask me anything"
          />
          <div
            className={`send ${!userInput && "--inactive"}`}
            role="button"
            onClick={async () => {
              await uploadFile();
              if (!userInput) return;
              sendMessageFn(sendMessage, selectedFile?.name);
              setImageUrl(null);
              setSelectedFile(null);
            }}
          >
            <Send opacity={userInput ? 1 : 0.4} />
          </div>
          {/* <button onClick={playAudio}>Replay</button> */}
        </div>

        <div className="icons">
          <div
            className="microphone"
            role="button"
            disabled
            onClick={(e) => {
              e.preventDefault();
              if (!disableRecord) {
                console.log("RECORDING");
                startRecording(setAudioBlob, setDisableRecord, setRecorder);
              } else {
                stopRecording(recorder, setDisableRecord);
              }
            }}
          >
            {disableRecord ? <div className="recording" /> : <Microphone />}
          </div>

          <div class="file-input">
            <input
              type="file"
              id="file"
              class="file"
              onChange={handleFileInput}
            />
            <label for="file">
              <UploadIcon role="button" />
            </label>
            {imageUrl && (
              <div className="preview">
                <img height="100" src={imageUrl} alt="preview"></img>
                <div
                  className="close"
                  role="button"
                  onClick={() => {
                    setImageUrl(null);
                    setSelectedFile(null);
                  }}
                >
                  <img width="20" src={close} alt="close"></img>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messager;
