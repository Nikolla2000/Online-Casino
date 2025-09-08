import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatAPI } from '../../../lib/chatApi';

export const fetchUserChats = createAsyncThunk(
  'chat/fetchUserChats',
  async (_, { getState }) => {
    const { accessToken } = getState().auth;
    const response = await chatAPI.getUserChats(accessToken);
    return response.data;
  }
);

export const createChat = createAsyncThunk(
  'chat/createChat',
  async (receiverId, { getState }) => {
    const { accessToken } = getState().auth;
    const response = await chatAPI.createChat(receiverId, accessToken);
    return response.data;
  }
);

export const fetchChatMessages = createAsyncThunk(
  'chat/fetchChatMessages',
  async (chatId, { getState }) => {
    const { accessToken } = getState().auth;
    const response = await chatAPI.getChatMessages(chatId, accessToken);
    return response.data;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: [],
    activeChat: null,
    messages: {},
    loading: false,
    error: null
  },
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(message);
    },
    updateChatLastMessage: (state, action) => {
      const { chatId, lastMessage } = action.payload;
      const chat = state.chats.find(c => c._id === chatId);
      if (chat) {
        chat.lastMessage = lastMessage;
        chat.lastActivity = new Date().toISOString();
      }
    },
    markMessagesAsRead: (state, action) => {
      const { chatId, messageIds } = action.payload;
      if (state.messages[chatId]) {
        state.messages[chatId] = state.messages[chatId].map(msg =>
          messageIds.includes(msg._id) ? { ...msg, read: true } : msg
        );
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserChats.fulfilled, (state, action) => {
        state.chats = action.payload;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        const { chatId, messages } = action.payload;
        state.messages[chatId] = messages;
      });
  }
});

export const { 
  setActiveChat, 
  addMessage, 
  updateChatLastMessage, 
  markMessagesAsRead 
} = chatSlice.actions;
export default chatSlice.reducer;