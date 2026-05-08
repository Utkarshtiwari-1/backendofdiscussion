// utils/r2Uploader.js
require("dotenv").config();

const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const path = require("path");
const fs = require("fs");

// ==============================
// R2 CLIENT CONFIG
// ==============================

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// ==============================
// UPLOAD FUNCTION
// ==============================

const uploadToR2 = async (file, folder = "uploads") => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    console.log("Uploading file:", file);

    // file extension
    const fileExt = path.extname(file.name);

    // unique filename
    const fileName = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}${fileExt}`;

    // upload command
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,

      Key: fileName,

      // IMPORTANT FIX
      Body: fs.createReadStream(file.tempFilePath),

      ContentType: file.mimetype,
    });

    // upload
    await r2.send(command);

    // public URL
    const fileUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

    return {
      success: true,
      url: fileUrl,
      key: fileName,
    };
  } catch (error) {
    console.error("R2 Upload Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};

// ==============================
// DELETE FUNCTION
// ==============================

const deleteFromR2 = async (key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });

    await r2.send(command);

    return {
      success: true,
    };
  } catch (error) {
    console.error("R2 Delete Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};

module.exports = {
  uploadToR2,
  deleteFromR2,
};