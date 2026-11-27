import { createHash } from "node:crypto";
import session from "express-session";
import { consulta } from "./connection.js";

// Sessões vencidas são apagadas da tabela de tempos em tempos
const INTERVALO_LIMPEZA = 15 * 60 * 1000;

// A tabela guarda só o hash do id da sessão: quem conseguir ler o banco
// (um backup, por exemplo) não consegue usar os ids para entrar como outra pessoa
function chave(sid) {
  return createHash("sha256").update(sid).digest("hex");
}

function emSegundos(data) {
  return Math.floor(new Date(data).getTime() / 1000);
}

// Guarda as sessões do express-session na tabela "sessoes", para que o login
// continue valendo quando o servidor reinicia (a MemoryStore padrão perde tudo).
// duracaoPadrao: validade sem uso; duracaoMaxima: limite contado do login
// (sessao.criadaEm), que nem o uso constante renova.
class SessaoStore extends session.Store {
  constructor({ duracaoPadrao, duracaoMaxima }) {
    super();
    this.duracaoPadrao = duracaoPadrao;
    this.duracaoMaxima = duracaoMaxima;

    // unref: o temporizador não impede o processo de encerrar
    setInterval(() => this.limparExpiradas().catch(() => {}), INTERVALO_LIMPEZA).unref();
  }

  expiracao(sessao) {
    const expira = sessao.cookie?.expires ?? Date.now() + this.duracaoPadrao;
    return emSegundos(expira);
  }

  get(sid, callback) {
    const sql = "SELECT dados FROM sessoes WHERE id = ? AND expira_em > ?;";
    consulta(sql, [chave(sid), emSegundos(Date.now())], "Não foi possível buscar a sessão")
      .then(([linha]) => {
        if (!linha) return null;

        const sessao = JSON.parse(linha.dados);
        if (Date.now() - sessao.criadaEm > this.duracaoMaxima) {
          return this.apagar(sid).then(() => null);
        }
        return sessao;
      })
      .then((sessao) => callback(null, sessao), callback);
  }

  set(sid, sessao, callback) {
    const valores = [sessao.usuarioId ?? null, JSON.stringify(sessao), this.expiracao(sessao)];
    const sql = `
      INSERT INTO sessoes (id, usuario_id, dados, expira_em) VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE usuario_id = ?, dados = ?, expira_em = ?;
    `;
    consulta(sql, [chave(sid), ...valores, ...valores], "Não foi possível salvar a sessão").then(
      () => callback(),
      callback,
    );
  }

  // Chamado a cada requisição de uma sessão que não mudou: só empurra a
  // expiração para frente (reescrever os dados poderia desfazer uma alteração
  // feita por outra requisição ao mesmo tempo)
  touch(sid, sessao, callback) {
    const sql = "UPDATE sessoes SET expira_em = ? WHERE id = ?;";
    consulta(sql, [this.expiracao(sessao), chave(sid)], "Não foi possível renovar a sessão").then(
      () => callback(),
      callback,
    );
  }

  destroy(sid, callback) {
    this.apagar(sid).then(() => callback(), callback);
  }

  apagar(sid) {
    const sql = "DELETE FROM sessoes WHERE id = ?;";
    return consulta(sql, [chave(sid)], "Não foi possível encerrar a sessão");
  }

  // Encerra as sessões de um usuário em todos os aparelhos, menos a atual
  // (quando informada). Para usar, por exemplo, depois de uma troca de senha.
  destroyDoUsuario(usuarioId, sidAtual) {
    const sql = "DELETE FROM sessoes WHERE usuario_id = ? AND id <> ?;";
    return consulta(
      sql,
      [usuarioId, sidAtual ? chave(sidAtual) : ""],
      "Não foi possível encerrar as sessões do usuário",
    );
  }

  limparExpiradas() {
    const sql = "DELETE FROM sessoes WHERE expira_em <= ?;";
    return consulta(sql, [emSegundos(Date.now())], "Não foi possível limpar as sessões vencidas");
  }
}

export default SessaoStore;
