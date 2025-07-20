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
  const { category,title,technologies,liveUrl,githubUrl,description,order } = req.body;
  const image = `/uploads/${req.file.filename}`;

  const newProject = new projectModel({ category,title,technologies,liveUrl,githubUrl,image,description,order });
  await newProject.save();

  res.status(200).json({ message: "Uploaded", project: newProject });
});

module.exports=router