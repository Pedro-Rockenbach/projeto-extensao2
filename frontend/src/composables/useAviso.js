// Mensagem curta de confirmação exibida no rodapé da tela
// (ex.: "Projeto publicado."), compartilhada entre as telas.

import { ref } from 'vue'

const aviso = ref('')
let temporizador = null

export function useAviso() {
  function mostrarAviso(texto) {
    aviso.value = texto
    clearTimeout(temporizador)
    temporizador = setTimeout(() => (aviso.value = ''), 4000)
  }

  return { aviso, mostrarAviso }
}
