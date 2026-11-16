// Quem está logado, compartilhado entre as telas. A sessão em si fica no
// servidor e o navegador guarda só um cookie httpOnly, que o JavaScript não
// lê; aqui fica apenas o usuário, para a interface. Nada vai para o localStorage.

import { readonly, ref } from 'vue'
import { buscarSessao, criarSessao, encerrarSessao } from '@/services/sessao'

const usuario = ref(null)
let carregamento = null

// Consulta a API uma vez e reaproveita a resposta nas próximas chamadas
function carregarSessao() {
  carregamento ??= buscarSessao()
    .then((dados) => (usuario.value = dados))
    .catch(() => {
      carregamento = null // API fora do ar: tenta de novo na próxima vez
      usuario.value = null
    })
  return carregamento
}

async function entrar(email, senha) {
  await criarSessao(email, senha)

  const dados = await buscarSessao()
  // A API aceitou o login, mas o cookie não voltou (ex.: bloqueado pelo navegador)
  if (!dados) throw new Error('A sessão não foi criada.')
  usuario.value = dados
  carregamento = Promise.resolve(dados)
}

// Só esquece o usuário depois que o servidor confirma: se o logout falhar,
// a sessão continua valendo e a tela não pode fingir que saiu
async function sair() {
  await encerrarSessao()
  limparSessao()
}

// A API avisou que a sessão acabou (expirou ou foi encerrada em outra aba)
function limparSessao() {
  usuario.value = null
  carregamento = Promise.resolve(null)
}

// Para onde ir depois do login. Só aceita caminhos deste site (uma única "/"
// no começo, sem espaços nem "\"), para que um link como
// /login?voltar=//site-falso.com não leve a pessoa para fora daqui.
export function destinoAposLogin(voltar) {
  if (typeof voltar === 'string' && /^\/(?![/\\])[^\s\\]*$/.test(voltar)) return voltar
  return '/projetos'
}

export function useSessao() {
  return { usuario: readonly(usuario), carregarSessao, entrar, sair, limparSessao }
}
