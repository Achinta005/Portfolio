const express = require("express");
const app = express();
const port = process.env.PORT || 3001; 
const bodyparser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

//Routes Import
const health = require("./routes/health");
const authRoutes = require("./routes/auth");

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
      'https://portfolio-91hnq85ho-achinta-hazras-projects.vercel.app',
      "https://deploy-ten-orcin.vercel.app"
    ],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

app.get('/',(req,res)=>{
  res.json("✅Coonection Successfull With Server...");
  console.log("Client Connected...")
})

//JSON Body Parser
app.use(bodyparser.json());
app.use(express.json());

//Static File Hosting
app.use("/uploads", express.static("uploads"));

//Routes
app.use("/health", health);
app.use("/api/auth", authRoutes);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});