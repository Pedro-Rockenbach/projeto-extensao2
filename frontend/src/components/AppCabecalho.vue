<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useSessao } from '@/composables/useSessao'
import { useAviso } from '@/composables/useAviso'

const route = useRoute()
const router = useRouter()
const { usuario, sair } = useSessao()
const { mostrarAviso } = useAviso()

const saindo = ref(false)

async function fazerLogout() {
  saindo.value = true
  try {
    await sair()
    mostrarAviso('Você saiu da sua conta.')
    if (route.meta.requerLogin) router.push({ name: 'home' })
  } catch {
    mostrarAviso('Não foi possível sair. Tente novamente.')
  } finally {
    saindo.value = false
  }
}
</script>

<template>
  <header class="cabecalho">
    <div class="container cabecalho__conteudo">
      <RouterLink to="/" class="cabecalho__marca">
        <img src="/logo-simples-PostCamp.jpg" alt="" class="cabecalho__logo" width="110" height="110" />
        <span class="cabecalho__textos">
          <span class="cabecalho__instituicao">Unioeste</span>
          <span class="cabecalho__sistema">Post Camp</span>
        </span>
      </RouterLink>

      <nav class="cabecalho__nav" aria-label="Principal">
        <RouterLink to="/projetos" class="cabecalho__link">Projetos</RouterLink>
        <template v-if="usuario">
          <span class="cabecalho__usuario">{{ usuario.nome }}</span>
          <button
            type="button"
            class="cabecalho__link cabecalho__sair"
            :disabled="saindo"
            @click="fazerLogout"
          >
            Sair
          </button>
        </template>
        <RouterLink
          v-else-if="route.name !== 'login'"
          :to="{ name: 'login', query: { voltar: route.fullPath } }"
          class="cabecalho__link"
        >
          Entrar
        </RouterLink>
        <RouterLink
          v-if="route.name !== 'login'"
          :to="{ name: 'novo-projeto' }"
          class="botao botao--primario"
        >
          Publicar projeto
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.cabecalho {
  background: var(--superficie);
  border-top: 4px solid var(--roxo);
  border-bottom: 1px solid var(--borda);
}

.cabecalho__conteudo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 72px;
  flex-wrap: wrap;
  padding-top: 10px;
  padding-bottom: 10px;
}

.cabecalho__marca {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  min-width: 0;
}

.cabecalho__logo {
  flex-shrink: 0;
}

.cabecalho__textos {
  display: flex;
  flex-direction: column;
  padding-left: 12px;
  border-left: 1px solid var(--borda);
  min-width: 0;
}

.cabecalho__instituicao {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--rosa);
}

.cabecalho__sistema {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--roxo);
}

.cabecalho__nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.cabecalho__link {
  color: var(--texto-suave);
  font-weight: 600;
  text-decoration: none;
  padding: 6px 0;
  border-bottom: 2px solid transparent;
}

.cabecalho__link:hover,
.cabecalho__link.router-link-exact-active {
  color: var(--roxo);
  border-bottom-color: var(--rosa);
}

.cabecalho__usuario {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--roxo);
  font-weight: 600;
}

.cabecalho__sair {
  background: none;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  cursor: pointer;
}

.cabecalho__sair:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 560px) {
  .cabecalho__nav {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
