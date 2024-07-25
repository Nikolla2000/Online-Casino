import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_LOCAL_SERVER_URL, // local url
  baseURL: import.meta.env.VITE_PRODUCTION_SERVER_URL, // production server url
  withCredentials: true,
})

export default instance