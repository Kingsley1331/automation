import { Routes, Route } from "react-router-dom";
import Messager from "./components/Messager";
import Navigation from "./components/Navigation";
import "./App.css";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigation />} />
      <Route
        path="/chatbots/chat/message"
        element={<Messager endpoint="/chatbots/chat/message" />}
      />
      <Route
        path="/assistants/mathsTeacher/message"
        element={<Messager endpoint="/assistants/mathsTeacher/message" />}
      />
    </Routes>
  );
};

export default App;
