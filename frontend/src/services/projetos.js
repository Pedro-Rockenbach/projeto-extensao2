// Acesso aos dados de projetos.
//
// Por enquanto os dados ficam no localStorage do navegador, começando com
// projetos de exemplo. Quando a API de projetos estiver pronta no back-end,
// basta trocar o corpo destas funções por chamadas fetch; as telas não mudam.

import { PROJETOS_EXEMPLO } from './dadosExemplo'

const CHAVE = 'projetos-extensao:projetos'

let memoria = null

function carregar() {
  if (memoria) return memoria
  try {
    const salvo = localStorage.getItem(CHAVE)
    memoria = salvo ? JSON.parse(salvo) : structuredClone(PROJETOS_EXEMPLO)
  } catch {
    memoria = structuredClone(PROJETOS_EXEMPLO)
  }
  return memoria
}

function salvar() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(memoria))
  } catch {
    // Sem localStorage os dados continuam só na memória até recarregar a página.
  }
}

function gerarId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

// RF02: do mais recente para o mais antigo
export async function listarProjetos() {
  return structuredClone(carregar()).sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
}

export async function buscarProjeto(id) {
  const projeto = carregar().find((p) => p.id === id)
  return projeto ? structuredClone(projeto) : null
}

export async function criarProjeto(dados) {
  const projeto = { ...structuredClone(dados), id: gerarId(), criadoEm: new Date().toISOString() }
  carregar().push(projeto)
  salvar()
  return structuredClone(projeto)
}

export async function atualizarProjeto(id, dados) {
  const projetos = carregar()
  const indice = projetos.findIndex((p) => p.id === id)
  if (indice === -1) throw new Error('Projeto não encontrado.')
  const { criadoEm } = projetos[indice]
  projetos[indice] = { ...structuredClone(dados), id, criadoEm, atualizadoEm: new Date().toISOString() }
  salvar()
  return structuredClone(projetos[indice])
}

export async function excluirProjeto(id) {
  memoria = carregar().filter((p) => p.id !== id)
  salvar()
}
