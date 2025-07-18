const express=require('express')
const router=express.Router()
const projectModel = require('../models/projectModel');


router.get("/", async (req, res) => {
  try {
    const projects = await projectModel.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

module.exports=router