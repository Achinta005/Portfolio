const express=require('express')
const app=express()
const port = process.env.PORT||3001;  //Server Local Port Number
const mongoose=require('mongoose')
const bodyparser=require('body-parser')
const Project = require('./models/projectModel')
const Contact = require('./models/contact')
require('dotenv').config()
const cors = require('cors');

app.use(bodyparser.json())

//connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB CONNECTED"))
.catch(err=>console.log(err))

app.use(cors());
app.get('/', (req, res) => {
  res.send('Hello World!')
  console.log("Frontend is Connected");
})

// In your Express backend (server.js or routes file)
app.get('/health', (req, res) => {
  res.status(200).send('Backend is alive');
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post('/contact',async(req,res)=>{
  try {
    const { name, email,subject,message } = req.body;

    const newEntry = new Contact({ name, email,subject,message });
    await newEntry.save();

    res.status(200).json({ message: "Form submitted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
})