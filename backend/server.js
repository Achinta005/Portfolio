const express = require("express");
const app = express();
const port = process.env.PORT || 3002;
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

const contact = require("./routes/contact");
const projects = require("./routes/project");
const about = require('./routes/about')
const blog = require('./routes/blog')
const admin = require('./routes/admin')
const adminIp = require('./routes/adminip')
const auth = require('./routes/authentication')
const Alist=require('./routes/animelist')

//CORS POLICY
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://achintahazra.shop",
      "https://www.achintahazra.shop",
      "https://portfolio-achinta-hazras-projects.vercel.app",
      "https://portfolio-git-main-achinta-hazras-projects.vercel.app",
      "https://portfolio-sooty-xi-67.vercel.app",
      'https://portfolio-91hnq85ho-achinta-hazras-projects.vercel.app',
      "https://appsy-ivory.vercel.app"
    ],
    methods: ["GET", "POST", "OPTIONS","DELETE","PUT"],
    credentials: true,
  })
);

app.get('/',(req,res)=>{
  res.send("hi this is Portfolio backend !")
})

//JSON Body Parser
app.use(bodyparser.json());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

//Routes
app.use("/contact", contact);
app.use("/project", projects);
app.use("/blog",blog)
app.use('/about',about)
app.use('/admin',admin)
app.use('/adminIp',adminIp)
app.use('/auth',auth)
app.use('/alist',Alist)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

