import axios from "axios";
// import { store } from "./redux/store/store";
import { refresh } from "./redux/features/auth/authSlice";
import toast from "react-hot-toast";


const api = axios.create({
  baseURL: import.meta.env.VITE_ENV !== 'production' ? import.meta.env.VITE_LOCAL_SERVER_URL : import.meta.env.VITE_PRODUCTION_SERVER_URL,
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
      if (originalRequest.url.includes('/auth/refresh')) {
        return Promise.reject(err);
      }

      //fetch refresh token and try the original request again
      if ((err.response?.status === 401 || err.response?.status === 403) && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const result = await store.dispatch(refresh());
          if (result.payload?.accessToken) {
            originalRequest.headers['Authorization'] = `Bearer ${result.payload.accessToken}`;
            return api(originalRequest);
          }
        } catch (refreshErr) {
          console.error('Refresh failed:', refreshErr);
        }

      }
      return Promise.reject(err);
    }
  );

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'];
        toast.error(`Too many requests. Please wait ${retryAfter} seconds.`, {
          toastId: 'rate-limit'
        })
      }
      return Promise.reject(error);
    }
  )

  // api.interceptors.response.use(
  //   (response) => response,
  //   async (error) => {
  //     const originalRequest = error.config;
      
  //     if (error.response?.status === 403 && !originalRequest._retry) {
  //       originalRequest._retry = true;
  //       try {
  //         const res = await store.dispatch(refresh());
  //         if (refresh.fulfilled.match(res)) {
  //           const newAccessToken = res.payload.accessToken;
  //           originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
  //           return api(originalRequest);
  //         }
  //       } catch (err) {
  //         console.error("Refresh token failed", err);
  //       }
  //     }
  //     return Promise.reject(error);
  //   }
  // );
};

export default api