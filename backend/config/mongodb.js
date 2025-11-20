const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

let isConnected = false;

const connectMongoDB = async () => {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URL);

  isConnected = true;
  console.log("MongoDB connected");
};

module.exports = connectMongoDB;