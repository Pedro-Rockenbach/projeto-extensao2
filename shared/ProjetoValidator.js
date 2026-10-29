// Regras compartilhadas de validação entre frontend e backend.

const AREAS_TEMATICAS = [
  "Comunicação",
  "Cultura",
  "Direitos Humanos e Justiça",
  "Educação",
  "Meio Ambiente",
  "Saúde",
  "Tecnologia e Produção",
  "Trabalho",
];

const SITUACOES = ["abertas", "andamento", "encerrado"];
const VINCULOS = ["Aluno", "Professor", "Servidor"];
const CAMPI = [
  "Cascavel",
  "Foz do Iguaçu",
  "Francisco Beltrão",
  "Marechal Cândido Rondon",
  "Toledo",
];
const DIAS_DA_SEMANA = ["seg", "ter", "qua", "qui", "sex", "sab"];

// Tamanho máximo de cada campo de texto; acompanha as colunas do database.sql
const LIMITES = {
  titulo: 150,
  descricao: 2000,
  publicoAlvo: 150,
  autorNome: 150,
  autorCurso: 150,
  autorEmail: 150,
  professorCoordenador: 150,
  local: 150,
  comoInscrever: 1000,
  preRequisitos: 1000,
};

const ROTULOS = {
  titulo: "Título do projeto",
  descricao: "Descrição",
  publicoAlvo: "Público-alvo",
  autorNome: "Nome",
  autorCurso: "Curso",
  autorEmail: "E-mail para contato",
  professorCoordenador: "Professor coordenador",
  local: "Sala ou local",
  comoInscrever: "Como se inscrever",
  preRequisitos: "Pré-requisitos",
};

// Só e-mail institucional da Unioeste (aceita subdomínios, ex.: aluno.unioeste.br).
// Sem a flag "g": com ela, .test() guarda a posição e o resultado alterna a cada chamada.
const EMAIL_PATTERN = /^[^\s@]+@([a-z0-9-]+\.)*unioeste\.br$/i;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

function isValidDate(value) {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) return false;

  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return false;
  return date.toISOString().slice(0, 10) === value;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function addRequiredStringError(errors, data, field, label) {
  if (!isNonEmptyString(data[field])) errors[field] = `${label} é obrigatório.`;
}

export { LIMITES };

export const projetoOptions = {
  areasTematicas: AREAS_TEMATICAS,
  situacoes: SITUACOES,
  vinculos: VINCULOS,
  campi: CAMPI,
  diasDaSemana: DIAS_DA_SEMANA,
};

export function validateProjeto(data) {
  const errors = {};

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { data: "O corpo da requisição deve ser um objeto." };
  }

  addRequiredStringError(errors, data, "titulo", "Título do projeto");
  addRequiredStringError(errors, data, "descricao", "Descrição");
  addRequiredStringError(errors, data, "publicoAlvo", "Público-alvo");
  addRequiredStringError(errors, data, "autorNome", "Nome");
  addRequiredStringError(errors, data, "autorCurso", "Curso");
  addRequiredStringError(errors, data, "professorCoordenador", "Professor coordenador");
  addRequiredStringError(errors, data, "local", "Sala ou local");


  if (!AREAS_TEMATICAS.includes(data.areaTematica)) errors.areaTematica = "Área temática inválida.";
  if (!SITUACOES.includes(data.situacao)) errors.situacao = "Situação inválida.";
  if (!VINCULOS.includes(data.autorVinculo)) errors.autorVinculo = "Vínculo inválido.";
  if (!CAMPI.includes(data.campus)) errors.campus = "Campus inválido.";

  if (!isNonEmptyString(data.autorEmail) || !EMAIL_PATTERN.test(data.autorEmail.trim())) {
    errors.autorEmail = "Use um e-mail institucional (@unioeste.br).";
  }

  if (!isValidDate(data.dataInicio)) errors.dataInicio = "Data de início inválida.";
  if (data.dataTermino !== undefined && data.dataTermino !== null && data.dataTermino !== "") {
    if (!isValidDate(data.dataTermino)) {
      errors.dataTermino = "Data de término inválida.";
    } else if (isValidDate(data.dataInicio) && data.dataTermino < data.dataInicio) {
      errors.dataTermino = "Data de término deve ser igual ou posterior à data de início.";
    }
  }

  if (data.vagas !== undefined && data.vagas !== null && data.vagas !== "") {
    const vagas = typeof data.vagas === "string" ? Number(data.vagas) : data.vagas;
    if (!Number.isInteger(vagas) || vagas <= 0) {
      errors.vagas = "Número de vagas deve ser um inteiro maior que zero.";
    }
  }

  if (!Array.isArray(data.diasSemana) || data.diasSemana.length === 0) {
    errors.diasSemana = "Informe ao menos um dia da semana.";
  } else if (
    data.diasSemana.some((dia) => !DIAS_DA_SEMANA.includes(dia)) ||
    new Set(data.diasSemana).size !== data.diasSemana.length
  ) {
    errors.diasSemana = "Dias da semana inválidos ou repetidos.";
  }

  if (!TIME_PATTERN.test(data.horarioInicio)) errors.horarioInicio = "Horário de início inválido.";
  if (!TIME_PATTERN.test(data.horarioTermino)) {
    errors.horarioTermino = "Horário de término inválido.";
  } else if (TIME_PATTERN.test(data.horarioInicio) && data.horarioTermino <= data.horarioInicio) {
    errors.horarioTermino = "Horário de término deve ser posterior ao horário de início.";
  }

  if (data.comoInscrever !== undefined && typeof data.comoInscrever !== "string") {
    errors.comoInscrever = "Como se inscrever deve ser um texto.";
  }
  if (data.preRequisitos !== undefined && typeof data.preRequisitos !== "string") {
    errors.preRequisitos = "Pré-requisitos devem ser um texto.";
  }

  for (const [campo, limite] of Object.entries(LIMITES)) {
    if (!errors[campo] && typeof data[campo] === "string" && data[campo].trim().length > limite) {
      errors[campo] = `${ROTULOS[campo]} deve ter no máximo ${limite} caracteres.`;
    }
  }

  return errors;
}
