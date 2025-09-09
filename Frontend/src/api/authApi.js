import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", 
});

export const loginUser = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const signupUser = async (name, email, address, password) => {
  const res = await api.post("/auth/signup", {
    name,
    email,
    address,
    password,
  });
  return res.data;
};

export const updatePassword = async (oldPassword, newPassword) => {
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  const res = await api.put(
    "/auth/update-password",
    { oldPassword, newPassword },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
