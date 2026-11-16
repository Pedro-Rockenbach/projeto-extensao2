import { randomBytes } from "node:crypto";
import session from "express-session";
import SessaoStore from "../database/SessaoStore.js";

const producao = process.env.NODE_ENV === "production";

// A sessão vence depois de 7 dias sem nenhum acesso (cada requisição renova o prazo)...
const DURACAO_OCIOSA = 7 * 24 * 60 * 60 * 1000;
// ...e, mesmo em uso, vale no máximo 30 dias a partir do login
const DURACAO_MAXIMA = 30 * 24 * 60 * 60 * 1000;

// Secure (cookie só vai por HTTPS) é o padrão em produção; COOKIE_SECURE muda isso
const cookieSeguro = process.env.COOKIE_SECURE
  ? process.env.COOKIE_SECURE === "true"
  : producao;

// Com o prefixo __Host- o navegador só aceita o cookie vindo por HTTPS, do próprio
// domínio e com Path=/, então um subdomínio não consegue sobrescrevê-lo
const NOME_COOKIE = cookieSeguro ? "__Host-postcamp.sid" : "postcamp.sid";

const opcoesCookie = {
  httpOnly: true, // o JavaScript da página não consegue ler o cookie
  secure: cookieSeguro,
  sameSite: "lax", // o cookie não vai junto em requisições feitas por outros sites
  path: "/",
};

function segredo() {
  const valor = process.env.SESSION_SECRET;
  if (valor?.length >= 32) return valor;

  if (producao) {
    throw new Error("Defina SESSION_SECRET no .env com pelo menos 32 caracteres.");
  }
  console.warn(
    "SESSION_SECRET ausente ou com menos de 32 caracteres (veja o .env.example)." +
      (valor ? "" : " Usando um segredo temporário: os logins caem quando o servidor reinicia."),
  );
  return valor || randomBytes(32).toString("hex");
}

const store = new SessaoStore({ duracaoPadrao: DURACAO_OCIOSA, duracaoMaxima: DURACAO_MAXIMA });

export const sessao = session({
  name: NOME_COOKIE,
  secret: segredo(),
  store,
  resave: false,
  saveUninitialized: false, // visitante sem login não recebe cookie nem ocupa o banco
  rolling: true,
  cookie: { ...opcoesCookie, maxAge: DURACAO_OCIOSA },
});

// Para a rota de login chamar depois de conferir a senha. O id de sessão de antes
// do login é descartado e um novo é gerado, o que impede a fixação de sessão
// (alguém plantar um id conhecido no navegador da vítima e esperar ela entrar).
export function iniciarSessao(req, usuarioId) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((erro) => {
      if (erro) return reject(erro);
      req.session.usuarioId = usuarioId;
      req.session.criadaEm = Date.now();
      req.session.save((erro) => (erro ? reject(erro) : resolve()));
    });
  });
}

// Logout: apaga a sessão no banco (o cookie deixa de valer na hora) e no navegador
export function encerrarSessao(req, res) {
  // Sem login não há sessão salva; só limpa um cookie velho, se houver
  if (!req.session?.usuarioId) {
    res.clearCookie(NOME_COOKIE, opcoesCookie);
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    req.session.destroy((erro) => {
      if (erro) return reject(erro);
      res.clearCookie(NOME_COOKIE, opcoesCookie);
      resolve();
    });
  });
}

// Encerra o login do usuário em todos os aparelhos. Passando o req, mantém a
// sessão dessa requisição (ex.: depois de trocar a senha, só os outros aparelhos saem).
export function encerrarSessoesDoUsuario(usuarioId, req) {
  return store.destroyDoUsuario(usuarioId, req?.sessionID);
}

// Para as rotas que só quem está logado pode usar
export function exigirLogin(req, res, next) {
  if (req.session?.usuarioId) return next();
  res.status(401).json({ erro: "Faça login para continuar." });
}
