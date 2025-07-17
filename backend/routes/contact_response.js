const express=require('express')
const router=express.Router()
const contactModel=require('../models/contact')

router.get("/", async (req, res) => {
  try {
    const contacts = await contactModel.find();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});
module.exports=router