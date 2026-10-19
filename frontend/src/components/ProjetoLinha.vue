<script setup>
import { RouterLink } from 'vue-router'
import SituacaoEtiqueta from './SituacaoEtiqueta.vue'
import { formatarPeriodo } from '@/utils/formatacao'

defineProps({
  projeto: { type: Object, required: true },
})
</script>

<template>
  <li class="linha">
    <div class="linha__principal">
      <RouterLink :to="{ name: 'detalhes-projeto', params: { id: projeto.id } }" class="linha__titulo">
        {{ projeto.titulo }}
      </RouterLink>
      <span class="linha__area">{{ projeto.areaTematica }}</span>
    </div>
    <div class="linha__celula">
      <span class="linha__rotulo">Situação</span>
      <SituacaoEtiqueta :situacao="projeto.situacao" />
    </div>
    <div class="linha__celula">
      <span class="linha__rotulo">Campus</span>
      {{ projeto.campus }}
    </div>
    <div class="linha__celula">
      <span class="linha__rotulo">Período</span>
      {{ formatarPeriodo(projeto.dataInicio, projeto.dataTermino) }}
    </div>
  </li>
</template>

<style scoped>
.linha {
  position: relative;
  display: grid;
  grid-template-columns: var(--colunas-lista);
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--borda);
  font-size: 0.9rem;
}

.linha:last-child {
  border-bottom: 0;
}

.linha:hover {
  background: var(--roxo-claro);
}

.linha:focus-within {
  outline: 3px solid var(--roxo-medio);
  outline-offset: -3px;
}

.linha__principal {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.linha__titulo {
  font-weight: 700;
  color: var(--roxo);
  text-decoration: none;
}

.linha__titulo::after {
  content: '';
  position: absolute;
  inset: 0;
}

.linha__titulo:focus-visible {
  outline: none;
}

.linha__area {
  font-size: 0.78rem;
  color: var(--texto-suave);
}

.linha__rotulo {
  display: none;
}

@media (max-width: 760px) {
  .linha {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .linha__celula {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .linha__rotulo {
    display: inline;
    min-width: 72px;
    color: var(--texto-suave);
    font-size: 0.82rem;
  }
}
</style>
