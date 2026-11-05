import express from "express";
import routes from "./routes.js";
import cors from "cors";
import { sessao } from "./app/middlewares/sessao.js";

const app = express();

// Atrás de um proxy reverso (ex.: nginx no container), TRUST_PROXY diz quantos
// proxies confiar, para o Express saber que a conexão original era HTTPS
// e aceitar enviar o cookie de sessão com Secure
if (process.env.TRUST_PROXY) {
  const valor = process.env.TRUST_PROXY;
  app.set("trust proxy", /^\d+$/.test(valor) ? Number(valor) : valor);
}

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, // deixa o navegador enviar o cookie de sessão
  }),
);

app.use(express.json());
app.use(sessao);
app.use(routes);

export default app;
