import axios from "axios";

export const api = axios.create({
  // Por padrão a API é chamada pelo mesmo endereço do site, em /api (quem
  // repassa para o backend é o Vite em desenvolvimento e o nginx em produção).
  // Assim o cookie de sessão é do próprio site e funciona até no Safari do
  // celular, que bloqueia cookies de outros sites. VITE_API_URL (frontend/.env)
  // aponta para uma API em outro endereço.
  baseURL: import.meta.env.VITE_API_URL || "/api",
  // Envia o cookie de sessão também quando a API está em outro endereço
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
