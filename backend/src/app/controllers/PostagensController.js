// controllers/PostagensController.js
import PostagensRepository from "../repositories/PostagensRepository.js";
import { validateProjeto } from "../validators/ProjetoValidator.js";

function normalizarDadosParaValidacao(dados) {
  return {
    titulo: dados.titulo,
    descricao: dados.conteudo,
    areaTematica: dados.area,
    publicoAlvo: dados.publico_alvo,
    situacao: dados.status,
    vagas: dados.vagas,
    dataInicio: dados.data_inicio,
    dataTermino: dados.data_fim,
    autorNome: dados.autor_nome,
    autorCurso: dados.autor_curso,
    autorVinculo: dados.autor_vinculo,
    autorEmail: dados.autor_email,
    professorCoordenador: dados.professor_coordenador,
    campus: dados.campus,
    local: dados.local,
    diasSemana: typeof dados.dia_semana === "string" ? dados.dia_semana.split(",") : dados.dia_semana,
    horarioInicio: dados.hora_inicio,
    horarioTermino: dados.hora_termino,
    comoInscrever: dados.inscricao,
    preRequisitos: dados.requisitos,
  };
}

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

      //Pegar os dados que o Vue envia.
      const dadosFrontend = req.body;
      const errors = validateProjeto(normalizarDadosParaValidacao(dadosFrontend));

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ erros: errors });
      }

      //Traduz para o nome das colunas do BD.
      const postagemParaBanco = {
        titulo: dadosFrontend.titulo,
        conteudo: dadosFrontend.descricao,
        area: dadosFrontend.areaTematica,
        publico_alvo: dadosFrontend.publicoAlvo,
        status: dadosFrontend.situacao || "abertas",
        vagas: dadosFrontend.vagas || 0,
        data_inicio: dadosFrontend.dataInicio,
        data_fim: dadosFrontend.dataTermino || null,
        campus: dadosFrontend.campus,
        local: dadosFrontend.local,
        dia_semana: dadosFrontend.diasSemana.join(","),
        hora_inicio: dadosFrontend.horarioInicio,
        hora_termino: dadosFrontend.horarioTermino,
        usuario_id: 1,
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
      const errors = validateProjeto(normalizarDadosParaValidacao(dadosFrontend));

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const postagemParaBanco = {
        titulo: dadosFrontend.titulo,
        conteudo: dadosFrontend.descricao,
        area: dadosFrontend.areaTematica,
        publico_alvo: dadosFrontend.publicoAlvo,
        status: dadosFrontend.situacao || "abertas",
        vagas: dadosFrontend.vagas || 0,
        data_inicio: dadosFrontend.dataInicio,
        data_fim: dadosFrontend.dataTermino || null,
        campus: dadosFrontend.campus,
        local: dadosFrontend.local,
        dia_semana: dadosFrontend.diasSemana.join(","),
        hora_inicio: dadosFrontend.horarioInicio,
        hora_termino: dadosFrontend.horarioTermino,
      };
      const result = await PostagensRepository.update(postagemParaBanco, req.params.id);
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
