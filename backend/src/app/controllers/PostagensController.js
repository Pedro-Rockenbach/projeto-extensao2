// controllers/PostagensController.js
import PostagensRepository from "../repositories/PostagensRepository.js";
import { validateProjeto } from "../validators/ProjetoValidator.js";

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
<<<<<<< HEAD
    try {

      //Pegar os dados que o Vue envia.
      const dadosFrontend = req.body;

      //Traduz para o nome das colunas do BD.
      const postagemParaBanco = {
        titulo: dadosFrontend.titulo,
        conteudo: dadosFrontend.descricao,
        area: dadosFrontend.areaTematica,
        publico_alvo: dadosFrontend.publicoAlvo,
        status: dadosFrontend.situacao || 'Inscrições Abertas',
        vagas: dadosFrontend.vagas || 0,
        campus: dadosFrontend.campus,
        local: dadosFrontend.local,
        usuario_id: 1
      };

      const result = await PostagensRepository.create(postagemParaBanco);
      res.status(201).json(result);

    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: "Erro ao criar postagem" });
    }
  }

  async update(req, res) {
    try {
      const dadosFrontend = req.body;

      const postagemParaBanco = {
          titulo: dadosFrontend.titulo,
         conteudo: dadosFrontend.descricao,
         area: dadosFrontend.areaTematica,
         publico_alvo: dadosFrontend.publicoAlvo,
         status: dadosFrontend.situacao || 'Inscrições Abertas',
         vagas: dadosFrontend.vagas || 0,
         campus: dadosFrontend.campus,
         local: dadosFrontend.local,
      };
      const result = await PostagensRepository.update(postagemParaBanco, req.params.id);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: "Erro ao atualizar postagem" });
    }
=======
    const postagem = req.body;
    const errors = validateProjeto(postagem);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ erros: errors });
    }

    const result = await PostagensRepository.create(postagem);
    res.status(201).json(result);
  }

  async update(req, res) {
    const errors = validateProjeto(req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ erros: errors });
    }

    const result = await PostagensRepository.update(req.body, req.params.id);
    res.json(result);
>>>>>>> 407a123 (feat(frontend): altera o formato de horário de AM/PM para 24h e adiciona máscara para horários em formato 24h)
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
