import api from '../axiosConfig';

export const chatAPI = {
  getUserChats: async (accessToken) => {
    return api.get('/v1/chats', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  },

  createChat: async (receiverId, accessToken) => {
    return api.post('/v1/chats', { receiverId }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  },

  getChatMessages: async (chatId, accessToken) => {
    return api.get(`/v1/chats/${chatId}/messages`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  },

  sendMessage: async (chatId, content, accessToken) => {
    return api.post(`/v1/chats/${chatId}/messages`, { content }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  }
};