import { api } from "./api";

// Quem está logado; null para visitante
export async function buscarSessao() {
  const response = await api.get("/sessao");
  return response.data.usuario;
}

// Login: a rota confere e-mail e senha e cria a sessão (cookie httpOnly)
export async function criarSessao(email, senha) {
  await api.post("/sessao", { email, senha });
}

// Logout
export async function encerrarSessao() {
  await api.delete("/sessao");
}
