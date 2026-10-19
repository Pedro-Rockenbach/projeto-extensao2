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

const SITUACOES = ["Inscrições abertas", "Em andamento", "Encerrado"];
const VINCULOS = ["Aluno", "Professor", "Servidor"];
const CAMPI = [
  "Cascavel",
  "Foz do Iguaçu",
  "Francisco Beltrão",
  "Marechal Cândido Rondon",
  "Toledo",
];
const DIAS_DA_SEMANA = ["segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;   // abc@email.com
const DATE_PATTERN = /^\d{2}-\d{2}-\d{4}$/;           // DD-MM-YYYY
const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;   // HH:MM formato 24h

function isValidDate(value) {
  if (!DATE_PATTERN.test(value)) return false;

  const date = new Date(`${value}T00:00:00Z`);
  return date.toISOString().slice(0, 10) === value;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function addRequiredStringError(errors, data, field, label) {
  if (!isNonEmptyString(data[field])) errors[field] = `${label} é obrigatório.`;
}

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
  addRequiredStringError(errors, data, "nomePublicador", "Nome");
  addRequiredStringError(errors, data, "curso", "Curso");
  addRequiredStringError(errors, data, "professorCoordenador", "Professor coordenador");
  addRequiredStringError(errors, data, "salaLocal", "Sala ou local");

  if (isNonEmptyString(data.titulo) && data.titulo.trim().length > 150) {
    errors.titulo = "Título do projeto deve ter no máximo 150 caracteres.";
  }
  if (isNonEmptyString(data.descricao) && data.descricao.trim().length > 2000) {
    errors.descricao = "Descrição deve ter no máximo 2000 caracteres.";
  }

  if (!AREAS_TEMATICAS.includes(data.areaTematica)) errors.areaTematica = "Área temática inválida.";
  if (!SITUACOES.includes(data.situacao)) errors.situacao = "Situação inválida.";
  if (!VINCULOS.includes(data.vinculo)) errors.vinculo = "Vínculo inválido.";
  if (!CAMPI.includes(data.campus)) errors.campus = "Campus inválido.";

  if (!isNonEmptyString(data.email) || !EMAIL_PATTERN.test(data.email.trim())) {
    errors.email = "E-mail para contato inválido.";
  }

  if (!isValidDate(data.dataInicio)) errors.dataInicio = "Data de início inválida.";
  if (data.dataTermino !== undefined && data.dataTermino !== null && data.dataTermino !== "") {
    if (!isValidDate(data.dataTermino)) {
      errors.dataTermino = "Data de término inválida.";
    } else if (isValidDate(data.dataInicio) && data.dataTermino < data.dataInicio) {
      errors.dataTermino = "Data de término deve ser igual ou posterior à data de início.";
    }
  }

  if (data.numeroVagas !== undefined && data.numeroVagas !== null && data.numeroVagas !== "") {
    if (!Number.isInteger(data.numeroVagas) || data.numeroVagas <= 0) {
      errors.numeroVagas = "Número de vagas deve ser um inteiro maior que zero.";
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

  if (data.comoSeInscrever !== undefined && typeof data.comoSeInscrever !== "string") {
    errors.comoSeInscrever = "Como se inscrever deve ser um texto.";
  }
  if (data.preRequisitos !== undefined && typeof data.preRequisitos !== "string") {
    errors.preRequisitos = "Pré-requisitos devem ser um texto.";
  }

  return errors;
}
