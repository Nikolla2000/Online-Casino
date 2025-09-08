import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setActiveChat, 
  addMessage, 
  markMessagesAsRead 
} from '../../redux/features/chat/chatSlice';
import { useSocket } from "../../hooks/useSocket";
import './LiveChatStyles.scss';
import { denormalizeDates } from '../../utils/normalizeDates';

const LiveChatModal = () => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);
  
  const dispatch = useDispatch();
  const { messages } = useSelector(state => state.chat);
  const { user: currentUser } = useSelector(state => state.auth);
  const { socket, isConnected, emit, on, off } = useSocket();

  const activeChat = useSelector(state => 
    state.chat.activeChat ? denormalizeDates(state.chat.activeChat) : null
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat]);

  useEffect(() => {
    if (socket && isConnected && activeChat) {
      emit('join_chat', activeChat._id);

      const handleNewMessage = (messageData) => {
        if (messageData.chatId === activeChat._id) {
          dispatch(addMessage({
            chatId: activeChat._id,
            message: messageData
          }));
        }
      };

      const handleTyping = (data) => {
        console.log('User typing:', data);
      };

      on('private_message', handleNewMessage);
      on('user_typing_private', handleTyping);

      return () => {
        off('private_message', handleNewMessage);
        off('user_typing_private', handleTyping);
      };
    }
  }, [socket, isConnected, activeChat, dispatch, on, off]);

  const handleSendMessage = () => {
    if (messageInput.trim() && isConnected && activeChat) {
      const otherParticipant = getOtherParticipant();
      
      if (otherParticipant) {
        emit('private_message', {
          receiverId: otherParticipant._id,
          content: messageInput.trim(),
          chatId: activeChat._id
        });

        dispatch(addMessage({
          chatId: activeChat._id,
          message: {
            _id: Date.now().toString(),
            senderId: currentUser._id,
            content: messageInput.trim(),
            timestamp: new Date(),
            isOptimistic: true
          }
        }));

        setMessageInput('');
      }
    }
  };

  const handleCloseModal = () => {
    dispatch(setActiveChat(null));
  };

  const getOtherParticipant = () => {
    if (!activeChat || !activeChat.participants) return null;
    return activeChat.participants.find(p => p._id !== currentUser._id);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  if (!activeChat) return null;

  const otherParticipant = getOtherParticipant();
  const currentMessages = messages[activeChat._id] || [];

  return (
    <div className="livechat-modal-wrapper">
      <div className="chat-header">
        <div className="chat-user-info">
          <div className="user-avatar">
            {/* {otherParticipant?.profileImage ? (
              <img 
                src={otherParticipant.profileImage} 
                alt={otherParticipant.username}
              />
            ) : (
              <div className="avatar-placeholder">
                {otherParticipant?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            )} */}
          </div>
          <div className="user-details">
            <h3>{otherParticipant?.username || 'Unknown User'}</h3>
            <span className="user-status">
              {isConnected ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
        <button className="close-btn" onClick={handleCloseModal}>
          ✕
        </button>
      </div>

      <div className="chat-messages">
        {currentMessages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet</p>
            <span>Start a conversation with {otherParticipant?.username}</span>
          </div>
        ) : (
          currentMessages.map((msg) => (
            <div
              key={msg._id}
              className={`message ${msg.senderId === currentUser._id ? 'own-message' : 'other-message'}`}
            >
              <div className="message-content">
                <p>{msg.content}</p>
                <span className="message-time">
                  {formatTime(msg.timestamp)}
                  {msg.isOptimistic && ' • Sending...'}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input-container">
        <div className="input-wrapper">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={!isConnected}
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || !isConnected}
            className="send-button"
          >
            {isConnected ? 'Send' : 'Connecting...'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChatModal;