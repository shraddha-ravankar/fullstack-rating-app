import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getDashboardStats = async () => {
  const res = await api.get("/admin/dashboard");
  return res.data;
};
