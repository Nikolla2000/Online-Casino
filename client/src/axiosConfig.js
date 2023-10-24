import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/server/v1/",
})

export default instance