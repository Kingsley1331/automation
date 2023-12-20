import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import fs from "fs";
import path from "path";
import speechToText from "../chatbots/speechToText.js";

ffmpeg.setFfmpegPath(ffmpegStatic);

const isDirectory = (source) => fs.lstatSync(source).isDirectory();

const convertBlobToMp3 = (req, res) => {
  const directory = "uploads/";
  const audioPath = req.file.path;
  const outputPath = "uploads/audioFiles/output.mp3";
  // ffmpeg converts audio blob to mp3
  ffmpeg(audioPath)
    .toFormat("mp3")
    .on("end", async () => {
      console.log("Conversion finished.");
      // res.send("File converted to MP3 successfully.");
      const textFromAudio = await speechToText();
      res.json({ textFromAudio });

      fs.readdir(directory, (err, files) => {
        console.log("files", files);
        if (err) {
          throw err;
        }
        for (const file of files) {
          if (!isDirectory(path.join(directory, file))) {
            fs.unlink(path.join(directory, file), (err) => {
              if (err) throw err;
            });
          }
        }
      });
    })
    .on("error", (err) => {
      console.error("Error:", err);
      res.status(500).send("Error converting file");
    })
    .saveToFile(outputPath);
};

export default convertBlobToMp3;

export const convertBlobToImage = (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // Get the buffer from multer and the file extension
  const buffer = req.file.buffer;
  const extension = req.file.originalname.split(".").pop();

  // Specify the path to save the image
  const filePath = `uploads/imageFiles/${req.file.filename}.${extension}`;

  // Write the buffer to a file
  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      return res.status(500).send("Error saving the file.");
    }
    // res.send("File uploaded and converted successfully.");
  });
};
