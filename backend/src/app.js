import express from "express";
import routes from "./routes.js";
import cors from "cors";
import helmet from "helmet";
import { sessao } from "./app/middlewares/sessao.js";
import {
  FRONTEND_URL,
  exigirJson,
  tratarErros,
  verificarOrigem,
} from "./app/middlewares/seguranca.js";

const app = express();

// Atrás de um proxy reverso (ex.: nginx no container), TRUST_PROXY diz quantos
// proxies confiar, para o Express saber que a conexão original era HTTPS
// e aceitar enviar o cookie de sessão com Secure
if (process.env.TRUST_PROXY) {
  const valor = process.env.TRUST_PROXY;
  app.set("trust proxy", /^\d+$/.test(valor) ? Number(valor) : valor);
}

// Cabeçalhos de segurança (nosniff, HSTS, frame-ancestors etc.) e sem o
// X-Powered-By, que contaria que a API é Express. same-site: o front em
// localhost:5173 ainda pode ler as respostas da API em localhost:3000.
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true, // deixa o navegador enviar o cookie de sessão
  }),
);

app.use(verificarOrigem);
app.use(exigirJson);
// O maior projeto possível tem bem menos que isso; corpos maiores são recusados
app.use(express.json({ limit: "50kb" }));
app.use(sessao);
app.use(routes);
app.use(tratarErros);

export default app;
