import UsuariosRepository from "../repositories/UsuarioRepository.js";
import { encerrarSessao, iniciarSessao } from "../middlewares/sessao.js";
import { verificarSenha } from "../utils/senha.js";

class SessaoController {
  async create(req, res) {
    res.set("Cache-Control", "no-store");

    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const senha = req.body?.senha;
    if (
      !email ||
      email.length > 150 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof senha !== "string" ||
      !senha ||
      Buffer.byteLength(senha, "utf8") > 1024
    ) {
      return res.status(400).json({ erro: "Dados de login inválidos." });
    }

    try {
      const [usuario] = await UsuariosRepository.findCredentialsByEmail(email);
      const senhaValida = await verificarSenha(senha, usuario?.senha_hash);

      if (!usuario || !senhaValida) {
        return res.status(401).json({ erro: "E-mail ou senha incorretos." });
      }

      await iniciarSessao(req, usuario.id);
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: "Não foi possível realizar o login." });
    }
  }

  // Quem está logado; { usuario: null } para visitante
  async show(req, res) {
    // Resposta com dados do usuário logado não deve ficar em cache
    res.set("Cache-Control", "no-store");

    try {
      const { usuarioId } = req.session;
      if (!usuarioId) return res.json({ usuario: null });

      const [usuario] = await UsuariosRepository.findById(usuarioId);
      if (!usuario) {
        await encerrarSessao(req, res);
        return res.json({ usuario: null });
      }

      res.json({ usuario });
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: "Erro ao buscar a sessão" });
    }
  }

  // Logout. Responde 204 mesmo sem sessão, para o front não precisar tratar esse caso.
  async delete(req, res) {
    try {
      await encerrarSessao(req, res);
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: "Erro ao encerrar a sessão" });
    }
  }
}

export default new SessaoController();
