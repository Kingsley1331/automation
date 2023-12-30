import axios from "axios";

export const sendMessage = (
  payload,
  setUserInput,
  type,
  // apiEndpoint,
  setMessages,
  isSoundOn
) => {
  axios
    .post(`http://localhost:3001/message/${type}`, {
      payload,
    })
    // .post(apiEndpoint, {
    //   payload,
    // })
    .then((res) => res)
    .then(({ data }) => {
      console.log("post data ==>", data);
      if (isSoundOn) {
        playAudio();
      }
      setUserInput("");
      if (data?.messages) {
        return setMessages(data.messages);
      }
    });
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
  //.addEventListener('playing',function() { myfunction(); },false)
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

export const sendAudio = (audioBlob, setUserInput) => {
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
