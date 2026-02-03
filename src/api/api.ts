import axios from "axios";
import { getItem } from "../store/asyncStore";

const api = axios.create({
  baseURL: "https://factorykiyana.id/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await getItem("auth_token");
  console.log('token e', token);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;