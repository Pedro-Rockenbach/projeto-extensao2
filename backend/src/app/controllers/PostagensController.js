// controllers/PostagensController.js
import PostagensRepository from "../repositories/PostagensRepository.js";

class PostagensController {
  async index(req, res) {
    const rows = await PostagensRepository.findAll();
    res.json(rows);
  }

  async show(req, res) {
    const row = await PostagensRepository.findById(req.params.id);

    if (!row || (Array.isArray(row) && row.length === 0)) {
      return res.status(404).json({ erro: "Postagem não encontrada" });
    }

    res.json(row);
  }

  async store(req, res) {
    const postagem = req.body;
    const result = await PostagensRepository.create(postagem);
    res.status(201).json(result);
  }

  async update(req, res) {
    const result = await PostagensRepository.update(req.body, req.params.id);
    res.json(result);
  }

  async delete(req, res) {
    const result = await PostagensRepository.delete(req.params.id);
    res.json(result);
  }
}

export default new PostagensController();
