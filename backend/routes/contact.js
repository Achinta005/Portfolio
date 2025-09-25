const express=require('express')
const router=express.Router()
const pool=require('../config/connectSql');

router.post('/',async(req,res)=>{
    try {
        const { name, email,subject,message } = req.body;

        const [result]=await pool.execute(`INSERT INTO contact_info(name,email,subject,message,created_at) VALUES(?,?,?,?,NOW())`,[name,email,subject,message])
    
        res.status(200).json({ message: "Form submitted successfully!" });
      } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
      }
})
module.exports=router