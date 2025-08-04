import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../../../axiosConfig";


export const login = createAsyncThunk('auth/login', async (credentials) => {
  const res = await axios.post('auth/login', credentials, {
    withCredentials: true,
  });
  return res.data;
});


export const refresh = createAsyncThunk('auth/refresh', async () => {
  const res = await axios.post('/auth/refresh', null, {
    withCredentials: true,
  });
  return res.data;
});


export const logoutUser = createAsyncThunk('auth/logout', async () => {
    await axios.get('/auth/logout', {
      withCredentials: true,
    });
});


const initialState = {
  accessToken: null,
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
  }
})

export const { logout } = authSlice.actions;
export default authSlice.reducer;