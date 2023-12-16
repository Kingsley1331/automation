import React, { createContext, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import MathsTeacher from "./pages/assistants/AssistantsPage";
import Chatbot from "./pages/chatbots/Chatbot";
import TextToSpeech from "./pages/chatbots/TextToSpeech";
import "./App.css";
import Assistant from "./pages/assistants/AssistantPage";

export const Context = createContext(null);

const App = () => {
  const [assistantList, setAssistantList] = useState([]);
  return (
    <Context.Provider
      value={{ assistants: { assistantList, setAssistantList } }}
    >
      <Routes>
        <Route path="/" element={<Navigation />} />
        <Route
          path="/chatbots/chat/message"
          element={<Chatbot endpoint="/chatbots/chat/message" />}
        />
        <Route
          path="/text-to-speech/message"
          element={<TextToSpeech endpoint="/text-to-speech/message" />}
        />
        <Route
          path="/assistants/message"
          element={<MathsTeacher endpoint="/assistants/message" />}
        />
        <Route
          path="/assistant/:assistantId"
          element={<Assistant endpoint="/assistants/message" />}
        />
      </Routes>
    </Context.Provider>
  );
};

export default App;
