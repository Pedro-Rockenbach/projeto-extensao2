// RF04: regras de validação do formulário de projeto.
// A ordem das verificações segue a ordem dos campos no formulário, para que
// o foco vá para o primeiro campo com erro.

import { LIMITES } from '@/constants/opcoes'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function vazio(valor) {
  return valor === null || valor === undefined || String(valor).trim() === ''
}

export function validarProjeto(p) {
  const erros = {}

  if (vazio(p.titulo)) erros.titulo = 'Informe o título do projeto.'
  else if (p.titulo.trim().length > LIMITES.titulo)
    erros.titulo = `O título pode ter no máximo ${LIMITES.titulo} caracteres.`

  if (vazio(p.descricao)) erros.descricao = 'Informe a descrição do projeto.'
  else if (p.descricao.trim().length > LIMITES.descricao)
    erros.descricao = `A descrição pode ter no máximo ${LIMITES.descricao} caracteres.`

  if (vazio(p.areaTematica)) erros.areaTematica = 'Selecione a área temática.'
  if (vazio(p.publicoAlvo)) erros.publicoAlvo = 'Informe o público-alvo.'
  if (vazio(p.situacao)) erros.situacao = 'Selecione a situação do projeto.'

  if (!vazio(p.vagas)) {
    const vagas = Number(p.vagas)
    if (!Number.isInteger(vagas) || vagas <= 0)
      erros.vagas = 'O número de vagas deve ser um número inteiro maior que zero.'
  }

  if (vazio(p.dataInicio)) erros.dataInicio = 'Informe a data de início.'
  if (!vazio(p.dataTermino) && !vazio(p.dataInicio) && p.dataTermino < p.dataInicio)
    erros.dataTermino = 'A data de término deve ser igual ou posterior à data de início.'

  if (vazio(p.autorNome)) erros.autorNome = 'Informe o seu nome.'
  if (vazio(p.autorCurso)) erros.autorCurso = 'Informe o seu curso.'
  if (vazio(p.autorVinculo)) erros.autorVinculo = 'Selecione o seu vínculo.'

  if (vazio(p.autorEmail)) erros.autorEmail = 'Informe um e-mail para contato.'
  else if (!EMAIL.test(p.autorEmail.trim()))
    erros.autorEmail = 'Informe um e-mail válido, por exemplo nome@exemplo.com.'

  if (vazio(p.professorCoordenador))
    erros.professorCoordenador = 'Informe o professor coordenador.'

  if (vazio(p.campus)) erros.campus = 'Selecione o campus.'
  if (vazio(p.local)) erros.local = 'Informe a sala ou o local.'
  if (!p.diasSemana?.length) erros.diasSemana = 'Marque pelo menos um dia da semana.'

  if (vazio(p.horarioInicio)) erros.horarioInicio = 'Informe o horário de início.'
  if (vazio(p.horarioTermino)) erros.horarioTermino = 'Informe o horário de término.'
  else if (!vazio(p.horarioInicio) && p.horarioTermino <= p.horarioInicio)
    erros.horarioTermino = 'O horário de término deve ser posterior ao de início.'

  return erros
}
