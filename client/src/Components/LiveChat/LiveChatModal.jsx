import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setActiveChat, 
  addMessage, 
  markMessagesAsRead, 
  fetchChatMessages
} from '../../redux/features/chat/chatSlice';
import { useSocket } from "../../../context/SocketContext";
import './LiveChatStyles.scss';

const apiURL = import.meta.env.VITE_ENV !== 'production' 
  ? import.meta.env.VITE_LOCAL_SERVER_URL 
  : import.meta.env.VITE_PRODUCTION_SERVER_URL;

const LiveChatModal = () => {
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const messagesEndRef = useRef(null);
  
  const dispatch = useDispatch();
  const { activeChat, messages } = useSelector(state => state.chat);
  const { user: currentUser } = useSelector(state => state.auth);
  const { socket, isConnected, emit, on, off } = useSocket();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat]);

  useEffect(() => {
    if (activeChat && !activeChat.isTemp) {
      dispatch(fetchChatMessages(activeChat._id));
    }
  }, [activeChat, dispatch]);

  useEffect(() => {
    if (!socket || !activeChat) return;

    emit('join_chat', activeChat._id);

    const handleNewMessage = (messageData) => {
      if (messageData.chatId === activeChat._id) {
        const normalizedMessage = {
          ...messageData,
          timestamp: messageData.timestamp ? 
            (typeof messageData.timestamp === 'string' ? 
             messageData.timestamp : 
             new Date(messageData.timestamp).toISOString()) : 
            new Date().toISOString()
        };
  
        dispatch(addMessage({
          chatId: activeChat._id,
          message: normalizedMessage
        }));
      }
    };

    const handleTyping = (data) => {
      if (data.chatId === activeChat._id && data.userId !== currentUser._id) {
        setIsTyping(data.isTyping);
        setTypingUser(data.isTyping ? data.username : '');
        
        if (data.isTyping) {
          setTimeout(() => {
            setIsTyping(false);
            setTypingUser('');
          }, 3000);
        }
      }
    };

    const handleMessagesRead = (data) => {
      if (data.chatId === activeChat._id) {
        dispatch(markMessagesAsRead(data));
      }
    };

    on('private_message', handleNewMessage);
    on('user_typing_private', handleTyping);
    on('messages_read', handleMessagesRead);

    // Cleanup
    return () => {
      off('private_message', handleNewMessage);
      off('user_typing_private', handleTyping);
      off('messages_read', handleMessagesRead);
    };
  }, [socket, activeChat, currentUser, dispatch, emit, on, off]);


  useEffect(() => {
    if (!socket) return;
  
    const handleChatCreated = (data) => {
      if (data.tempChatId === activeChat?._id) {
        dispatch(setActiveChat({
          ...activeChat,
          _id: data.realChatId,
          isTemp: false
        }));
      }
      console.log(activeChat);
    };
  
    on('chat_created', handleChatCreated);
  
    return () => {
      off('chat_created', handleChatCreated);
    };
  }, [socket, activeChat, dispatch, on, off]);


  const handleSendMessage = () => {
    if (messageInput.trim() && isConnected && activeChat) {
      const otherParticipant = getOtherParticipant();
      
      if (otherParticipant) {
        emit('private_message', {
          receiverId: otherParticipant._id,
          content: messageInput.trim(),
          chatId: activeChat._id
        });
  
        const tempMessage = {
          _id: `temp_${Date.now()}`,
          senderId: currentUser._id,
          content: messageInput.trim(),
          timestamp: new Date().toISOString(),
          isOptimistic: true
        };
  
        dispatch(addMessage({
          chatId: activeChat._id,
          message: tempMessage
        }));
  
        setMessageInput('');
        
        emit('typing_private', {
          chatId: activeChat._id,
          receiverId: otherParticipant._id,
          isTyping: false
        });
      }
    }
  };

  const handleTypingChange = (text) => {
    setMessageInput(text);
    
    if (activeChat) {
      const otherParticipant = getOtherParticipant();
      if (otherParticipant) {
        emit('typing_private', {
          chatId: activeChat._id,
          receiverId: otherParticipant._id,
          isTyping: text.length > 0
        });
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

  console.log("messages: ", messages)

  return (
    <div className="livechat-modal-wrapper">
      <div className="chat-header">
        <div className="chat-user-info">
          <div className="user-avatar">
            {otherParticipant?.profileImage ? (
              <img 
                src={new URL(`${otherParticipant.profileImage}`, apiURL).href} 
                alt={otherParticipant.username}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="avatar-placeholder">
              {otherParticipant?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className={`status-indicator ${isConnected ? 'online' : 'offline'}`}></div>
          </div>
          <div className="user-details">
            <h3>{otherParticipant?.username || 'Unknown User'}</h3>
            <span className="user-status">
              {isConnected ? 'Online' : 'Offline'}
              {isTyping && typingUser && ` • ${typingUser} is typing...`}
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
            <div className="empty-icon">💬</div>
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
                  {msg.read && ' • Read'}
                </span>
              </div>
            </div>
          ))
        )}
        
        {isTyping && typingUser && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>{typingUser} is typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input-container">
        <div className="input-wrapper">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => handleTypingChange(e.target.value)}
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