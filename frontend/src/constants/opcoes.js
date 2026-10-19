// Opções dos campos de lista do formulário.
// Ficam centralizadas aqui para serem reaproveitadas no formulário, na
// exibição e, futuramente, nos filtros do quadro.

export const AREAS_TEMATICAS = [
  'Comunicação',
  'Cultura',
  'Direitos Humanos e Justiça',
  'Educação',
  'Meio Ambiente',
  'Saúde',
  'Tecnologia e Produção',
  'Trabalho',
]

export const SITUACOES = [
  { valor: 'Inscrições abertas', rotulo: 'Inscrições abertas', classe: 'abertas' },
  { valor: 'Em andamento', rotulo: 'Em andamento', classe: 'andamento' },
  { valor: 'Encerrado', rotulo: 'Encerrado', classe: 'encerrado' },
]

export const VINCULOS = ['Aluno', 'Professor', 'Servidor']

export const CAMPI = [
  'Cascavel',
  'Foz do Iguaçu',
  'Francisco Beltrão',
  'Marechal Cândido Rondon',
  'Toledo',
]

export const DIAS_SEMANA = [
  { valor: 'Segunda', rotulo: 'Segunda', curto: 'Seg' },
  { valor: 'Terça', rotulo: 'Terça', curto: 'Ter' },
  { valor: 'Quarta', rotulo: 'Quarta', curto: 'Qua' },
  { valor: 'Quinta', rotulo: 'Quinta', curto: 'Qui' },
  { valor: 'Sexta', rotulo: 'Sexta', curto: 'Sex' },
  { valor: 'Sábado', rotulo: 'Sábado', curto: 'Sáb' },
]

export const LIMITES = {
  titulo: 150,
  descricao: 2000,
}

export function rotuloSituacao(valor) {
  return SITUACOES.find((s) => s.valor === valor)?.rotulo ?? valor
}

// Classe CSS da etiqueta (o valor tem espaço e acento, então não serve como classe)
export function classeSituacao(valor) {
  return SITUACOES.find((s) => s.valor === valor)?.classe ?? ''
}
