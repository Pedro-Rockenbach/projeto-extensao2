<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { destinoAposLogin, useSessao } from '@/composables/useSessao'
import { useAviso } from '@/composables/useAviso'

const route = useRoute()
const router = useRouter()
const { entrar } = useSessao()
const { mostrarAviso } = useAviso()

const email = ref('')
const senha = ref('')
const erro = ref('')
const enviando = ref(false)

function mensagemDeErro(status) {
  if (status === 400 || status === 401) return 'E-mail ou senha incorretos.'
  if (status === 429) return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.'
  return 'Não foi possível entrar agora. Tente novamente.'
}

async function fazerLogin() {
  erro.value = ''
  enviando.value = true
  try {
    await entrar(email.value.trim(), senha.value)
    mostrarAviso('Login realizado.')
    router.replace(destinoAposLogin(route.query.voltar))
  } catch (e) {
    erro.value = mensagemDeErro(e.response?.status)
  } finally {
    senha.value = ''
    enviando.value = false
  }
}
</script>

<template>
  <section class="login pagina">
    <div class="login__cartao">
      <div class="login__marca">
        <RouterLink to="/">
          <img src="/logo-simples-PostCamp.jpg" alt="Logo PostCamp" class="login__logo" />
        </RouterLink>
        <h1>Acessar o PostCamp</h1>
        <p>Entre com sua conta para gerenciar e publicar seus projetos acadêmicos.</p>
      </div>

      <form class="login__formulario" @submit.prevent="fazerLogin">
        <p v-if="erro" class="login__erro" role="alert">{{ erro }}</p>

        <div class="login__campo">
          <label for="email">E-mail institucional</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="seu.nome@unioeste.br"
            autocomplete="username"
            required
          />
        </div>

        <div class="login__campo">
          <label for="senha">Senha</label>
          <input
            id="senha"
            v-model="senha"
            type="password"
            placeholder="********"
            autocomplete="current-password"
            required
          />
        </div>

        <button type="submit" class="botao botao--primario" :disabled="enviando">
          {{ enviando ? 'Entrando…' : 'Entrar no Sistema' }}
        </button>
      </form>

      <div class="login__rodape">
        <RouterLink to="/" class="login__voltar">← Voltar para a página inicial</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding-top: 20px;
  padding-bottom: 20px;
}

.login__cartao {
  width: 100%;
  max-width: 440px;
  padding: 32px;
  background: var(--superficie);
  border: 1px solid var(--borda);
  border-radius: 12px;
  box-shadow: var(--sombra);
}

.login__marca {
  margin-bottom: 24px;
  text-align: center;
}

.login__logo {
  width: auto;
  height: 72px;
  margin-bottom: 12px;
}

.login__marca h1 {
  margin-bottom: 8px;
  font-size: 1.5rem;
}

.login__marca p {
  margin: 0;
  color: var(--texto-suave);
  font-size: 0.9rem;
}

.login__formulario {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login__campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.login__campo label {
  font-size: 0.9rem;
  font-weight: 600;
}

.login__campo input {
  min-height: 42px;
  padding: 9px 12px;
  border: 1px solid var(--borda-forte);
  border-radius: var(--raio);
}

.login__campo input:focus {
  outline: none;
  border-color: var(--roxo-medio);
  box-shadow: 0 0 0 3px rgb(110 83 128 / 0.2);
}

.login__formulario > .botao {
  width: 100%;
  margin-top: 4px;
}

.login__erro {
  margin: 0;
  padding: 10px 14px;
  border-left: 4px solid var(--vermelho);
  border-radius: var(--raio);
  background: var(--vermelho-fundo);
  color: var(--vermelho);
  font-size: 0.9rem;
}

.login__rodape {
  margin-top: 20px;
  text-align: center;
}

.login__voltar {
  color: var(--texto-suave);
  font-size: 0.85rem;
  text-decoration: none;
}

.login__voltar:hover {
  color: var(--roxo);
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login__cartao {
    padding: 24px 18px;
  }
}
</style>
