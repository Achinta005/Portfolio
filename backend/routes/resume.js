const express = require("express");
const path = require("path");
const router=express.Router()

const filePath = path.join(__dirname, "..", "files", "resume.pdf");

router.get("/", (req, res) => {
  res.download(filePath, "Achinta_Resume.pdf", (err) => {
    if (err) {
      console.error("File download error:", err);
      res.status(500).send("Download failed");
    }
  });
});

module.exports=router