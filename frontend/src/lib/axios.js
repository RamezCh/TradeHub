import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // backend api link
  withCredentials: true, // Send cookies with every single request
});
