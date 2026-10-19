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
    dataTermino: item.data_fim,
    campus: item.campus,
    local: item.local,
    diasSemana: item.dia_semana ? item.dia_semana.split(",") : [],
    horarioInicio: item.hora_inicio,
    horarioTermino: item.hora_termino,
    comoInscrever: item.inscricao,
    preRequisitos: item.requisitos,
    autorNome: item.autorNome,
    autorVinculo: item.autorVinculo,
    autorEmail: item.autorEmail,
    professorCoordenador: item.professorCoordenador,
    criadoEm: item.criado_em,
  };
}

export async function listarProjetos() {
  const response = await api.get("/postagens");
  return response.data.map(mapearProjetoDoBackend);
}

export async function buscarProjeto(id) {
  const response = await api.get(`/postagens/${id}`);
  return mapearProjetoDoBackend(response.data);
}

export async function criarProjeto(dados) {
  const payload = {
    titulo: dados.titulo,
    conteudo: dados.descricao,
    area: dados.areaTematica,
    publico_alvo: dados.publicoAlvo,
    status: dados.situacao,
    vagas: dados.vagas,
    data_inicio: dados.dataInicio,
    data_fim: dados.dataTermino,
    campus: dados.campus,
    local: dados.local,
    dia_semana: Array.isArray(dados.diasSemana)
      ? dados.diasSemana.join(",")
      : dados.diasSemana,
    hora_inicio: dados.horarioInicio,
    hora_termino: dados.horarioTermino,
    inscricao: dados.comoInscrever,
    requisitos: dados.preRequisitos,
    usuario_id: dados.usuario_id || 1,
  };

  const response = await api.post("/postagens", payload);
  return { id: response.data.id, ...dados };
}

export async function atualizarProjeto(id, dados) {
  const payload = {
    titulo: dados.titulo,
    conteudo: dados.descricao,
    area: dados.areaTematica,
    publico_alvo: dados.publicoAlvo,
    status: dados.situacao,
    vagas: dados.vagas,
    data_inicio: dados.dataInicio,
    data_fim: dados.dataTermino,
    campus: dados.campus,
    local: dados.local,
    dia_semana: Array.isArray(dados.diasSemana)
      ? dados.diasSemana.join(",")
      : dados.diasSemana,
    hora_inicio: dados.horarioInicio,
    hora_termino: dados.horarioTermino,
    inscricao: dados.comoInscrever,
    requisitos: dados.preRequisitos,
  };

  await api.put(`/postagens/${id}`, payload);
  return { id, ...dados };
}

export async function excluirProjeto(id) {
  await api.delete(`/postagens/${id}`);
}
