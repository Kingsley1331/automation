import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import Navigation from "../../components/Navigation";

function MathsTeacher() {
  const [assistantIds, setAssistantIds] = useState([]); // [1, 2, 3, 4, 5]

  useEffect(() => {
    axios
      .get(`http://localhost:3001/assistants`)
      .then((res) => res)
      .then(({ data }) => {
        console.log("get Assistant IDs ==>", data);
        return setAssistantIds(data.assistantIds);
      });
  }, []);

  console.log("assistantIds", assistantIds);
  return (
    <div>
      <Navigation />
      {assistantIds.map((assist) => {
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
