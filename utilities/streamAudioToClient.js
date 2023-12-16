import fs from "fs";
// import { fileURLToPath } from "url";
import path from "path";

// Route to stream MP3
// const __dirname = path.dirname(fileURLToPath(import.meta.url));

const streamAudioToClient = (req, res, audioFilePath) => {
  const filePath = path.join(audioFilePath);
  //   const filePath = path.join(__dirname, audioFilePath);
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;
  console.log("range ==>", range);
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "audio/mp3",
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "audio/mp3",
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
};

export default streamAudioToClient;
