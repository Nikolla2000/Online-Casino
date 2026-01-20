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
const { AppError, errorHandler } = require("./middleware/errorHandler");
const logger = require('./helpers/logger');
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

const connectDB = require("./db/connect");

const port = process.env.PORT || 3000;

//CORS
app.use(cors({
  origin: 'http://localhost:5173',  //for local development, comment for production
  // origin: 'https://uzu-online-casino.netlify.app', // uncomment for production
  methods: 'GET,POST,PUT,PATCH,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
}));

// Logger middleware
// app.use((req, res, next) => {
//   logger.info('Incoming request', {
//     method: req.method,
//     url: req.originalUrl,
//     ip: req.ip,
//     userAgent: req.get('user-agent')
//   });
//   next();
// });

//Routers
const userRouter = require('./routes/v1/User.router');
const authRouter = require('./routes/v1/Auth.router');
const emailRouter = require('./routes/v1/Email.router');
const chatRouter = require('./routes/v1/Chat.router');
const chatBotRouter = require('./routes/v1/ChatBot.router');
const gameRouter = require('./routes/v1/Game.router');
const userRouterV2 = require('./routes/v2/User.routerV2');

//Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("./public"));
app.use(express.json());

//routes
//V1 routes
app.use('/server/v1/user', userRouter);
app.use('/server/v1/auth', authRouter);
app.use('/server/v1/email', emailRouter);
app.use('/server/v1/chats', chatRouter);
app.use('/server/v1/chatbot', chatBotRouter);
app.use('/server/v1/game', gameRouter);

//V2 routes
app.use('/server/v2/users', userRouterV2);

//Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// app.use(helmet());
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 min
//   max: 100 // limit each IP to 100 requests per 15 min 
// });

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 401));
});

app.use(errorHandler);

process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', {
    name: err.name,
    message: err.message,
    stack: err.stack
  });
  
  server.close(() => {
    process.exit(1);
  });
});

// Uncaught Exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', {
    name: err.name,
    message: err.message,
    stack: err.stack
  });
  
  process.exit(1);
});

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
