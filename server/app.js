require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

//connectDB
const connectDB = require("./db/connect");

//Port
const port = process.env.PORT || 3000;

//routers( example : const someRouter = require("./routes/some.router"))

app.use(express.static("./public"));
app.use(express.json());

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
