import axios from "axios";
// import { store } from "./redux/store/store";
import { refresh } from "./redux/features/auth/authSlice";


const api = axios.create({
  baseURL: import.meta.env.VITE_LOCAL_SERVER_URL, // local url
  // baseURL: import.meta.env.VITE_PRODUCTION_SERVER_URL, // production server url
  withCredentials: true,
})

export const setupInterceptors = (store) => {
  api.interceptors.request.use((config) => {
    const token = store.getState().auth.accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;

      //to not retry refresh request and enter infinite loop
      if (originalRequest.url.includes('v1/auth/refresh')) {
        return Promise.reject(err);
      }

      if (err.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const result = await store.dispatch(refresh());
        if (result.payload?.accessToken) {
          originalRequest.headers['Authorization'] = `Bearer ${result.payload.accessToken}`;
          return api(originalRequest);
        }
      }
      return Promise.reject(err);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const res = await store.dispatch(refresh());
          if (refresh.fulfilled.match(res)) {
            const newAccessToken = res.payload.accessToken;
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        } catch (err) {
          console.error("Refresh token failed", err);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default api