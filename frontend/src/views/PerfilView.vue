<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import CampoFormulario from '@/components/CampoFormulario.vue'
import { useAviso } from '@/composables/useAviso'
import { useSessao } from '@/composables/useSessao'
import { alterarSenha, atualizarPerfil } from '@/services/perfil'
import { VINCULOS } from '@/constants/opcoes'

const router = useRouter()
const { usuario, carregarSessao, atualizarUsuario, sair } = useSessao()
const { mostrarAviso } = useAviso()

const carregando = ref(true)
const salvandoPerfil = ref(false)
const salvandoSenha = ref(false)
const erroCarregamento = ref('')
const erroPerfil = ref('')
const erroSenha = ref('')
const mensagemSenha = ref('')
const encerrandoSessao = ref(false)

const perfil = reactive({ nome: '', email: '', curso: '', vinculo: '' })
const senha = reactive({ atual: '', nova: '', confirmacao: '' })

const iniciais = computed(() =>
  (usuario.value?.nome ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toLocaleUpperCase('pt-BR') || '?',
)

onMounted(async () => {
  try {
    await carregarSessao()
    if (!usuario.value) {
      await router.replace({ name: 'login', query: { voltar: '/perfil' } })
      return
    }

    Object.assign(perfil, {
      nome: usuario.value.nome ?? '',
      email: usuario.value.email ?? '',
      curso: usuario.value.curso ?? '',
      vinculo: usuario.value.vinculo ?? '',
    })
  } catch {
    erroCarregamento.value = 'Não foi possível carregar seu perfil. Tente novamente.'
  } finally {
    carregando.value = false
  }
})

async function salvarPerfil() {
  erroPerfil.value = ''
  salvandoPerfil.value = true
  try {
    const usuarioAtualizado = await atualizarPerfil(perfil)
    atualizarUsuario(usuarioAtualizado)
    Object.assign(perfil, usuarioAtualizado)
    mostrarAviso('Perfil atualizado.')
  } catch (erro) {
    erroPerfil.value =
      erro.response?.status === 404
        ? 'A atualização de perfil ainda não está disponível no backend.'
        : 'Não foi possível salvar seu perfil. Confira os dados e tente novamente.'
  } finally {
    salvandoPerfil.value = false
  }
}

async function salvarSenha() {
  erroSenha.value = ''
  mensagemSenha.value = ''

  if (senha.nova !== senha.confirmacao) {
    erroSenha.value = 'A confirmação deve ser igual à nova senha.'
    return
  }
  if (senha.nova.length < 8) {
    erroSenha.value = 'A nova senha deve ter pelo menos 8 caracteres.'
    return
  }

  salvandoSenha.value = true
  try {
    await alterarSenha({ senhaAtual: senha.atual, novaSenha: senha.nova })
    mensagemSenha.value = 'Senha alterada com sucesso.'
    senha.atual = ''
    senha.nova = ''
    senha.confirmacao = ''
  } catch (erro) {
    erroSenha.value =
      erro.response?.status === 404
        ? 'A alteração de senha ainda não está disponível no backend.'
        : 'Não foi possível alterar a senha. Confira a senha atual e tente novamente.'
  } finally {
    salvandoSenha.value = false
  }
}

async function encerrarSessao() {
  erroPerfil.value = ''
  encerrandoSessao.value = true
  try {
    await sair()
    mostrarAviso('Você saiu da sua conta.')
    await router.replace({ name: 'home' })
  } catch {
    erroPerfil.value = 'Não foi possível encerrar a sessão. Tente novamente.'
  } finally {
    encerrandoSessao.value = false
  }
}
</script>

<template>
  <section class="pagina perfil">
    <RouterLink to="/" class="pagina__voltar">← Voltar para a página inicial</RouterLink>
    <header class="perfil__cabecalho">
      <div>
        <h1>Meu perfil</h1>
        <p>Consulte e atualize as informações da sua conta PostCamp.</p>
      </div>
      <button
        type="button"
        class="botao botao--perigo"
        :disabled="encerrandoSessao"
        @click="encerrarSessao"
      >
        {{ encerrandoSessao ? 'Encerrando…' : 'Encerrar sessão' }}
      </button>
    </header>

    <p v-if="carregando" class="estado" role="status">Carregando seu perfil…</p>
    <p v-else-if="erroCarregamento" class="perfil__mensagem perfil__mensagem--erro" role="alert">
      {{ erroCarregamento }}
    </p>

    <template v-else>
      <section class="perfil__cartao" aria-labelledby="perfil-titulo">
        <div class="perfil__resumo">
          <div class="perfil__avatar" aria-hidden="true">{{ iniciais }}</div>
          <div>
            <h2 id="perfil-titulo">{{ perfil.nome || 'Usuário PostCamp' }}</h2>
            <p>{{ perfil.vinculo || 'Vínculo não informado' }}</p>
          </div>
        </div>

        <form class="perfil__formulario" @submit.prevent="salvarPerfil">
          <p v-if="erroPerfil" class="perfil__mensagem perfil__mensagem--erro" role="alert">
            {{ erroPerfil }}
          </p>

          <div class="perfil__campos">
            <CampoFormulario id="perfil-nome" rotulo="Nome" obrigatorio>
              <template #default="{ id, descricao, invalido }">
                <input
                  :id="id"
                  v-model.trim="perfil.nome"
                  type="text"
                  autocomplete="name"
                  maxlength="150"
                  required
                  :aria-describedby="descricao"
                  :aria-invalid="invalido"
                />
              </template>
            </CampoFormulario>

            <CampoFormulario id="perfil-email" rotulo="E-mail">
              <template #default="{ id }">
                <input :id="id" :value="perfil.email || 'Não informado'" type="text" disabled />
              </template>
            </CampoFormulario>

            <CampoFormulario id="perfil-curso" rotulo="Curso" obrigatorio>
              <template #default="{ id, descricao, invalido }">
                <input
                  :id="id"
                  v-model.trim="perfil.curso"
                  type="text"
                  autocomplete="organization-title"
                  maxlength="150"
                  required
                  :aria-describedby="descricao"
                  :aria-invalid="invalido"
                />
              </template>
            </CampoFormulario>

            <CampoFormulario id="perfil-vinculo" rotulo="Tipo de conta" obrigatorio>
              <template #default="{ id, descricao, invalido }">
                <select
                  :id="id"
                  v-model="perfil.vinculo"
                  required
                  :aria-describedby="descricao"
                  :aria-invalid="invalido"
                >
                  <option value="" disabled>Selecione seu vínculo</option>
                  <option v-for="vinculo in VINCULOS" :key="vinculo" :value="vinculo">
                    {{ vinculo }}
                  </option>
                </select>
              </template>
            </CampoFormulario>
          </div>

          <div class="perfil__acoes">
            <button type="submit" class="botao botao--primario" :disabled="salvandoPerfil">
              {{ salvandoPerfil ? 'Salvando…' : 'Salvar alterações' }}
            </button>
          </div>
        </form>
      </section>

      <section class="perfil__cartao perfil__seguranca" aria-labelledby="senha-titulo">
        <div class="perfil__secao-cabecalho">
          <h2 id="senha-titulo">Segurança</h2>
          <p>Para sua proteção, confirme sua senha atual antes de escolher uma nova.</p>
        </div>

        <form class="perfil__formulario" @submit.prevent="salvarSenha">
          <p v-if="erroSenha" class="perfil__mensagem perfil__mensagem--erro" role="alert">
            {{ erroSenha }}
          </p>
          <p v-if="mensagemSenha" class="perfil__mensagem perfil__mensagem--sucesso" role="status">
            {{ mensagemSenha }}
          </p>

          <div class="perfil__campos">
            <CampoFormulario id="senha-atual" rotulo="Senha atual" obrigatorio>
              <template #default="{ id }">
                <input
                  :id="id"
                  v-model="senha.atual"
                  type="password"
                  autocomplete="current-password"
                  required
                />
              </template>
            </CampoFormulario>

            <CampoFormulario
              id="senha-nova"
              rotulo="Nova senha"
              dica="Use pelo menos 8 caracteres."
              obrigatorio
            >
              <template #default="{ id, descricao }">
                <input
                  :id="id"
                  v-model="senha.nova"
                  type="password"
                  autocomplete="new-password"
                  minlength="8"
                  required
                  :aria-describedby="descricao"
                />
              </template>
            </CampoFormulario>

            <CampoFormulario id="senha-confirmacao" rotulo="Confirmar nova senha" obrigatorio>
              <template #default="{ id }">
                <input
                  :id="id"
                  v-model="senha.confirmacao"
                  type="password"
                  autocomplete="new-password"
                  minlength="8"
                  required
                />
              </template>
            </CampoFormulario>
          </div>

          <div class="perfil__acoes">
            <button type="submit" class="botao botao--secundario" :disabled="salvandoSenha">
              {{ salvandoSenha ? 'Atualizando…' : 'Alterar senha' }}
            </button>
          </div>
        </form>
      </section>
    </template>
  </section>
</template>

<style scoped>
.perfil {
  max-width: 880px;
}

.perfil__cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 24px;
}

