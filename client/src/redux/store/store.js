import { configureStore} from '@reduxjs/toolkit';
import authModalReducer from '../features/auth/authModalsSlice.js';
import slotsReducer from "../features/slots/slotMachineSlice.js";
import rouletteReducer from "../features/roulette/rouletteSlice.js";
import authReducer from "../features/auth/authSlice.js";
import chatReducer from '../features/chat/chatSlice.js';
import socketReducer from '../features/socket/socketSlice.js';
import aiChatbotReducer from '../features/aiChatbot/aiChatbotSlice.js';
import { setupInterceptors } from '../../axiosConfig.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    authModals: authModalReducer,
    slotMachine: slotsReducer,
    roulette: rouletteReducer,
    socket: socketReducer,
    chat: chatReducer,
    aiChatbot: aiChatbotReducer,
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['socket/initialize/fulfilled'],
      ignoredPaths: ['socket.socket'],
    },
  }),
});

setupInterceptors(store);
