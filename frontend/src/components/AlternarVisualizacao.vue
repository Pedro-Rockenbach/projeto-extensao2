<script setup>
const modo = defineModel({ type: String, required: true })
</script>

<template>
  <div class="alternar" role="group" aria-label="Forma de visualização">
    <button
      type="button"
      class="alternar__botao"
      :aria-pressed="modo === 'grade'"
      @click="modo = 'grade'"
    >
      <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
        <rect x="2" y="2" width="7" height="7" rx="1.5" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" />
      </svg>
      Grade
    </button>
    <button
      type="button"
      class="alternar__botao"
      :aria-pressed="modo === 'lista'"
      @click="modo = 'lista'"
    >
      <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
        <rect x="2" y="3" width="16" height="3" rx="1.5" />
        <rect x="2" y="8.5" width="16" height="3" rx="1.5" />
        <rect x="2" y="14" width="16" height="3" rx="1.5" />
      </svg>
      Lista
    </button>
  </div>
</template>

<style scoped>
.alternar {
  display: inline-flex;
  padding: 3px;
  background: var(--superficie);
  border: 1px solid var(--borda-forte);
  border-radius: var(--raio);
}

.alternar__botao {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--texto-suave);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.alternar__botao svg {
  fill: currentColor;
}

.alternar__botao:hover {
  color: var(--roxo);
}

.alternar__botao[aria-pressed='true'] {
  background: var(--roxo);
  color: #fff;
}
</style>
