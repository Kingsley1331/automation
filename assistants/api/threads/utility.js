import fs from "fs";
import "dotenv/config";

export const getAssistant = (assistant_Id) => {
  const file = JSON.parse(fs.readFileSync("database/assistants.json", "utf8"));

  const assistant = file.filter(
    ({ assistantId }) => assistantId === assistant_Id
  )[0];

  return assistant;
};

export const getOtherAssistants = (assistant_Id) => {
  const file = JSON.parse(fs.readFileSync("database/assistants.json", "utf8"));

  const assistants = file.filter(
    ({ assistantId }) => assistantId !== assistant_Id
  );

  return assistants;
};
