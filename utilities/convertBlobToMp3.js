import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
// import fs from "fs";
// import path from "path";

ffmpeg.setFfmpegPath(ffmpegStatic);

const convertBlobToMp3 = (req, res) => {
  //  const directory = path.resolve("./uploads/audioFiles");
  const audioPath = req.file.path;
  const outputPath = "uploads/audioFiles/output.mp3";
  // ffmpeg converts audio blob to mp3
  ffmpeg(audioPath)
    .toFormat("mp3")
    .on("end", () => {
      console.log("Conversion finished.");
      res.send("File converted to MP3 successfully.");
    })
    .on("error", (err) => {
      console.error("Error:", err);
      res.status(500).send("Error converting file");
    })
    .saveToFile(outputPath);
};

export default convertBlobToMp3;
