// NavBar.js
import { NavLink } from "react-router-dom";
import "./Navigation.css";

const List = () => {
  return (
    <nav>
      <ul className="nav-bar">
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/chatbots/chat/message">Chatbot</NavLink>
        </li>
        <li>
          <NavLink to="/text-to-speech/message">Text To Speech</NavLink>
        </li>
        <li>
          <NavLink to="/assistants/message">Assistants</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default List;
