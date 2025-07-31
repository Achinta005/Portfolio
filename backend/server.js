const express = require("express");
const app = express();
const port = process.env.PORT || 3001; //Server Local Port Number
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

const health = require("./routes/health");
const contact = require("./routes/contact");
const upload = require("./routes/upload");
const projects = require("./routes/projects");
const contactResponse = require("./routes/contact_response");
const resume = require("./routes/resume");
const authRoutes = require("./routes/auth");
const connectDB = require("./config/db");

//CORS POLICY
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://achintahazra.shop",
      "https://www.achintahazra.shop",
      "https://portfolio-achinta-hazras-projects.vercel.app",
      "https://portfolio-git-main-achinta-hazras-projects.vercel.app",
      "https://portfolio-sooty-xi-67.vercel.app",
      'https://portfolio-91hnq85ho-achinta-hazras-projects.vercel.app'
    ],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

app.get('/',(req,res)=>{
  res.send("hi this is backend !")
})

//JSON Body Parser
app.use(bodyparser.json());
app.use(express.json());

//Static File Hosting
app.use("/uploads", express.static("uploads"));

//Routes
app.use("/health", health);
app.use("/contact", contact);
app.use("/upload", upload);
app.use("/projects", projects);
app.use("/contact_response", contactResponse);
app.use("/download/resume", resume);
app.use("/api/auth", authRoutes);

//connect to MongoDB
connectDB();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});