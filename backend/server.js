const express=require('express')
const app=express()
const port = process.env.PORT||3001;  //Server Local Port Number
const mongoose=require('mongoose')
const bodyparser=require('body-parser')
const Contact = require('./models/contact')
require('dotenv').config()
const cors = require('cors');
const projectModel = require('./models/projectModel');
const multer = require("multer");
const path = require("path");

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

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

app.use('/uploads', express.static('uploads'));

app.post("/upload", upload.single("image"), async (req, res) => {
  const { title,technologies,liveUrl,githubUrl } = req.body;
  const image = `/uploads/${req.file.filename}`;

  const newProject = new projectModel({ title,technologies,liveUrl,githubUrl,image });
  await newProject.save();

  res.status(200).json({ message: "Uploaded", project: newProject });
});






app.get("/projects", async (req, res) => {
  try {
    const projects = await projectModel.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});
