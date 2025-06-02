const mongoose = require("mongoose");
require("dotenv").config();

const connect=async()=> {
  const DBurl = process.env.MONGO_URL;
  try {
      await mongoose.connect(DBurl);
      console.log("MondoDB connect successfully");
  } catch (error) {
    console.error("MongoDB connection faile",error.message);
    process.exit(1);
  }
}
module.exports = connect;