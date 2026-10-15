import { DIAS_SEMANA } from '@/constants/opcoes'

// 'aaaa-mm-dd' -> 'dd/mm/aaaa' (sem passar por Date, para evitar erro de fuso)
export function formatarData(data) {
  if (!data) return ''
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

export function formatarPeriodo(inicio, termino) {
  if (!termino) return `A partir de ${formatarData(inicio)}`
  return `${formatarData(inicio)} a ${formatarData(termino)}`
}

function juntarComE(itens) {
  if (itens.length <= 1) return itens.join('')
  return `${itens.slice(0, -1).join(', ')} e ${itens.at(-1)}`
}

export function formatarDias(dias = [], { curto = false } = {}) {
  const nomes = DIAS_SEMANA.filter((d) => dias.includes(d.valor)).map((d) =>
    curto ? d.curto : d.rotulo,
  )
  return juntarComE(nomes)
}

export function formatarHorario(inicio, termino) {
  return `${inicio} às ${termino}`
}

// Separa um texto em trechos de texto e de link, para exibir URLs clicáveis
// sem usar v-html.
// (a pontuação no fim da URL fica de fora do link)
const URL_REGEX = /(https?:\/\/[^\s]*[^\s.,;:!?)])/g

export function separarLinks(texto = '') {
  return texto
    .split(URL_REGEX)
    .filter(Boolean)
    .map((parte) => ({ texto: parte, link: /^https?:\/\//.test(parte) }))
}
