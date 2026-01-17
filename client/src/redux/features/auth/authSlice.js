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
  const res = await api.post('/v1/auth/login', credentials, {
    withCredentials: true,
  });
  return res.data;
});


export const refresh = createAsyncThunk('auth/refresh', async () => {
  const res = await api.post('/v1/auth/refresh', null, {
    withCredentials: true,
  });
  return res.data;
});


export const logoutUser = createAsyncThunk('auth/logout', async () => {
    await api.get('/v1/auth/logout', {
      withCredentials: true,
    });
});


export const fetchCurrentUser = createAsyncThunk(
    'auth/fetchCurrentUser',
    async (token) => {
      const res = await api.get('/v1/auth/me', {
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
      state.user = null;
      state.status = 'idle';
    //   localStorage.removeItem('refreshToken');
    },
    updateProfilePic: (state, action) => {
      if (state.user) {
        state.user.profileImage = action.payload;
      }
    },
    cleanError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(login.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(login.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.accessToken = action.payload.accessToken;
      state.error = null;
    })
    .addCase(login.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    })
    .addCase(refresh.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(refresh.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.accessToken = action.payload.accessToken;
      state.error = null;
    })
    .addCase(refresh.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    })
    .addCase(logoutUser.fulfilled, (state) => {
      state.accessToken = null;
      state.user = null;
      state.status = 'idle';
    })
    .addCase(fetchCurrentUser.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.user = action.payload;
      state.error = null;
    })
    .addCase(fetchCurrentUser.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
  }
})

export const { logout, updateProfilePic } = authSlice.actions;
export default authSlice.reducer;