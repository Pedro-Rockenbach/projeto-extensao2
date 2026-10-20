import { DIAS_SEMANA } from "@/constants/opcoes";

// 'aaaa-mm-dd' -> 'dd/mm/aaaa' (sem passar por Date, para evitar erro de fuso)
export function formatarData(data) {
  if (!data) return "";

  // Se vier um objeto Date do JS ou timestamp com hora, extrai apenas a parte da data 'YYYY-MM-DD'
  const dataString =
    typeof data === "string" ? data : new Date(data).toISOString();
  const apenasData = dataString.split("T")[0]; // Remove a parte da hora se houver (ex: 2026-10-18T...)

  const [ano, mes, dia] = apenasData.split("-");
  if (!ano || !mes || !dia) return data; // Fallback se o formato for inesperado

  return `${dia}/${mes}/${ano}`;
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

// Separa um texto em trechos de texto e de link, para exibir URLs clicáveis
export function separarLinks(texto = "") {
  // Se o texto for null, undefined ou vazio, retorna uma string vazia tratada
  if (!texto) return [];

  return String(texto)
    .split(URL_REGEX)
    .filter(Boolean)
    .map((parte) => ({ texto: parte, link: /^https?:\/\//.test(parte) }));
}
