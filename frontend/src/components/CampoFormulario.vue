<script setup>
// Rótulo + campo + dica/erro, com os ids de acessibilidade já ligados.
// O campo em si vem pelo slot, que recebe { id, descricao, invalido }.
import { computed } from 'vue'

const props = defineProps({
  id: { type: String, required: true },
  rotulo: { type: String, required: true },
  obrigatorio: { type: Boolean, default: false },
  erro: { type: String, default: '' },
  dica: { type: String, default: '' },
  contador: { type: String, default: '' },
  largo: { type: Boolean, default: false },
})

const descricao = computed(() =>
  [props.erro && `${props.id}-erro`, props.dica && `${props.id}-dica`].filter(Boolean).join(' ') ||
  undefined,
)
</script>

<template>
  <div class="campo" :class="{ 'campo--largo': largo, 'campo--invalido': erro }">
    <label :for="id" class="campo__rotulo">
      {{ rotulo }}
      <span v-if="obrigatorio" class="campo__obrigatorio" aria-hidden="true">*</span>
      <span v-else class="campo__opcional">(opcional)</span>
    </label>

    <slot :id="id" :descricao="descricao" :invalido="Boolean(erro)" />

    <div v-if="dica || contador" class="campo__rodape">
      <span v-if="dica" :id="`${id}-dica`" class="campo__dica">{{ dica }}</span>
      <span v-if="contador" class="campo__contador" aria-live="polite">{{ contador }}</span>
    </div>
    <p v-if="erro" :id="`${id}-erro`" class="campo__erro">{{ erro }}</p>
  </div>
</template>

<style scoped>
.campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.campo--largo {
  grid-column: 1 / -1;
}

.campo__rotulo {
  font-weight: 600;
  font-size: 0.9rem;
}

.campo__obrigatorio {
  color: var(--rosa);
  margin-left: 2px;
}

.campo__opcional {
  font-weight: 400;
  color: var(--texto-suave);
  font-size: 0.82rem;
  margin-left: 4px;
}

.campo__rodape {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 0.8rem;
  color: var(--texto-suave);
}

.campo__contador {
  margin-left: auto;
  font-variant-numeric: tabular-nums;
}

.campo__erro {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--vermelho);
}

.campo :slotted(input),
.campo :slotted(select),
.campo :slotted(textarea) {
  width: 100%;
  min-height: 42px;
  padding: 9px 12px;
  background: var(--superficie);
  border: 1px solid var(--borda-forte);
  border-radius: var(--raio);
  font-size: 0.93rem;
}

.campo :slotted(textarea) {
  min-height: 160px;
  resize: vertical;
  line-height: 1.5;
}

.campo :slotted(input:focus),
.campo :slotted(select:focus),
.campo :slotted(textarea:focus) {
  outline: none;
  border-color: var(--roxo-medio);
  box-shadow: 0 0 0 3px rgb(110 83 128 / 0.2);
}

.campo--invalido :slotted(input),
.campo--invalido :slotted(select),
.campo--invalido :slotted(textarea) {
  border-color: var(--vermelho);
}
</style>
