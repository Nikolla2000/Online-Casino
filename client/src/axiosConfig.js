import axios from "axios";
import { store } from "./redux/store/store";
import { refresh } from "./redux/features/auth/authSlice";


const instance = axios.create({
  baseURL: import.meta.env.VITE_LOCAL_SERVER_URL, // local url
  // baseURL: import.meta.env.VITE_PRODUCTION_SERVER_URL, // production server url
  withCredentials: true,
})

instance.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const result = await store.dispatch(refresh());
      if (result.payload?.accessToken) {
        originalRequest.headers['Authorization'] = `Bearer ${result.payload.accessToken}`;
        return instance(originalRequest);
      }
    }
    return Promise.reject(err);
  }
);


export default instance