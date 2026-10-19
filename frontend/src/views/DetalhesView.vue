<script setup>
// RF03: detalhes do projeto com todos os campos.
// RF06: exclusão com confirmação.
import { computed, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import DialogoConfirmacao from '@/components/DialogoConfirmacao.vue'
import SituacaoEtiqueta from '@/components/SituacaoEtiqueta.vue'
import { buscarProjeto, excluirProjeto } from '@/services/projetos'
import { useAviso } from '@/composables/useAviso'
import {
  formatarData,
  formatarDias,
  formatarHorario,
  separarLinks,
} from '@/utils/formatacao'

const props = defineProps({
  id: { type: String, required: true },
})

const router = useRouter()
const { mostrarAviso } = useAviso()

const projeto = ref(null)
const carregando = ref(true)
const erro = ref('')

watch(
  () => props.id,
  async (id) => {
    carregando.value = true
    erro.value = ''
    try {
      projeto.value = await buscarProjeto(id)
    } catch {
      erro.value = 'Não foi possível carregar o projeto. Tente novamente mais tarde.'
    } finally {
      carregando.value = false
    }
  },
  { immediate: true },
)

const inscricao = computed(() => separarLinks(projeto.value?.comoInscrever))

const confirmandoExclusao = ref(false)
const excluindo = ref(false)

async function confirmarExclusao() {
  excluindo.value = true
  try {
    await excluirProjeto(projeto.value.id)
    confirmandoExclusao.value = false
    mostrarAviso('Projeto excluído.')
    router.push({ name: 'quadro' })
  } catch {
    mostrarAviso('Não foi possível excluir o projeto.')
  } finally {
    excluindo.value = false
  }
}
</script>

<template>
  <section class="pagina">
    <RouterLink to="/" class="pagina__voltar">← Voltar para os projetos</RouterLink>

    <p v-if="carregando" class="estado">Carregando projeto…</p>

    <p v-else-if="erro" class="estado" role="alert">{{ erro }}</p>

    <div v-else-if="!projeto" class="estado">
      <p>Este projeto não foi encontrado. Ele pode ter sido excluído.</p>
      <RouterLink to="/" class="botao botao--secundario">Ver todos os projetos</RouterLink>
    </div>

    <article v-else class="detalhes">
      <header class="detalhes__cabecalho">
        <div class="detalhes__etiquetas">
          <SituacaoEtiqueta :situacao="projeto.situacao" />
          <span class="detalhes__area">{{ projeto.areaTematica }}</span>
        </div>
        <h1 class="detalhes__titulo">{{ projeto.titulo }}</h1>
        <p class="detalhes__publicado">
          Publicado em {{ formatarData(projeto.criadoEm.slice(0, 10)) }}
          <template v-if="projeto.atualizadoEm">
            · atualizado em {{ formatarData(projeto.atualizadoEm.slice(0, 10)) }}
          </template>
        </p>
        <div class="detalhes__acoes">
          <RouterLink
            :to="{ name: 'editar-projeto', params: { id: projeto.id } }"
            class="botao botao--secundario"
          >
            Editar
          </RouterLink>
          <button type="button" class="botao botao--perigo" @click="confirmandoExclusao = true">
            Excluir
          </button>
        </div>
      </header>

      <div class="detalhes__corpo">
        <section class="secao secao--larga">
          <h2 class="secao__titulo">Sobre o projeto</h2>
          <p class="detalhes__descricao">{{ projeto.descricao }}</p>
          <dl class="ficha">
            <div>
              <dt>Área temática</dt>
              <dd>{{ projeto.areaTematica }}</dd>
            </div>
            <div>
              <dt>Público-alvo</dt>
              <dd>{{ projeto.publicoAlvo }}</dd>
            </div>
            <div>
              <dt>Número de vagas</dt>
              <dd>{{ projeto.vagas || 'Não informado' }}</dd>
            </div>
            <div>
              <dt>Data de início</dt>
              <dd>{{ formatarData(projeto.dataInicio) }}</dd>
            </div>
            <div>
              <dt>Data de término</dt>
              <dd>{{ formatarData(projeto.dataTermino) || 'Não informada' }}</dd>
            </div>
          </dl>
        </section>

        <section class="secao">
          <h2 class="secao__titulo">Onde e quando acontece</h2>
          <dl class="ficha ficha--coluna">
            <div>
              <dt>Campus</dt>
              <dd>{{ projeto.campus }}</dd>
            </div>
            <div>
              <dt>Sala ou local</dt>
              <dd>{{ projeto.local }}</dd>
            </div>
            <div>
              <dt>Dias da semana</dt>
              <dd>{{ formatarDias(projeto.diasSemana) }}</dd>
            </div>
            <div>
              <dt>Horário</dt>
              <dd>{{ formatarHorario(projeto.horarioInicio, projeto.horarioTermino) }}</dd>
            </div>
          </dl>
        </section>

        <section class="secao">
          <h2 class="secao__titulo">Como participar</h2>
          <dl class="ficha ficha--coluna">
            <div>
              <dt>Como se inscrever</dt>
              <dd v-if="inscricao.length" class="detalhes__quebra">
                <template v-for="(parte, i) in inscricao" :key="i">
                  <a v-if="parte.link" :href="parte.texto" target="_blank" rel="noopener noreferrer">{{
                    parte.texto
                  }}</a>
                  <template v-else>{{ parte.texto }}</template>
                </template>
              </dd>
              <dd v-else>Não informado</dd>
            </div>
            <div>
              <dt>Pré-requisitos</dt>
              <dd>{{ projeto.preRequisitos || 'Nenhum' }}</dd>
            </div>
          </dl>
        </section>

        <section class="secao secao--larga">
          <h2 class="secao__titulo">Sobre quem publica</h2>
          <dl class="ficha">
            <div>
              <dt>Nome</dt>
              <dd>{{ projeto.autorNome }}</dd>
            </div>
            <div>
              <dt>Curso</dt>
              <dd>{{ projeto.autorCurso }}</dd>
            </div>
            <div>
              <dt>Vínculo</dt>
              <dd>{{ projeto.autorVinculo }}</dd>
            </div>
            <div>
              <dt>E-mail para contato</dt>
              <dd class="detalhes__quebra">
                <a :href="`mailto:${projeto.autorEmail}`">{{ projeto.autorEmail }}</a>
              </dd>
            </div>
            <div>
              <dt>Professor coordenador</dt>
              <dd>{{ projeto.professorCoordenador }}</dd>
            </div>
          </dl>
        </section>
      </div>
    </article>

    <DialogoConfirmacao
      :aberto="confirmandoExclusao"
      titulo="Excluir projeto?"
      texto-confirmar="Sim, excluir"
      :ocupado="excluindo"
      @confirmar="confirmarExclusao"
      @cancelar="confirmandoExclusao = false"
    >
      <p>
        O projeto <strong>{{ projeto?.titulo }}</strong> será excluído e deixará de aparecer no quadro.
      </p>
      <p>Esta ação não pode ser desfeita.</p>
    </DialogoConfirmacao>
  </section>
</template>

<style scoped>
.detalhes {
  background: var(--superficie);
  border: 1px solid var(--borda);
  border-radius: var(--raio);
  box-shadow: var(--sombra);
}

.detalhes__cabecalho {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px 24px;
  padding: 28px;
  border-bottom: 1px solid var(--borda);
  border-top: 4px solid var(--roxo);
  border-radius: var(--raio) var(--raio) 0 0;
}

.detalhes__etiquetas {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.detalhes__area {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--roxo-medio);
}

.detalhes__titulo {
  font-size: 1.7rem;
  overflow-wrap: anywhere;
}

.detalhes__publicado {
  grid-column: 1;
  margin: 0;
  color: var(--texto-suave);
  font-size: 0.85rem;
}

.detalhes__acoes {
  grid-column: 2;
  grid-row: 2 / span 2;
  align-self: start;
  display: flex;
  gap: 10px;
}

.detalhes__corpo {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.secao {
  padding: 24px 28px;
  border-bottom: 1px solid var(--borda);
  min-width: 0;
}

.secao:nth-child(2) {
  border-right: 1px solid var(--borda);
}

.secao:last-child {
  border-bottom: 0;
}

.secao--larga {
  grid-column: 1 / -1;
}

.secao__titulo {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--rosa);
  margin-bottom: 16px;
}

.detalhes__descricao {
  margin: 0 0 20px;
  white-space: pre-line;
  max-width: 75ch;
  overflow-wrap: anywhere;
}

.ficha {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(200px, 100%), 1fr));
  gap: 16px 24px;
  margin: 0;
}

.ficha--coluna {
  grid-template-columns: 1fr;
}

.ficha dt {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--texto-suave);
  margin-bottom: 2px;
}

.ficha dd {
  margin: 0;
  font-weight: 500;
}

.detalhes__quebra {
  overflow-wrap: anywhere;
}

@media (max-width: 760px) {
  .detalhes__cabecalho {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  .detalhes__acoes {
    grid-column: 1;
    grid-row: auto;
  }

  .detalhes__corpo {
    grid-template-columns: 1fr;
  }

  .secao {
    padding: 20px;
  }

  .secao:nth-child(2) {
    border-right: 0;
  }
}
</style>
