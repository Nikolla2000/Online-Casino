const Chat = require("../models/Chat.model");

const setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected to chat: ${socket.id} ${socket.userId}`);

        socket.on('join_user_room', (userId) => {
            socket.join(`user_${userId}`);
            console.log(`User ${socket.id} joined personal room: user_${userId}`);
        });

        socket.on('join_chat', async (chatId) => {
            try {
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
              
              // Намиране или създаване на чат
              let chat;
              if (chatId) {
                chat = await Chat.findById(chatId);
              } else {
                // Създаване на нов чат
                chat = new Chat({
                  participants: [socket.userId, receiverId]
                });
                await chat.save();
              }
      
              // Запазване на съобщението
              const message = new Message({
                chatId: chat._id,
                senderId: socket.userId,
                content: content.trim()
              });
              await message.save();
      
              // Актуализиране на последното съобщение в чата
              chat.lastMessage = message._id;
              chat.lastActivity = new Date();
              await chat.save();
      
              // Изпращане на съобщението до получателя
              const messageData = {
                _id: message._id,
                chatId: chat._id,
                senderId: socket.userId,
                content: message.content,
                createdAt: message.createdAt,
                read: false
              };
      
              // Изпращане до получателя
              socket.to(`user_${receiverId}`).emit('private_message', messageData);
              
              // Изпращане обратно до изпращача (за confirmation)
              socket.emit('private_message_sent', messageData);
      
              // Актуализиране на последната активност за всички участници
              io.to(`chat_${chat._id}`).emit('chat_updated', {
                chatId: chat._id,
                lastMessage: messageData,
                lastActivity: chat.lastActivity
              });
      
            } catch (error) {
              console.error('Error sending private message:', error);
              socket.emit('message_error', {
                error: 'Failed to send message'
              });
            }
          });
      
          // Typing indicators for private chat
          socket.on('typing_private', (data) => {
            const { chatId, receiverId, isTyping } = data;
            socket.to(`user_${receiverId}`).emit('user_typing_private', {
              chatId,
              userId: socket.userId,
              isTyping
            });
          });
      
          // Mark messages as read
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
      
              // Уведомяване на изпращача, че съобщенията са прочетени
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