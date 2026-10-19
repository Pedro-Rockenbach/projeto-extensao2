// controllers/PostagensController.js
import PostagensRepository from "../repositories/PostagensRepository.js";

class PostagensController {
  async index(req, res) {
    try {
      const rows = await PostagensRepository.findAll();

      const postagensFormatadas = rows.map((item) => ({
        ...item,
        criado_em: item.criado_em
          ? new Date(item.criado_em).toISOString()
          : new Date().toISOString(),
      }));

      res.json(postagensFormatadas);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: "Erro ao listar postagens" });
    }
  }

  async show(req, res) {
    try {
      let row = await PostagensRepository.findById(req.params.id);

      if (!row || (Array.isArray(row) && row.length === 0)) {
        return res.status(404).json({ erro: "Postagem não encontrada" });
      }

      const postagem = Array.isArray(row) ? row[0] : row;

      const postagemFormatada = {
        ...postagem,
        criado_em: postagem.criado_em
          ? new Date(postagem.criado_em).toISOString()
          : new Date().toISOString(),
      };

      res.json(postagemFormatada);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: "Erro ao buscar postagem" });
    }
  }

  async store(req, res) {
    try {
      const postagem = req.body;
      const result = await PostagensRepository.create(postagem);
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: "Erro ao criar postagem" });
    }
  }

  async update(req, res) {
    try {
      const result = await PostagensRepository.update(req.body, req.params.id);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: "Erro ao atualizar postagem" });
    }
  }

  async delete(req, res) {
    try {
      const result = await PostagensRepository.delete(req.params.id);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: "Erro ao excluir postagem" });
    }
  }
}

export default new PostagensController();
