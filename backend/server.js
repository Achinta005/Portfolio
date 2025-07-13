const express=require('express')
const app=express()
const port = process.env.PORT||3000;
const mongoose=require('mongoose')
const bodyparser=require('body-parser')
const Project = require('./models/projectModel')
const Contact = require('./models/contactModel')
require('dotenv').config()
const cors = require('cors');

app.use(bodyparser.json())

//connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB CONNECTED"))
.catch(err=>console.log(err))

app.use(cors({
  origin: 'https://portfolio-frontend-dtcj.onrender.com'  //-->For Hosting comment out this line
  // origin: 'http://localhost:3001'                         //-->And comment in this line
}));
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
