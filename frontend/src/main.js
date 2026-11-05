import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { api } from './services/api'
import { useSessao } from './composables/useSessao'
import { useAviso } from './composables/useAviso'
import './assets/main.css'

const { carregarSessao, limparSessao } = useSessao()
const { mostrarAviso } = useAviso()

// A API respondeu 401 numa ação que exige login: a sessão expirou ou foi
// encerrada (logout em outra aba, por exemplo). Leva ao login e, depois de
// entrar, de volta à tela em que a pessoa estava. As rotas /sessao ficam de
// fora porque o 401 do login significa senha errada, e a tela de login trata.
api.interceptors.response.use(undefined, (erro) => {
  if (erro.response?.status === 401 && !erro.config?.url?.startsWith('/sessao')) {
    limparSessao()
    mostrarAviso('Sua sessão expirou. Entre novamente.')
    router.push({ name: 'login', query: { voltar: router.currentRoute.value.fullPath } })
  }
  return Promise.reject(erro)
})

carregarSessao()

createApp(App).use(router).mount('#app')
