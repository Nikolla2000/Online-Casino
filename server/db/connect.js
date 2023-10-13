const mongoose = require("mongoose");
const mongoURL = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successful connection to database");
  } catch (err) {
    console.error(err);
    throw new Error("Database connection error");
  }
};

module.exports = connectDB;