// Endereço do front quando ele roda em outra origem (sem proxy); o mesmo do CORS
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const METODOS_SEGUROS = new Set(["GET", "HEAD", "OPTIONS"]);

function origemDe(url) {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

// Proteção contra CSRF: um site malicioso pode fazer o navegador da vítima mandar
// um POST/PUT/DELETE para a API, mas não consegue falsificar o cabeçalho Origin.
// Aceita a origem do front (FRONTEND_URL) ou a própria origem da API, que é o caso
// de quando o front e a API são servidos juntos por um proxy (Vite em
// desenvolvimento, nginx em produção) e o Host chega como o navegador enviou.
// Complementa o cookie SameSite=Lax.
export function verificarOrigem(req, res, next) {
  if (METODOS_SEGUROS.has(req.method)) return next();

  const cabecalho = req.get("origin") ?? req.get("referer");
  // Sem Origin nem Referer não é um navegador (curl, testes), e só navegador
  // envia o cookie da vítima sozinho
  if (!cabecalho) return next();

  const origem = origemDe(cabecalho);
  const host = origem && new URL(origem).host;
  if (origem === origemDe(FRONTEND_URL) || host === req.get("host")) return next();

  res.status(403).json({ erro: "Origem da requisição não permitida." });
}

// Requisições que mandam dados precisam vir em JSON. Além de evitar um corpo
// vazio chegando nos controllers, isso fecha o caminho de CSRF por <form>:
// um formulário HTML de outro site não consegue enviar application/json.
export function exigirJson(req, res, next) {
  if (!["POST", "PUT", "PATCH"].includes(req.method) || req.is("application/json")) return next();
  res.status(415).json({ erro: "Os dados devem ser enviados em JSON." });
}

// Último middleware: responde erros sem expor detalhes internos (pilha de
// chamadas, SQL) e registra no console só os erros do servidor.
// Os quatro parâmetros são obrigatórios: é assim que o Express reconhece
// um tratador de erros.
export function tratarErros(err, req, res, next) {
  const status = err.status ?? err.statusCode ?? 500;
  if (status >= 500) console.error(err);

  res.status(status).json({
    erro: status >= 500 ? "Erro interno do servidor." : "Requisição inválida.",
  });
}
