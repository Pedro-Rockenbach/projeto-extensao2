import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import QuadroView from '@/views/QuadroView.vue'
import DetalhesView from '@/views/DetalhesView.vue'
import FormularioView from '@/views/FormularioView.vue'
import { destinoAposLogin, useSessao } from '@/composables/useSessao'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: LoginView, meta: { somenteVisitante: true } },
    { path: '/', name: 'home', component: HomeView },
    { path: '/projetos', name: 'quadro', component: QuadroView },
    {
      path: '/projetos/novo',
      name: 'novo-projeto',
      component: FormularioView,
      meta: { requerLogin: true },
    },
    { path: '/projetos/:id', name: 'detalhes-projeto', component: DetalhesView, props: true },
    {
      path: '/projetos/:id/editar',
      name: 'editar-projeto',
      component: FormularioView,
      props: true,
      meta: { requerLogin: true },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

// Telas que exigem login mandam para o login e voltam depois; quem já entrou
// não vê a tela de login. A proteção de verdade é a da API, que recusa as
// ações sem sessão: isto só evita abrir uma tela que não vai funcionar.
router.beforeEach(async (to) => {
  if (!to.meta.requerLogin && !to.meta.somenteVisitante) return

  const { usuario, carregarSessao } = useSessao()
  await carregarSessao()

  if (to.meta.requerLogin && !usuario.value) {
    return { name: 'login', query: { voltar: to.fullPath } }
  }
  if (to.meta.somenteVisitante && usuario.value) {
    return destinoAposLogin(to.query.voltar)
  }
})

export default router
