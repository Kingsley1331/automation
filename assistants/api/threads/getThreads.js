import fs from "fs";

const getThreads = (assistant_id) => {
  const file = JSON.parse(fs.readFileSync("database/assistants.json", "utf8"));
  const threads = file
    .filter(({ assistantId }) => assistantId === assistant_id)
    .map(({ threadIds }) => threadIds)[0];
  return threads;
};

export default getThreads;
