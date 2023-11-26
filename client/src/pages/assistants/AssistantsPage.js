import React, { useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import Navigation from "../../components/Navigation";
import { useContext } from "react";
import { Context } from "../../App";

function MathsTeacher() {
  const {
    assistants: { assistantList, setAssistantList },
  } = useContext(Context);

  // const [assistantIds, setAssistantIds] = useState([]); // [1, 2, 3, 4, 5]

  useEffect(() => {
    axios
      .get(`http://localhost:3001/assistants`)
      .then((res) => res)
      .then(({ data }) => {
        console.log("get Assistant IDs ==>", data);
        return setAssistantList(data.assistantIds);
      });
  }, [setAssistantList]);

  return (
    <div>
      <Navigation />
      {assistantList.map((assist) => {
        return (
          <ul key={assist.id}>
            <li>
              <NavLink to={`/assistant/${assist.id}`}>
                <p>Assistant Name: {assist.name}</p>
              </NavLink>
            </li>
          </ul>
        );
      })}
    </div>
  );
}

export default MathsTeacher;
