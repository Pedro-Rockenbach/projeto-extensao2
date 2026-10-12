import UsuariosRepository from "../repositories/UsuarioRepository.js";

class UsuariosController {
  async index(req, res) {
    const row = await UsuariosRepository.findAll();
    res.json(row);
  }

  async show(req, res) {
    const id = req.params.id;
    const row = await UsuariosRepository.findById(id);
    res.json(row);
  }

  async store(req, res) {
    const usuario = req.body;
    const row = await UsuariosRepository.create(usuario);
    res.json(row);
  }

  async update(req, res) {
    const id = req.params.id;
    const usuario = req.body;
    const row = await UsuariosRepository.update(usuario, id);
    res.json(row);
  }

  async delete(req, res) {
    const id = req.params.id;
    const row = await UsuariosRepository.delete(id);
    res.json(row);
  }
}

// Singleton
export default new UsuariosController();
