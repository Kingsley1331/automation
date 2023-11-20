// NavBar.js
import { NavLink } from "react-router-dom";

const List = () => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/chatbots/chat/message">Chatbot</NavLink>
        </li>
        <li>
          <NavLink to="/assistants/message">Assistants</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default List;
