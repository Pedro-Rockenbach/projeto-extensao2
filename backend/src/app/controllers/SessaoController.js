import UsuariosRepository from "../repositories/UsuarioRepository.js";
import { encerrarSessao } from "../middlewares/sessao.js";

// O login em si (conferir e-mail e senha) fica na rota de login, que chama
// iniciarSessao; aqui ficam a consulta da sessão atual e o logout.
class SessaoController {
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
