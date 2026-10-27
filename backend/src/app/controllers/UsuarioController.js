import UsuariosRepository from "../repositories/UsuarioRepository.js";

// Os usuários são criados e atualizados junto com as postagens
// (PostagensController), então aqui ficam só as consultas.
class UsuariosController {
  async index(req, res) {
    try {
      const rows = await UsuariosRepository.findAll();
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: "Erro ao listar usuários" });
    }
  }

  async show(req, res) {
    try {
      const [usuario] = await UsuariosRepository.findById(req.params.id);
      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }
      res.json(usuario);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: "Erro ao buscar usuário" });
    }
  }
}

// Singleton
export default new UsuariosController();
