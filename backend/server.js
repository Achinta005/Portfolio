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
const adminRoutes = require('./routes/admin');

//CORS POLICY
app.use(cors({
  origin: ['http://localhost:3000', 'https://achintahazra.shop', 'https://portfolio-frontend-dtcj.onrender.com'],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
}));

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
app.use('/api/admin', adminRoutes);


//connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB CONNECTED"))
.catch(err=>console.log(err))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
