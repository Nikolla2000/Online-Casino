require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
// const helmet = require("helmet");
// const rateLimit = require('express-rate-limit');
const path = require('path')
const { Server, Socket } = require('socket.io');
const { createServer } = require('node:http');
const app = express();
const server = createServer(app);
const setupSocket = require("./socket/socket");
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// const setupChatSocket = (io) => {
//   io.on('connection', (socket) => {
//     console.log(`new user connected: ${socket.id}`);

//     socket.on('join_chat_room', (roomId) => {
//       socket.join(roomId);
//       console.log(`User ${socket.id} joined room ${roomId}`);
//     });

//     socket.on('send_message', (data) => {
//       console.log(`Message received: ${data}`);

//       io.emit('receive_message', {
//         ...data,
//         timestamp: new Date(),
//         messageId: Date.now() + Math.random().toString(36).substr(2, 9)
//       })
//     });

//     socket.on('typing_start', (userData) => {
//       socket.broadcast.emit('user_typing', {
//         ...userData,
//         isTyping: true
//       });
//     });

//     socket.on('typing_stop', (userData) => {
//       socket.broadcast.emit('user_typing', {
//         ...userData,
//         isTyping: false
//       });
//     });

//     socket.on('disconnect', () => {
//       console.log('User disconnected from chat:', socket.id);
//     });
//   })

// }

setupSocket(io);

//connectDB
const connectDB = require("./db/connect");

//Port
const port = process.env.PORT || 3000;

//cors
app.use(cors({
  origin: 'http://localhost:5173',  //for local development, comment for production
  // origin: 'https://uzu-online-casino.netlify.app', // uncomment for production
  methods: 'GET,POST,PUT,PATCH,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
}));

//routers
const userRouter = require('./routes/User.router');
const slotRouter = require('./routes/Slot.router');
const authRouter = require('./routes/Auth.router');
const emailRouter = require('./routes/Email.router');
const chatRouter = require('./routes/Chat.router');
const chatBotRouter = require('./routes/ChatBot.router');

//middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("./public"));
app.use(express.json());

//routes
app.use('/server/v1/user', userRouter);
app.use('/server/v1/auth', authRouter);
app.use('/server/v1/slots', slotRouter);
app.use('/server/v1/email', emailRouter);
app.use('/server/v1/chats', chatRouter);
app.use('/server/v1/chatbot', chatBotRouter);

//Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// app.use(helmet());
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 min
//   max: 100 // limit each IP to 100 requests per 15 min 
// });


const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    server.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
