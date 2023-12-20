import fs from "fs";

const convertBufferToImage = (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  console.log("====================================>req.file", req.file);

  // Get the buffer from multer and the file extension
  const buffer = req.file.buffer;
  //   const originalname = req.file.originalname;
  //   const extension = originalname.split(".").pop();
  //   const filename = originalname.split(".")[0];

  // Specify the path to save the image
  const filePath = `uploads/imageFiles/${req.file.originalname}`;
  //   const filePath = `uploads/imageFiles/${filename}.${extension}`;

  // Write the buffer to a file
  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      return res.status(500).send("Error saving the file.");
    }
    // res.send("File uploaded and converted successfully.");
  });
};

export default convertBufferToImage;

export const convertBufferToBase64 = (req, res) => {
  if (!req.file) {
    return;
  }
  let _buffer = new Buffer.from(req.file.buffer, "base64");
  return _buffer.toString("base64");
};

export const convertImageToBase64 = (filename) => {
  // Create a base64 string from an image => ztso+Mfuej2mPmLQxgD ...
  const base64 = fs.readFileSync(`uploads/imageFiles/${filename}`, "base64");
  return base64;
};
