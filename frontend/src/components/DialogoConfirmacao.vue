<script setup>
import { useTemplateRef, watch } from 'vue'

const props = defineProps({
  aberto: { type: Boolean, default: false },
  titulo: { type: String, required: true },
  textoConfirmar: { type: String, default: 'Confirmar' },
  ocupado: { type: Boolean, default: false },
})

const emit = defineEmits(['confirmar', 'cancelar'])

const dialogo = useTemplateRef('dialogo')

watch(
  () => props.aberto,
  (aberto) => {
    if (aberto && !dialogo.value.open) dialogo.value.showModal()
    if (!aberto && dialogo.value.open) dialogo.value.close()
  },
)
</script>

<template>
  <dialog
    ref="dialogo"
    class="dialogo"
    aria-labelledby="dialogo-titulo"
    @cancel.prevent="emit('cancelar')"
  >
    <h2 id="dialogo-titulo" class="dialogo__titulo">{{ titulo }}</h2>
    <div class="dialogo__corpo">
      <slot />
    </div>
    <div class="dialogo__acoes">
      <button type="button" class="botao botao--secundario" :disabled="ocupado" @click="emit('cancelar')">
        Cancelar
      </button>
      <button type="button" class="botao botao--perigo-cheio" :disabled="ocupado" @click="emit('confirmar')">
        {{ textoConfirmar }}
      </button>
    </div>
  </dialog>
</template>

<style scoped>
.dialogo {
  width: min(460px, calc(100% - 32px));
  padding: 24px;
  border: 0;
  border-radius: var(--raio);
  box-shadow: 0 12px 40px rgb(42 36 51 / 0.25);
  color: var(--texto);
}

.dialogo::backdrop {
  background: rgb(42 36 51 / 0.45);
}

.dialogo__titulo {
  font-size: 1.15rem;
  margin-bottom: 8px;
}

.dialogo__corpo {
  color: var(--texto-suave);
}

.dialogo__corpo :deep(p) {
  margin: 0 0 8px;
}

.dialogo__acoes {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
}
</style>
