const express=require('express')
const app=express()
const port = process.env.PORT||3001;  //Server Local Port Number
const mongoose=require('mongoose')
const bodyparser=require('body-parser')
require('dotenv').config()
const cors = require('cors');

const health=require('./routes/health')
const contact=require('./routes/contact')
const upload=require('./routes/upload')
const projects=require('./routes/projects')
const contactResponse=require('./routes/contact_response')
const resume=require('./routes/resume')
const authRoutes = require('./routes/auth');
const connectDB=require('./config/db')

//CORS POLICY

const allowedOrigins = [
  'http://localhost:3000',
  'https://achintahazra.shop',
  'https://www.achintahazra.shop',
  'https://portfolio-achinta-hazras-projects.vercel.app',
  'https://portfolio-git-main-achinta-hazras-projects.vercel.app',
  'https://portfolio-sooty-xi-67.vercel.app',
];

const dynamicCors = cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('CORS Not Allowed'));
    }
  },
  credentials: true, // or false if your GET does not use cookies
});

app.use(dynamicCors);


//JSON Body Parser
app.use(bodyparser.json())
app.use(express.json());

//Static File Hosting
app.use('/uploads', express.static('uploads'));

//Routes
app.use('/health',health)
app.use('/contact',contact)
app.use('/upload',upload)
app.use('/projects',projects)
app.use('/contact_response',contactResponse)
app.use('/download/resume',resume)
app.use('/api/auth', authRoutes);


//connect to MongoDB
connectDB();


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
