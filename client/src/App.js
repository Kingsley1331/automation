import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import MathsTeacher from "./pages/assistants/mathsTeacher";
import Chatbot from "./pages/chatbots/chatbot";
import "./App.css";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigation />} />
      <Route
        path="/chatbots/chat/message"
        element={<Chatbot endpoint="/chatbots/chat/message" />}
      />
      <Route
        path="/assistants/mathsTeacher/message"
        element={<MathsTeacher endpoint="/assistants/mathsTeacher/message" />}
      />
    </Routes>
  );
};

export default App;
