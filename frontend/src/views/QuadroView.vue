<script setup>
// RF02: quadro de projetos, do mais recente para o mais antigo,
// em grade de cards ou em lista de linhas.
import { onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import AlternarVisualizacao from '@/components/AlternarVisualizacao.vue'
import ProjetoCard from '@/components/ProjetoCard.vue'
import ProjetoLinha from '@/components/ProjetoLinha.vue'
import { listarProjetos } from '@/services/projetos'

const CHAVE_MODO = 'projetos-extensao:visualizacao'

function modoSalvo() {
  try {
    return localStorage.getItem(CHAVE_MODO) === 'lista' ? 'lista' : 'grade'
  } catch {
    return 'grade'
  }
}

const modo = ref(modoSalvo())
watch(modo, (valor) => {
  try {
    localStorage.setItem(CHAVE_MODO, valor)
  } catch {
    // preferência só não fica salva
  }
})

const projetos = ref([])
const carregando = ref(true)
const erro = ref('')

onMounted(async () => {
  try {
    projetos.value = await listarProjetos()
  } catch {
    erro.value = 'Não foi possível carregar os projetos. Tente novamente mais tarde.'
  } finally {
    carregando.value = false
  }
})
</script>

<template>
  <section class="pagina">
    <div class="quadro__cabecalho">
      <div>
        <h1 class="quadro__titulo">Projetos de extensão</h1>
        <p v-if="!carregando && !erro" class="quadro__contagem">
          {{ projetos.length }} {{ projetos.length === 1 ? 'projeto publicado' : 'projetos publicados' }}
          · do mais recente para o mais antigo
        </p>
      </div>
      <AlternarVisualizacao v-if="projetos.length" v-model="modo" />
    </div>

    <p v-if="carregando" class="estado">Carregando projetos…</p>

    <p v-else-if="erro" class="estado" role="alert">{{ erro }}</p>

    <div v-else-if="!projetos.length" class="estado">
      <p>Nenhum projeto publicado ainda.</p>
      <RouterLink :to="{ name: 'novo-projeto' }" class="botao botao--primario">
        Publicar o primeiro projeto
      </RouterLink>
    </div>

    <ul v-else-if="modo === 'grade'" class="grade">
      <li v-for="projeto in projetos" :key="projeto.id">
        <ProjetoCard :projeto="projeto" />
      </li>
    </ul>

    <div v-else class="lista">
      <div class="lista__cabecalho" aria-hidden="true">
        <span>Projeto</span>
        <span>Situação</span>
        <span>Campus</span>
        <span>Período</span>
      </div>
      <ul class="lista__itens">
        <ProjetoLinha v-for="projeto in projetos" :key="projeto.id" :projeto="projeto" />
      </ul>
    </div>
  </section>
</template>

<style scoped>
.quadro__cabecalho {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.quadro__titulo {
  font-size: 1.6rem;
}

.quadro__contagem {
  margin: 4px 0 0;
  color: var(--texto-suave);
  font-size: 0.9rem;
}

.grade {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
  gap: 20px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.grade > li {
  display: flex;
}

.grade > li > * {
  flex: 1;
}

.lista {
  --colunas-lista: minmax(0, 2.4fr) 170px 180px 200px;
  background: var(--superficie);
  border: 1px solid var(--borda);
  border-radius: var(--raio);
  box-shadow: var(--sombra);
  overflow: hidden;
}

.lista__cabecalho {
  display: grid;
  grid-template-columns: var(--colunas-lista);
  gap: 16px;
  padding: 10px 20px;
  background: var(--roxo-claro);
  border-bottom: 1px solid var(--borda);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--roxo);
}

.lista__itens {
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (max-width: 760px) {
  .lista__cabecalho {
    display: none;
  }
}
</style>
