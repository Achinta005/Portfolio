const express=require('express')
const app=express()
const port = process.env.PORT||3000;
const mongoose=require('mongoose')
const bodyparser=require('body-parser')
const Project = require('./models/projectModel')
const Contact = require('./models/contactModel')
require('dotenv').config({
    path:process.env.NODE_ENV===
    'production'?'.env.production':'.env'
})

app.use(bodyparser.json())

//connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB CONNECTED"))
.catch(err=>console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
