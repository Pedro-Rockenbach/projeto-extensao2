// Opções dos campos de lista do formulário.
// Os valores e os limites vêm das regras compartilhadas com o backend
// (shared/ProjetoValidator.js); aqui ficam só os rótulos exibidos na tela.
import { LIMITES, projetoOptions } from '@shared/ProjetoValidator.js'

export { LIMITES }

const ROTULOS_SITUACAO = {
  abertas: 'Inscrições abertas',
  andamento: 'Em andamento',
  encerrado: 'Encerrado',
}

const ROTULOS_DIA = {
  seg: { rotulo: 'Segunda', curto: 'Seg' },
  ter: { rotulo: 'Terça', curto: 'Ter' },
  qua: { rotulo: 'Quarta', curto: 'Qua' },
  qui: { rotulo: 'Quinta', curto: 'Qui' },
  sex: { rotulo: 'Sexta', curto: 'Sex' },
  sab: { rotulo: 'Sábado', curto: 'Sáb' },
}

export const AREAS_TEMATICAS = projetoOptions.areasTematicas

export const SITUACOES = projetoOptions.situacoes.map((valor) => ({
  valor,
  rotulo: ROTULOS_SITUACAO[valor],
}))

export const VINCULOS = projetoOptions.vinculos

export const CAMPI = projetoOptions.campi

export const DIAS_SEMANA = projetoOptions.diasDaSemana.map((valor) => ({
  valor,
  ...ROTULOS_DIA[valor],
}))

export function rotuloSituacao(valor) {
  return ROTULOS_SITUACAO[valor] ?? valor
}

// Classe CSS da etiqueta; vazia para um valor desconhecido
export function classeSituacao(valor) {
  return valor in ROTULOS_SITUACAO ? valor : ''
}
