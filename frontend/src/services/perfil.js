import { api } from './api'

export async function atualizarPerfil(dados) {
  const response = await api.patch('/sessao/perfil', {
    nome: dados.nome,
    curso: dados.curso,
    vinculo: dados.vinculo,
  })
  return response.data.usuario
}

// Endpoint previsto para a próxima etapa do backend de autenticação.
export async function alterarSenha(dados) {
  await api.put('/sessao/senha', {
    senhaAtual: dados.senhaAtual,
    novaSenha: dados.novaSenha,
  })
}
