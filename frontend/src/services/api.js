import axios from "axios";

export const api = axios.create({
  // Endereço da API vem do frontend/.env (VITE_API_URL); sem ele, usa o local
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});
