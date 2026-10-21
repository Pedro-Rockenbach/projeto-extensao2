// controllers/PostagensController.js
import PostagensRepository from "../repositories/PostagensRepository.js";
import UsuariosRepository from "../repositories/UsuarioRepository.js";
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

async function obterUsuarioId(dados) {
  const usuarios = await UsuariosRepository.findByEmail(dados.autorEmail);
  if (usuarios.length > 0) return usuarios[0].id;

  const resultado = await UsuariosRepository.create({
    vinculo: dados.autorVinculo,
    nome: dados.autorNome,
    email: dados.autorEmail,
    professor: dados.professorCoordenador,
  });

  return resultado.insertId;
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
      const dados = normalizarDadosParaValidacao(req.body);
      const errors = validateProjeto(dados);

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const usuarioId = await obterUsuarioId(dados);

      //Traduz para o nome das colunas do BD.
      const postagemParaBanco = {
        titulo: dados.titulo,
        conteudo: dados.descricao,
        area: dados.areaTematica,
        publico_alvo: dados.publicoAlvo,
        status: dados.situacao || "abertas",
        vagas: dados.vagas || 0,
        data_inicio: dados.dataInicio,
        data_fim: dados.dataTermino || null,
        campus: dados.campus,
        local: dados.local,
        dia_semana: dados.diasSemana.join(","),
        hora_inicio: dados.horarioInicio,
        hora_termino: dados.horarioTermino,
        usuario_id: usuarioId,
      };

      const result = await PostagensRepository.create(postagemParaBanco);
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: "Erro ao criar postagem" });
    }
  }

  async update(req, res) {
    try {
      const dados = normalizarDadosParaValidacao(req.body);
      const errors = validateProjeto(dados);

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const postagemParaBanco = {
        titulo: dados.titulo,
        conteudo: dados.descricao,
        area: dados.areaTematica,
        publico_alvo: dados.publicoAlvo,
        status: dados.situacao || "abertas",
        vagas: dados.vagas || 0,
        data_inicio: dados.dataInicio,
        data_fim: dados.dataTermino || null,
        campus: dados.campus,
        local: dados.local,
        dia_semana: dados.diasSemana.join(","),
        hora_inicio: dados.horarioInicio,
        hora_termino: dados.horarioTermino,
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
