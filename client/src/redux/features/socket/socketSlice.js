import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import io from 'socket.io-client';

const apiURL = import.meta.env.VITE_ENV !== 'production' 
  ? import.meta.env.VITE_LOCAL_SERVER_URL 
  : import.meta.env.VITE_PRODUCTION_SERVER_URL;

export const initializeSocket = createAsyncThunk(
  'socket/initialize',
  async (_, { getState }) => {
    const state = getState();
    const { accessToken, user } = state.auth;
    
    if (!accessToken || !user) {
      throw new Error('No user authenticated');
    }

    const socket = io(apiURL, {
      auth: {
        token: accessToken,
        user: {
          id: user._id,
          username: user.username,
          firstName: user.firstName
        }
      },
      transports: ['websocket', 'polling']
    });

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Socket connection timeout'));
      }, 5000);

      socket.on('connect', () => {
        clearTimeout(timeout);
        resolve(socket);
      });

      socket.on('connect_error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }
);

const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    socket: null,
    isConnected: false,
    loading: false,
    error: null
  },
  reducers: {
    disconnectSocket: (state) => {
      if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
        state.isConnected = false;
        state.error = null;
      }
    },
    setSocketConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    clearSocketError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeSocket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeSocket.fulfilled, (state, action) => {
        state.loading = false;
        state.socket = action.payload;
        state.isConnected = true;
        state.error = null;
      })
      .addCase(initializeSocket.rejected, (state, action) => {
        state.loading = false;
        state.isConnected = false;
        state.error = action.error.message;
      });
  }
});

export const { disconnectSocket, setSocketConnected, clearSocketError } = socketSlice.actions;
export default socketSlice.reducer;