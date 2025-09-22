const { default: mongoose } = require("mongoose");
const Chat = require("../models/Chat.model");
const Message = require("../models/Message.model");

const setupSocket = (io) => {
    io.on('connection', (socket) => {
        const userId = socket.handshake.auth.userId;
        const userData = socket.handshake.auth.user;
        
        if (userId) {
          socket.userId = userId;
          socket.userData = userData;
          console.log(`User connected: ${socket.id}, User ID: ${socket.userId}`);
        }

        socket.on('join_user_room', (userId) => {
            socket.join(`user_${userId}`);
            console.log(`User ${socket.id} joined personal room: user_${userId}`);
        });

        socket.on('join_chat', async (chatId) => {
            try {
              if(chatId.startsWith('temp_')) {
                console.log('Temporary chat detected, skipping database lookup');
                socket.join(`chat_${chatId}`);
                return;
              }
                const chat = await Chat.findById(chatId).populate('participants');
                if (chat && chat.participants.some((p) => p._id.toString() === socket.userId)) {
                    socket.join(`chat_${chatId}`);
                    console.log(`User ${socket.userId} joined chat: ${chatId}`);
                }

                await Message.updateMany(
                    {
                        chatId,
                        senderId: { $ne: socket.userId },
                        read: false
                    },
                    {
                        read: true,
                        readAt: new Date()
                    }
                )
                
            } catch (err) {
                console.error('Error joining chat:', err);
            }
        });


        socket.on('private_message', async (data) => {
          try {
            const { receiverId, content, chatId } = data;
            console.log("data:", data);
            
            let chat;

          //   if (!mongoose.Types.ObjectId.isValid(socket.userId) || 
          //   !mongoose.Types.ObjectId.isValid(receiverId)) {
          // throw new Error('Invalid user IDs');
          // }
            
            if (chatId && chatId.startsWith('temp_')) {
              chat = new Chat({
                participants: [new mongoose.Types.ObjectId(socket.userId), 
                               new mongoose.Types.ObjectId(receiverId)]
              });
              await chat.save();
              await chat.populate('participants', 'username email profileImage');
              
              socket.emit('chat_created', {
                tempChatId: chatId,
                realChatId: chat._id
              });
              socket.to(`user_${receiverId}`).emit('chat_created', {
                tempChatId: chatId,
                realChatId: chat._id
              });
            } else {
              chat = await Chat.findById(chatId);
              if (!chat) {
                return socket.emit('message_error', { error: 'Chat not found' });
              }
            }
            
            if (!chat || !socket.userId || !chat.participants.some((p) => p._id.toString() === socket.userId)) {
              console.log("PAK VLIZA")
              return socket.emit('message_error', { error: 'Access denied' });
            }
            const message = new Message({
              chatId: chat._id,
              senderId: socket.userId,
              content: content.trim()
            });
            await message.save();
        
            chat.lastMessage = message._id;
            chat.lastActivity = new Date();
            await chat.save();
        
            const messageData = {
              _id: message._id,
              chatId: chat._id,
              senderId: socket.userId,
              content: message.content,
              createdAt: message.createdAt,
              read: false
            };
        
            io.to(`chat_${chat._id}`).emit('private_message', messageData);
        
          } catch (error) {
            console.error('Error sending private message:', error);
            socket.emit('message_error', { error: 'Failed to send message' });
          }
        });
      
          socket.on('typing_private', (data) => {
            const { chatId, receiverId, isTyping } = data;
            socket.to(`user_${receiverId}`).emit('user_typing_private', {
              chatId,
              userId: socket.userId,
              isTyping
            });
          });
      
          socket.on('mark_as_read', async (data) => {
            try {
              const { chatId, messageIds } = data;
              
              await Message.updateMany(
                { 
                  _id: { $in: messageIds },
                  senderId: { $ne: socket.userId },
                  read: false 
                },
                { 
                  read: true, 
                  readAt: new Date() 
                }
              );
      
              const messages = await Message.find({ _id: { $in: messageIds } });
              const senderIds = [...new Set(messages.map(m => m.senderId.toString()))];
              
              senderIds.forEach(senderId => {
                io.to(`user_${senderId}`).emit('messages_read', {
                  chatId,
                  messageIds,
                  readAt: new Date()
                });
              });
      
            } catch (error) {
              console.error('Error marking messages as read:', error);
            }
          });
      
          socket.on('disconnect', () => {
            console.log('User disconnected from chat:', socket.id);
          });
        });
      };

      module.exports = setupSocket;