import axios from "axios";

export const sendMessage = async (
  payload,
  setUserInput,
  type,
  setMessages,
  isSoundOn
) => {
  const res = await axios.post(`http://localhost:3001/message/${type}`, {
    payload,
  });

  const { data } = res;
  console.log("post data ==>", data);
  if (isSoundOn) {
    playAudio();
  }
  setUserInput("");
  if (data?.messages) {
    setMessages(data.messages);
  }
};

export const sendMessage2 = (
  payload,
  setUserInput,
  type,
  setMessages,
  isSoundOn,
  setLoadingResponse,
  chatBox
) => {
  console.log("=====================>payload", payload);
  fetch(`http://localhost:3001/message/${type}`, {
    method: "POST",
    body: JSON.stringify({ payload }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      setUserInput("");
      const reader = response.body.getReader();
      return new ReadableStream({
        async start(controller) {
          let textChunk = "";
          setLoadingResponse(false);
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
            // Process chunk here
            textChunk += new TextDecoder().decode(value);
            console.count("textChunk");
            setMessages([
              ...payload,
              {
                role: "assistant",
                content: [{ type: "text", text: textChunk }],
              },
            ]);
            chatBox.current.scrollTop = chatBox.current.scrollHeight;
            chatBox.current?.scrollIntoView({
              behavior: "smooth",
              block: "end",
            });
          }

          controller.close();
          reader.releaseLock();
        },
      });
    })
    .then((stream) => new Response(stream))
    .then((response) => response.text())
    .then((text) => {
      console.log("text", text);
      if (isSoundOn) {
        // getAudioFromText(text);
        playAudio();
      }
    })
    .catch((err) => console.error(err));
};

export const playAudio = async (callback) => {
  const { data } = await axios.get("http://localhost:3001/speech", {
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "audio/mp3",
    },
  });
  const blob = new Blob([data], {
    type: "audio/mp3",
  });

  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.play();
  audio.onended = () => {
    console.log("audio ended");
    if (callback) {
      callback();
    }
  };

  console.log("audio", audio);
};

export const getTextFromAudio = async (setUserInput) => {
  const { data } = await axios.get("http://localhost:3001/text-from-audio");
  console.log("data", data);
  return data.textFromAudio;
};

export const getAudioFromText = async (text, callback) => {
  await axios.post("http://localhost:3001/text-to-audio", {
    text,
  });
  playAudio(callback);
};

export const startRecording = async (
  setAudioBlob,
  setDisableRecord,
  setRecorder
) => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const newRecorder = new MediaRecorder(stream);
  newRecorder.ondataavailable = (e) => {
    setAudioBlob(e.data);
    console.log("audioBlob", e.data);
  };
  newRecorder.start();
  setDisableRecord(true);
  setRecorder(newRecorder);
};

export const stopRecording = (
  recorder,
  setDisableRecord,
  audioBlob,
  setUserInput
) => {
  recorder.stop();
  setDisableRecord(false);
};

export const sendAudio = async (audioBlob, setUserInput) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "audioFileName.mp3");
  axios.post("http://localhost:3001/speech", formData).then((res) => {
    console.log("res", res);
    setUserInput(res.data.textFromAudio);
  });
  /**If you want play the recorded sound */
  // const url = URL.createObjectURL(audioBlob);
  // const audio = new Audio(url);
  // audio.play();
};
