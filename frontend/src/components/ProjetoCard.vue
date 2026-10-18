<script setup>
import { RouterLink } from 'vue-router'
import SituacaoEtiqueta from './SituacaoEtiqueta.vue'
import { formatarDias, formatarPeriodo } from '@/utils/formatacao'

defineProps({
  projeto: { type: Object, required: true },
})
</script>

<template>
  <article class="card">
    <div class="card__topo">
      <SituacaoEtiqueta :situacao="projeto.situacao" />
      <span class="card__area">{{ projeto.areaTematica }}</span>
    </div>

    <h2 class="card__titulo">
      <RouterLink :to="{ name: 'detalhes-projeto', params: { id: projeto.id } }" class="card__link">
        {{ projeto.titulo }}
      </RouterLink>
    </h2>

    <p class="card__descricao">{{ projeto.descricao }}</p>

    <dl class="card__info">
      <div>
        <dt>Campus</dt>
        <dd>{{ projeto.campus }}</dd>
      </div>
      <div>
        <dt>Período</dt>
        <dd>{{ formatarPeriodo(projeto.dataInicio, projeto.dataTermino) }}</dd>
      </div>
      <div>
        <dt>Dias</dt>
        <dd>{{ formatarDias(projeto.diasSemana, { curto: true }) }}</dd>
      </div>
    </dl>

    <span class="card__mais" aria-hidden="true">Ver detalhes →</span>
  </article>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: var(--superficie);
  border: 1px solid var(--borda);
  border-radius: var(--raio);
  box-shadow: var(--sombra);
  transition: border-color 0.15s, box-shadow 0.15s;
}

.card:hover {
  border-color: var(--roxo-medio);
  box-shadow: 0 4px 16px rgb(67 50 99 / 0.12);
}

.card:focus-within {
  outline: 3px solid var(--roxo-medio);
  outline-offset: 2px;
}

.card__topo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.card__area {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--roxo-medio);
}

.card__titulo {
  font-size: 1.08rem;
  font-weight: 700;
}

.card__link {
  color: inherit;
  text-decoration: none;
}

/* O card inteiro fica clicável, mas o link continua sendo só o título */
.card__link::after {
  content: '';
  position: absolute;
  inset: 0;
}

.card__link:focus-visible {
  outline: none;
}

.card__descricao {
  margin: 0;
  color: var(--texto-suave);
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__info {
  display: grid;
  gap: 6px;
  margin: auto 0 0;
  padding-top: 12px;
  border-top: 1px solid var(--borda);
  font-size: 0.85rem;
}

.card__info div {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 8px;
}

.card__info dt {
  color: var(--texto-suave);
}

.card__info dd {
  margin: 0;
  font-weight: 500;
}

.card__mais {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--rosa);
}
</style>
