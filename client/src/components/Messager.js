import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import {
  startRecording,
  stopRecording,
  sendAudio,
  getTextFromAudio,
  playAudio,
  sendMessage,
  getAudioFromText,
} from "../utilities/audio";
import "./Messager.css";
import UploadIcon from "./icons/upload.js";
import Microphone from "./icons/microphone.js";
import SendIcon from "./icons/send.js";
import SoundOnIcon from "./icons/sound-on.js";
import SoundOffIcon from "./icons/sound-off.js";
import Clipboard from "./icons/clipboard.js";
import close from "./icons/close.png";
import MarkdownRenderer from "../tools/MarkdownRenderer";
import hljs from "highlight.js";
// import hljs from "highlight.js/lib/core";
// import javascript from "highlight.js/lib/languages/javascript";
// import css from "highlight.js/lib/languages/css";
import "highlight.js/styles/github.css";
import "highlight.js/styles/felipec.css";

// import "highlight.js/styles/night-owl.css";
// import "highlight.js/styles/default.css";

// import javascript from "highlight.js/lib/languages/javascript";
// import xml from "highlight.js/lib/languages/xml";
// import css from "highlight.js/lib/languages/css";

// hljs.registerLanguage("javascript", javascript);
// hljs.registerLanguage("css", css);
// hljs.registerLanguage("xml", xml);

// get the list of all highlight code blocks

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
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // const handleImageUpload = (event) => {
  //   setImageUrl(URL.createObjectURL(event.target.files[0]));
  // };

  const copyToClipboard = (e) => {
    // e.preventDefault();
    const element =
      e.target.parentElement.parentElement.parentElement.parentElement.querySelectorAll(
        "code"
      )[0];
    console.log("element", element);
    if (!element) {
      return;
    }
    const text = element.innerText;

    console.log(text);

    navigator.clipboard
      .writeText(text)
      .then(() => {
        // You can add some notification code here to alert the user that text has been copied
        console.log("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  useEffect(() => {
    hljs.highlightAll();

    const languages = document.querySelectorAll("code");
    console.log(
      "==========================================languages",
      languages
    );

    const highlights = document.querySelectorAll("pre");

    // highlights.forEach((div) => {
    //   // create the copy button
    //   const copy = document.createElement("button");
    //   copy.innerHTML = "Copy";
    //   // add the event listener to each click
    //   // copy.addEventListener("click", handleCopyClick)
    //   // append the copy button to each code block
    //   div.appendChild(copy);
    // });

    highlights.forEach((div) => {
      const sendIconContainer = document.createElement("div");

      const shouldAddCopyButton = document.querySelectorAll(
        ".clipboard-icon-container"
      );

      // if (shouldAddCopyButton.length) {
      //   return;
      // }

      console.log("shouldAddCopyButton", shouldAddCopyButton.length);
      sendIconContainer.className = "clipboard-icon-container";

      const lang = div
        .querySelectorAll("code")[0]
        .className.split(" ")
        .map((a) => a)
        .map((b) => b.match(/language-.*/))
        .filter((c) => c)
        .map((d) => d[0].split("language-")[1])
        .join(", ");

      console.log("language", lang);

      ReactDOM.render(
        <Clipboard
          language={lang}
          className="clipboard-icon"
          copyToClipboard={copyToClipboard}
        />,
        sendIconContainer
      );
      sendIconContainer.prepend(<p>TESTTEST</p>);
      div.prepend(sendIconContainer);
      // div.append(sendIconContainer);
    });
  });

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

  console.log("isAudioPlaying", isAudioPlaying);

  return (
    <div className="message-wrapper">
      <h3 className="title">Assistant Name: {name}</h3>
      <div className="chatBox">
        {!!messages?.length &&
          messages.map((message) => {
            if (message.role === "system") return null;
            const { content } = message;
            return (
              <div className="message-container">
                <div className="message-wrapper">
                  <div key={message.id}>
                    <MarkdownRenderer
                      content={`**${message.name || message.role}**: 
                      ${
                        typeof content === "string" ? content : content[0].text
                      }`}
                    />
                  </div>
                  {content[0]?.metadata && (
                    <img width="300" src={content[0]?.metadata} alt="vision" />
                  )}
                </div>
                {message.role === "assistant" && (
                  <div
                    onClick={async () => {
                      if (!isAudioPlaying) {
                        setIsAudioPlaying(true);
                        await getAudioFromText(
                          typeof content === "string"
                            ? content
                            : content[0].text,
                          () => setIsAudioPlaying(false)
                        );
                      }
                    }}
                    role="button"
                    className={`sound_small ${
                      (!isSoundOn || isAudioPlaying) && "--opaque"
                    }`}
                  >
                    <SoundOnIcon size={12} />
                  </div>
                )}
              </div>
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
              sendMessageFn(sendMessage, selectedFile?.name, isSoundOn); // TODO: is there a better way to do this? without passing in the selectedFile.name and isSoundOn?
              setImageUrl(null);
              setSelectedFile(null);
            }}
          >
            <SendIcon opacity={userInput ? 1 : 0.4} />
          </div>

          <div
            onClick={() => setIsSoundOn((state) => !state)}
            className="sound"
            role="button"
          >
            {isSoundOn ? <SoundOnIcon /> : <SoundOffIcon />}
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