.perfil__cabecalho h1 {
  margin-bottom: 8px;
}

.perfil__cabecalho p,
.perfil__secao-cabecalho p {
  margin: 0;
  color: var(--texto-suave);
}

.perfil__cartao {
  margin-bottom: 20px;
  padding: 24px;
  background: var(--superficie);
  border: 1px solid var(--borda);
  border-radius: var(--raio);
  box-shadow: var(--sombra);
}

.perfil__resumo {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 20px;
  margin-bottom: 22px;
  border-bottom: 1px solid var(--borda);
}

.perfil__avatar {
  display: grid;
  flex: 0 0 64px;
  width: 64px;
  height: 64px;
  place-items: center;
  border-radius: 50%;
  background: var(--roxo-claro);
  color: var(--roxo);
  font-size: 1.25rem;
  font-weight: 700;
}

.perfil__resumo h2,
.perfil__secao-cabecalho h2 {
  margin-bottom: 4px;
  font-size: 1.2rem;
}

.perfil__resumo p {
  margin: 0;
  color: var(--texto-suave);
}

.perfil__campos {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.perfil__campos :deep(input:disabled) {
  background: var(--fundo);
  color: var(--texto-suave);
  cursor: not-allowed;
}

.perfil__acoes {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.perfil__seguranca {
  margin-top: 24px;
}

.perfil__secao-cabecalho {
  margin-bottom: 20px;
}

.perfil__mensagem {
  margin: 0 0 16px;
  padding: 10px 14px;
  border-radius: var(--raio);
  font-size: 0.9rem;
}

.perfil__mensagem--erro {
  border-left: 4px solid var(--vermelho);
  background: var(--vermelho-fundo);
  color: var(--vermelho);
}

.perfil__mensagem--sucesso {
  border-left: 4px solid var(--verde);
  background: var(--verde-fundo);
  color: var(--verde);
}

@media (max-width: 600px) {
  .perfil__cabecalho {
    flex-direction: column;
  }

  .perfil__cartao {
    padding: 20px 16px;
  }

  .perfil__campos {
    grid-template-columns: 1fr;
  }

  .perfil__acoes .botao {
    width: 100%;
  }
}
</style>
