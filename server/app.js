require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

//connectDB
const connectDB = require("./db/connect");

//Port
const port = process.env.PORT || 3000;

//cors
app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
}));

//routers
const userRouter = require('./routes/User.router')

//middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("./public"));
app.use(express.json());

//routes
app.use('/server/v1/user', userRouter);


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
