<script setup>
import { RouterView } from 'vue-router'
import AppCabecalho from '@/components/AppCabecalho.vue'
import { useAviso } from '@/composables/useAviso'

const { aviso } = useAviso()
</script>

<template>
  <AppCabecalho />

  <main class="container">
    <RouterView />
  </main>

  <footer class="rodape">
    <div class="container">
      Todos os direitos reservados © PostCamp. Mais informações em https://github.com/Pedro-Rockenbach/projeto-extensao2
    </div>
  </footer>

  <div class="aviso" role="status" aria-live="polite">
    <Transition name="aviso">
      <p v-if="aviso" class="aviso__texto">{{ aviso }}</p>
    </Transition>
  </div>
</template>

<style scoped>
.rodape {
  padding: 20px 0;
  border-top: 1px solid var(--borda);
  background: var(--superficie);
  color: var(--texto-suave);
  font-size: 0.82rem;
  text-align: center;
}

.aviso {
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 20px;
  display: flex;
  justify-content: center;
  pointer-events: none;
  z-index: 10;
}

.aviso__texto {
  margin: 0;
  padding: 12px 20px;
  border-radius: var(--raio);
  background: var(--roxo);
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 6px 20px rgb(42 36 51 / 0.25);
}

.aviso-enter-active,
.aviso-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.aviso-enter-from,
.aviso-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
