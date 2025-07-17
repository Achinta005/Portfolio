const express=require('express')
const router=express.Router()
const Contact = require('../models/contact')

router.post('/',async(req,res)=>{
    try {
        const { name, email,subject,message } = req.body;
    
        const newEntry = new Contact({ name, email,subject,message });
        await newEntry.save();
    
        res.status(200).json({ message: "Form submitted successfully!" });
      } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
      }
})
module.exports=router