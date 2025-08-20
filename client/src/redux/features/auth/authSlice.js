import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../axiosConfig';

// import axios from "axios";
// import { store } from "./redux/store/store";
// import { refresh } from "./redux/features/auth/authSlice";


// const instance = axios.create({
//   baseURL: import.meta.env.VITE_LOCAL_SERVER_URL, // local url
//   // baseURL: import.meta.env.VITE_PRODUCTION_SERVER_URL, // production server url
//   withCredentials: true,
// })



export const login = createAsyncThunk('auth/login', async (credentials) => {
  const res = await api.post('auth/login', credentials, {
    withCredentials: true,
  });
  return res.data;
});


export const refresh = createAsyncThunk('auth/refresh', async () => {
  const res = await api.post('/auth/refresh', null, {
    withCredentials: true,
  });
  return res.data;
});


export const logoutUser = createAsyncThunk('auth/logout', async () => {
    await api.get('/auth/logout', {
      withCredentials: true,
    });
});


export const fetchCurrentUser = createAsyncThunk(
    'auth/fetchCurrentUser',
    async (token) => {
      const res = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      return res.data;
    }
  );


const initialState = {
  accessToken: null,
  user: null,
  status: 'idle',
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.accessToken = null;
    //   localStorage.removeItem('refreshToken');
    },
    updateProfilePic: (state, action) => {
      if (state.user) {
        state.user.profileImage = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(login.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken;
    })
    .addCase(refresh.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken;
    })
    .addCase(logoutUser.fulfilled, (state) => {
        state.accessToken = null;
    })
    .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
    });
  }
})

export const { logout, updateProfilePic } = authSlice.actions;
export default authSlice.reducer;