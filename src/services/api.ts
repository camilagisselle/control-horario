import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/v1/control-horario",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    const user = JSON.parse(storedUser);
    const token = user.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;