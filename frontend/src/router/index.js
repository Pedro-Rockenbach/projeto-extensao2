import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import QuadroView from '@/views/QuadroView.vue'
import DetalhesView from '@/views/DetalhesView.vue'
import FormularioView from '@/views/FormularioView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView},
    { path: '/projetos', name: 'quadro', component: QuadroView },
    { path: '/projetos/novo', name: 'novo-projeto', component: FormularioView },
    { path: '/projetos/:id', name: 'detalhes-projeto', component: DetalhesView, props: true },
    {
      path: '/projetos/:id/editar',
      name: 'editar-projeto',
      component: FormularioView,
      props: true,
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
