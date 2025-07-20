const express = require("express");
const router = express.Router();
const projectModel = require("../models/projectModel");
const multer = require("multer");
const path = require("path");
const cloudinary = require("../config/Cloudinary");
const { Readable } = require("stream");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      category,
      title,
      technologies,
      liveUrl,
      githubUrl,
      description,
      order,
    } = req.body;

    // Convert buffer to readable stream
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image",
         folder: 'Uploaded_Images',
       },
      async (error, result) => {
        if (error) return res.status(500).json({ error: error.message });

        const imageUrl = result.secure_url;

        const newProject = new projectModel({
          category,
          title,
          technologies: technologies?.split(",") || [],
          liveUrl,
          githubUrl,
          image: imageUrl,
          description,
          order,
        });

        await newProject.save();
        res.status(200).json({ message: "Uploaded", project: newProject });
      }
    );

    // Stream file buffer to cloudinary
    Readable.from(req.file.buffer).pipe(stream);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
