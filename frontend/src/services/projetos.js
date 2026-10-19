import { api } from "./api";

function mapearProjetoDoBackend(item) {
  if (!item) return null;
  return {
    id: item.id,
    titulo: item.titulo,
    descricao: item.conteudo,
    areaTematica: item.area,
    publicoAlvo: item.publico_alvo,
    situacao: item.status,
    vagas: item.vagas,
    dataInicio: item.data_inicio,
    dataTermino: item.data_fim ?? "",
    campus: item.campus,
    local: item.local,
    diasSemana: item.dia_semana ? item.dia_semana.split(",") : [],
    // TIME chega como 'hh:mm:ss'; o formulário e a tela usam 'hh:mm'
    horarioInicio: item.hora_inicio?.slice(0, 5) ?? "",
    horarioTermino: item.hora_termino?.slice(0, 5) ?? "",
    comoInscrever: item.inscricao ?? "",
    preRequisitos: item.requisitos ?? "",
    autorNome: item.autor_nome,
    autorCurso: item.autor_curso,
    autorVinculo: item.autor_vinculo,
    autorEmail: item.autor_email,
    professorCoordenador: item.professor_coordenador,
    criadoEm: item.criado_em,
  };
}

function mapearProjetoParaBackend(dados) {
  return {
    titulo: dados.titulo,
    conteudo: dados.descricao,
    area: dados.areaTematica,
    publico_alvo: dados.publicoAlvo,
    status: dados.situacao,
    vagas: dados.vagas,
    data_inicio: dados.dataInicio,
    // campo opcional: vazio vira NULL (o banco não aceita '' em DATE)
    data_fim: dados.dataTermino || null,
    campus: dados.campus,
    local: dados.local,
    dia_semana: dados.diasSemana.join(","),
    hora_inicio: dados.horarioInicio,
    hora_termino: dados.horarioTermino,
    inscricao: dados.comoInscrever,
    requisitos: dados.preRequisitos,
    autor_nome: dados.autorNome,
    autor_curso: dados.autorCurso,
    autor_vinculo: dados.autorVinculo,
    autor_email: dados.autorEmail,
    professor_coordenador: dados.professorCoordenador,
  };
}

export async function listarProjetos() {
  const response = await api.get("/postagens");
  return response.data.map(mapearProjetoDoBackend);
}

// Retorna null quando o projeto não existe (ex.: foi excluído)
export async function buscarProjeto(id) {
  try {
    const response = await api.get(`/postagens/${id}`);
    return mapearProjetoDoBackend(response.data);
  } catch (erro) {
    if (erro.response?.status === 404) return null;
    throw erro;
  }
}

export async function criarProjeto(dados) {
  const response = await api.post("/postagens", mapearProjetoParaBackend(dados));
  return { ...dados, id: response.data.id };
}

export async function atualizarProjeto(id, dados) {
  await api.put(`/postagens/${id}`, mapearProjetoParaBackend(dados));
  return { ...dados, id };
}

export async function excluirProjeto(id) {
  await api.delete(`/postagens/${id}`);
}
