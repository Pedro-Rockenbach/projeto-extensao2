// controllers/PostagensController.js
import PostagensRepository from "../repositories/PostagensRepository.js";
import UsuariosRepository from "../repositories/UsuarioRepository.js";
import { validateProjeto } from "../validators/ProjetoValidator.js";

function normalizarDadosParaValidacao(dados) {
  const normalizados = {
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

  // Os limites de tamanho são conferidos sem os espaços das pontas,
  // então é assim que o texto deve ser salvo também
  for (const campo in normalizados) {
    if (typeof normalizados[campo] === "string") normalizados[campo] = normalizados[campo].trim();
  }
  return normalizados;
}

// Encontra o autor pelo e-mail (ou cria um novo) e atualiza os dados dele
// com o que veio no formulário
async function salvarAutor(dados) {
  const autor = {
    nome: dados.autorNome,
    curso: dados.autorCurso,
    vinculo: dados.autorVinculo,
    email: dados.autorEmail,
  };

  const [existente] = await UsuariosRepository.findByEmail(autor.email);
  if (existente) {
    await UsuariosRepository.update(autor, existente.id);
    return existente.id;
  }

  const resultado = await UsuariosRepository.create(autor);
  return resultado.insertId;
}

//Traduz para o nome das colunas do BD.
function montarPostagemParaBanco(dados, usuarioId) {
  return {
    titulo: dados.titulo,
    conteudo: dados.descricao,
    area: dados.areaTematica,
    publico_alvo: dados.publicoAlvo,
    status: dados.situacao,
    // campo opcional: vazio vira NULL (e não 0, que o validador recusa ao editar)
    vagas: dados.vagas === undefined || dados.vagas === null || dados.vagas === "" ? null : Number(dados.vagas),
    data_inicio: dados.dataInicio,
    data_fim: dados.dataTermino || null,
    campus: dados.campus,
    local: dados.local,
    dia_semana: dados.diasSemana.join(","),
    hora_inicio: dados.horarioInicio,
    hora_termino: dados.horarioTermino,
    professor_coordenador: dados.professorCoordenador,
    inscricao: dados.comoInscrever || null,
    requisitos: dados.preRequisitos || null,
    usuario_id: usuarioId,
  };
}

class PostagensController {
  async index(req, res) {
    try {
      const rows = await PostagensRepository.findAll();
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: "Erro ao listar postagens" });
    }
  }

  async show(req, res) {
    try {
      const [postagem] = await PostagensRepository.findById(req.params.id);

      if (!postagem) {
        return res.status(404).json({ erro: "Postagem não encontrada" });
      }

      res.json(postagem);
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

      const usuarioId = await salvarAutor(dados);
      const result = await PostagensRepository.create(montarPostagemParaBanco(dados, usuarioId));
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

      const [existente] = await PostagensRepository.findById(req.params.id);
      if (!existente) {
        return res.status(404).json({ erro: "Postagem não encontrada" });
      }

      const usuarioId = await salvarAutor(dados);
      await PostagensRepository.update(montarPostagemParaBanco(dados, usuarioId), req.params.id);
      res.json({ id: existente.id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: "Erro ao atualizar postagem" });
    }
  }

  async delete(req, res) {
    try {
      const result = await PostagensRepository.delete(req.params.id);

      if (result.affectedRows === 0) {
        return res.status(404).json({ erro: "Postagem não encontrada" });
      }

      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: "Erro ao excluir postagem" });
    }
  }
}

export default new PostagensController();
