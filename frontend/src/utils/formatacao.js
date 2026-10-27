import { DIAS_SEMANA } from "@/constants/opcoes";

// 'aaaa-mm-dd' ou 'aaaa-mm-dd hh:mm:ss' -> 'dd/mm/aaaa'
// (sem passar por Date: converter para UTC faria a data pular um dia à noite)
export function formatarData(data) {
  if (!data) return "";

  const [ano, mes, dia] = String(data).slice(0, 10).split("-");
  if (!ano || !mes || !dia) return String(data); // Fallback se o formato for inesperado

  return `${dia}/${mes}/${ano}`;
}
// 'dd/mm/aaaa' -> 'aaaa-mm-dd' (formato do banco). Uma data incompleta volta
// como está, para a validação apontar que é inválida.
export function dataParaIso(data) {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(data ?? "");
  return partes ? `${partes[3]}-${partes[2]}-${partes[1]}` : data;
}

export function formatarPeriodo(inicio, termino) {
  if (!termino) return `A partir de ${formatarData(inicio)}`;
  return `${formatarData(inicio)} a ${formatarData(termino)}`;
}

function juntarComE(itens) {
  if (itens.length <= 1) return itens.join("");
  return `${itens.slice(0, -1).join(", ")} e ${itens.at(-1)}`;
}

export function formatarDias(dias = [], { curto = false } = {}) {
  const nomes = DIAS_SEMANA.filter((d) => dias.includes(d.valor)).map((d) =>
    curto ? d.curto : d.rotulo,
  );
  return juntarComE(nomes);
}

export function formatarHorario(inicio, termino) {
  return `${inicio} às ${termino}`;
}

// Separa um texto em trechos de texto e de link, para exibir URLs clicáveis
// sem usar v-html.
// (a pontuação no fim da URL fica de fora do link)
const URL_REGEX = /(https?:\/\/[^\s]*[^\s.,;:!?)])/g;

export function separarLinks(texto = "") {
  // Se o texto for null, undefined ou vazio, retorna uma string vazia tratada
  if (!texto) return [];

  return String(texto)
    .split(URL_REGEX)
    .filter(Boolean)
    .map((parte) => ({ texto: parte, link: /^https?:\/\//.test(parte) }));
}
