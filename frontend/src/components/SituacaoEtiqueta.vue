<script setup>
import { computed } from 'vue'
import { classeSituacao, rotuloSituacao } from '@/constants/opcoes'

const props = defineProps({
  situacao: { type: String, required: true },
})

const rotulo = computed(() => rotuloSituacao(props.situacao))
const classe = computed(() => classeSituacao(props.situacao))
</script>

<template>
  <span class="etiqueta" :class="`etiqueta--${classe}`">{{ rotulo }}</span>
</template>

<style scoped>
.etiqueta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  white-space: nowrap;
  line-height: 1.5;
}

.etiqueta::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

.etiqueta--abertas {
  color: var(--verde);
  background: var(--verde-fundo);
}

.etiqueta--andamento {
  color: var(--amarelo);
  background: var(--amarelo-fundo);
}

.etiqueta--encerrado {
  color: var(--vermelho);
  background: var(--vermelho-fundo);
}
</style>
