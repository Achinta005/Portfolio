const express=require('express')
const router=express.Router()
const projectModel = require('../models/projectModel');
const multer = require("multer");
const path = require("path");

//Multer Config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });


router.post("/", upload.single("image"), async (req, res) => {
  const { title,technologies,liveUrl,githubUrl,description } = req.body;
  const image = `/uploads/${req.file.filename}`;

  const newProject = new projectModel({ title,technologies,liveUrl,githubUrl,image,description });
  await newProject.save();

  res.status(200).json({ message: "Uploaded", project: newProject });
});

module.exports=router