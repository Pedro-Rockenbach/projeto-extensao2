<script setup>
// RF01: publicar projeto · RF04: validar formulário · RF05: editar projeto
// A mesma tela serve para criar (/projetos/novo) e editar (/projetos/:id/editar).
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import CampoFormulario from '@/components/CampoFormulario.vue'
import {
  AREAS_TEMATICAS,
  CAMPI,
  DIAS_SEMANA,
  LIMITES,
  SITUACOES,
  VINCULOS,
} from '@/constants/opcoes'
import { atualizarProjeto, buscarProjeto, criarProjeto } from '@/services/projetos'
import { validateProjeto } from '@shared/ProjetoValidator.js'
import { useAviso } from '@/composables/useAviso'
import { dataParaIso, formatarData } from '@/utils/formatacao'

const props = defineProps({
  id: { type: String, default: '' },
})

const router = useRouter()
const { mostrarAviso } = useAviso()

const editando = computed(() => Boolean(props.id))

function projetoVazio() {
  return {
    titulo: '',
    descricao: '',
    areaTematica: '',
    publicoAlvo: '',
    situacao: '',
    vagas: '',
    dataInicio: '',
    dataTermino: '',
    autorNome: '',
    autorCurso: '',
    autorVinculo: '',
    autorEmail: '',
    professorCoordenador: '',
    campus: '',
    local: '',
    diasSemana: [],
    horarioInicio: '',
    horarioTermino: '',
    comoInscrever: '',
    preRequisitos: '',
  }
}

const form = reactive(projetoVazio())
const carregando = ref(false)
const naoEncontrado = ref(false)
const erroCarregamento = ref('')
const salvando = ref(false)
const erroEnvio = ref('')

// No formulário as datas ficam no formato brasileiro (dd/mm/aaaa);
// a validação e a API usam aaaa-mm-dd
function comDatasIso(dados) {
  return {
    ...dados,
    dataInicio: dataParaIso(dados.dataInicio),
    dataTermino: dataParaIso(dados.dataTermino),
  }
}

// RF04: os erros aparecem depois que a pessoa sai do campo ou tenta enviar
const erros = computed(() => validateProjeto(comDatasIso(form)))
const tocados = reactive({})
const tentouEnviar = ref(false)

watch(
  () => props.id,
  async (id) => {
    Object.assign(form, projetoVazio())
    tentouEnviar.value = false
    for (const campo in tocados) delete tocados[campo]
    naoEncontrado.value = false
    erroCarregamento.value = ''
    if (!id) return

    carregando.value = true
    try {
      const projeto = await buscarProjeto(id)
      if (!projeto) naoEncontrado.value = true
      else
        Object.assign(form, {
          ...projeto,
          vagas: projeto.vagas ?? '',
          dataInicio: formatarData(projeto.dataInicio),
          dataTermino: formatarData(projeto.dataTermino),
        })
    } catch {
      erroCarregamento.value = 'Não foi possível carregar o projeto. Tente novamente mais tarde.'
    } finally {
      carregando.value = false
    }
  },
  { immediate: true },
)

function erro(campo) {
  return tentouEnviar.value || tocados[campo] ? (erros.value[campo] ?? '') : ''
}

function tocar(campo) {
  tocados[campo] = true
}

function formatarHorarioEntrada(valor) {
  const digitos = String(valor).replace(/\D/g, '').slice(0, 4)
  if (!digitos) return ''
  if (Number(digitos[0]) > 2) return ''

  let horario = digitos[0]
  if (digitos.length > 1) {
    const hora = Number(digitos.slice(0, 2))
    if (hora > 23) return digitos[0]
    horario += digitos[1]
  }
  if (digitos.length > 2) {
    if (Number(digitos[2]) > 5) return horario
    horario += `:${digitos[2]}`
  }
  if (digitos.length > 3) horario += digitos[3]
  return horario
}

// Máscara dd/mm/aaaa: só números, com as barras colocadas sozinhas
function formatarDataEntrada(valor) {
  const digitos = String(valor).replace(/\D/g, '').slice(0, 8)
  if (digitos.length <= 2) return digitos
  if (digitos.length <= 4) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`
}

const quantidadeErros = computed(() => Object.keys(erros.value).length)

function prepararDados() {
  const dados = comDatasIso(form)
  for (const campo in dados) {
    if (typeof dados[campo] === 'string') dados[campo] = dados[campo].trim()
  }
  dados.vagas = dados.vagas === '' ? null : Number(dados.vagas)
  dados.diasSemana = DIAS_SEMANA.map((d) => d.valor).filter((d) => form.diasSemana.includes(d))
  return dados
}

async function enviar() {
  tentouEnviar.value = true
  erroEnvio.value = ''

  if (quantidadeErros.value) {
    await nextTick()
    const primeiro = Object.keys(erros.value)[0]
    document.getElementById(`campo-${primeiro}`)?.focus()
    return
  }

  salvando.value = true
  try {
    const dados = prepararDados()
    const salvo = editando.value
      ? await atualizarProjeto(props.id, dados)
      : await criarProjeto(dados)
    mostrarAviso(editando.value ? 'Alterações salvas.' : 'Projeto publicado.')
    router.push({ name: 'detalhes-projeto', params: { id: salvo.id } })
  } catch {
    erroEnvio.value = 'Não foi possível salvar o projeto. Tente novamente.'
  } finally {
    salvando.value = false
  }
}

function cancelar() {
  if (editando.value) router.push({ name: 'detalhes-projeto', params: { id: props.id } })
  else router.push({ name: 'quadro' })
}
</script>

<template>
  <section class="pagina">
    <RouterLink
      :to="editando ? { name: 'detalhes-projeto', params: { id } } : { name: 'quadro' }"
      class="pagina__voltar"
    >
      ← {{ editando ? 'Voltar para o projeto' : 'Voltar para os projetos' }}
    </RouterLink>

    <h1 class="formulario__titulo">{{ editando ? 'Editar projeto' : 'Publicar projeto' }}</h1>
    <p class="formulario__intro">
      Campos marcados com <span class="formulario__asterisco">*</span> são obrigatórios.
    </p>

    <p v-if="carregando" class="estado">Carregando projeto…</p>

    <p v-else-if="erroCarregamento" class="estado" role="alert">{{ erroCarregamento }}</p>

    <div v-else-if="naoEncontrado" class="estado">
      <p>Este projeto não foi encontrado. Ele pode ter sido excluído.</p>
      <RouterLink to="/" class="botao botao--secundario">Ver todos os projetos</RouterLink>
    </div>

    <form v-else class="formulario" novalidate @submit.prevent="enviar">
      <div v-if="tentouEnviar && quantidadeErros" class="formulario__resumo" role="alert">
        {{
          quantidadeErros === 1
            ? 'Há 1 campo para corrigir.'
            : `Há ${quantidadeErros} campos para corrigir.`
        }}
        Confira as mensagens em vermelho.
      </div>

      <fieldset class="secao">
        <legend class="secao__titulo">Sobre o projeto</legend>
        <div class="secao__campos">
          <CampoFormulario
            id="campo-titulo"
            rotulo="Título do projeto"
            obrigatorio
            largo
            :erro="erro('titulo')"
            :contador="`${form.titulo.length}/${LIMITES.titulo}`"
          >
            <template #default="{ id, descricao, invalido }">
              <input
                :id="id"
                v-model="form.titulo"
                type="text"
                :maxlength="LIMITES.titulo"
                :aria-invalid="invalido"
                :aria-describedby="descricao"
                @blur="tocar('titulo')"
              />
            </template>
          </CampoFormulario>

          <CampoFormulario
            id="campo-descricao"
            rotulo="Descrição"
            obrigatorio
            largo
            :erro="erro('descricao')"
            dica="Explique os objetivos e as atividades do projeto."
            :contador="`${form.descricao.length}/${LIMITES.descricao}`"
          >
            <template #default="{ id, descricao, invalido }">
              <textarea
                :id="id"
                v-model="form.descricao"
                :maxlength="LIMITES.descricao"
                :aria-invalid="invalido"
                :aria-describedby="descricao"
                @blur="tocar('descricao')"
              ></textarea>
            </template>
          </CampoFormulario>

          <CampoFormulario
            id="campo-areaTematica"
            rotulo="Área temática"
            obrigatorio
            :erro="erro('areaTematica')"
          >
            <template #default="{ id, descricao, invalido }">
              <select
                :id="id"
                v-model="form.areaTematica"
                :aria-invalid="invalido"
                :aria-describedby="descricao"
                @blur="tocar('areaTematica')"
              >
                <option value="" disabled>Selecione</option>
                <option v-for="area in AREAS_TEMATICAS" :key="area" :value="area">{{ area }}</option>
              </select>
            </template>
          </CampoFormulario>

          <CampoFormulario
            id="campo-situacao"
            rotulo="Situação"
            obrigatorio
            :erro="erro('situacao')"
          >
            <template #default="{ id, descricao, invalido }">
              <select
                :id="id"
                v-model="form.situacao"
                :aria-invalid="invalido"
                :aria-describedby="descricao"
                @blur="tocar('situacao')"
              >
                <option value="" disabled>Selecione</option>
                <option v-for="s in SITUACOES" :key="s.valor" :value="s.valor">{{ s.rotulo }}</option>
              </select>
            </template>
          </CampoFormulario>

          <CampoFormulario
            id="campo-publicoAlvo"
            rotulo="Público-alvo"
            obrigatorio
            :erro="erro('publicoAlvo')"
            dica="Ex.: alunos do ensino médio, comunidade externa."
          >
            <template #default="{ id, descricao, invalido }">
              <input
                :id="id"
                v-model="form.publicoAlvo"
                type="text"
                :maxlength="LIMITES.publicoAlvo"
                :aria-invalid="invalido"
                :aria-describedby="descricao"
                @blur="tocar('publicoAlvo')"
              />
            </template>
          </CampoFormulario>

          <CampoFormulario id="campo-vagas" rotulo="Número de vagas" :erro="erro('vagas')">
            <template #default="{ id, descricao, invalido }">
              <input
                :id="id"
                v-model="form.vagas"
                type="number"
                min="1"
                step="1"
                inputmode="numeric"
                :aria-invalid="invalido"
                :aria-describedby="descricao"
                @blur="tocar('vagas')"
              />
            </template>
          </CampoFormulario>

          <CampoFormulario
            id="campo-dataInicio"
            rotulo="Data de início"
            obrigatorio
            :erro="erro('dataInicio')"
          >
            <template #default="{ id, descricao, invalido }">
              <input
                :id="id"
                v-model="form.dataInicio"
                type="text"
                inputmode="numeric"
                autocomplete="off"
                placeholder="DD/MM/AAAA"
                maxlength="10"
                :aria-invalid="invalido"
                :aria-describedby="descricao"
                @input="form.dataInicio = formatarDataEntrada($event.target.value)"
                @blur="tocar('dataInicio')"
              />
            </template>
          </CampoFormulario>

          <CampoFormulario
            id="campo-dataTermino"
            rotulo="Data de término"
            :erro="erro('dataTermino')"
          >
            <template #default="{ id, descricao, invalido }">
              <input
                :id="id"
                v-model="form.dataTermino"
                type="text"
                inputmode="numeric"
                autocomplete="off"
                placeholder="DD/MM/AAAA"
                maxlength="10"
                :aria-invalid="invalido"
                :aria-describedby="descricao"
                @input="form.dataTermino = formatarDataEntrada($event.target.value)"
                @blur="tocar('dataTermino')"
              />
            </template>
          </CampoFormulario>
        </div>
      </fieldset>

      <fieldset class="secao">
        <legend class="secao__titulo">Sobre quem publica</legend>
        <div class="secao__campos">
          <CampoFormulario id="campo-autorNome" rotulo="Nome" obrigatorio :erro="erro('autorNome')">
            <template #default="{ id, descricao, invalido }">
              <input
                :id="id"
                v-model="form.autorNome"
                :maxlength="LIMITES.autorNome"
                type="text"
                autocomplete="name"
                :aria-invalid="invalido"
                :aria-describedby="descricao"
                @blur="tocar('autorNome')"
              />
            </template>
          </CampoFormulario>

          <CampoFormulario id="campo-autorCurso" rotulo="Curso" obrigatorio :erro="erro('autorCurso')">
            <template #default="{ id, descricao, invalido }">
              <input
                :id="id"
                v-model="form.autorCurso"
                :maxlength="LIMITES.autorCurso"
                type="text"
                :aria-invalid="invalido"
                :aria-describedby="descricao"
                @blur="tocar('autorCurso')"
              />
            </template>
          </CampoFormulario>

          <CampoFormulario
            id="campo-autorVinculo"
            rotulo="Vínculo"
            obrigatorio
            :erro="erro('autorVinculo')"
          >
            <template #default="{ id, descricao, invalido }">
              <select
                :id="id"
                v-model="form.autorVinculo"
                :aria-invalid="invalido"
                :aria-describedby="descricao"
                @blur="tocar('autorVinculo')"
              >
                <option value="" disabled>Selecione</option>
                <option v-for="v in VINCULOS" :key="v" :value="v">{{ v }}</option>
              </select>
            </template>
          </CampoFormulario>

          <CampoFormulario
            id="campo-autorEmail"
            rotulo="E-mail para contato"
            obrigatorio
            :erro="erro('autorEmail')"
          >
            <template #default="{ id, descricao, invalido }">
              <input
                :id="id"
                v-model="form.autorEmail"
                :maxlength="LIMITES.autorEmail"
                type="email"
                autocomplete="email"
                :aria-invalid="invalido"
                :aria-describedby="descricao"
                @blur="tocar('autorEmail')"
              />
            </template>
          </CampoFormulario>

          <CampoFormulario
            id="campo-professorCoordenador"
            rotulo="Professor coordenador"
            obrigatorio
            largo
            :erro="erro('professorCoordenador')"
          >
            <template #default="{ id, descricao, invalido }">
              <input
                :id="id"
                v-model="form.professorCoordenador"
                :maxlength="LIMITES.professorCoordenador"
                type="text"
                :aria-invalid="invalido"
                :aria-describedby="descricao"
                @blur="tocar('professorCoordenador')"
              />
            </template>
          </CampoFormulario>
        </div>
      </fieldset>

      <fieldset class="secao">
        <legend class="secao__titulo">Onde e quando acontece</legend>
        <div class="secao__campos">
          <CampoFormulario id="campo-campus" rotulo="Campus" obrigatorio :erro="erro('campus')">
            <template #default="{ id, descricao, invalido }">
              <select
                :id="id"
                v-model="form.campus"
                :aria-invalid="invalido"
                :aria-describedby="descricao"
                @blur="tocar('campus')"
              >
                <option value="" disabled>Selecione</option>
                <option v-for="c in CAMPI" :key="c" :value="c">{{ c }}</option>
              </select>
            </template>
          </CampoFormulario>

          <CampoFormulario id="campo-local" rotulo="Sala ou local" obrigatorio :erro="erro('local')">
            <template #default="{ id, descricao, invalido }">
              <input
                :id="id"
                v-model="form.local"
                :maxlength="LIMITES.local"
                type="text"
                :aria-invalid="invalido"
                :aria-describedby="descricao"
                @blur="tocar('local')"
              />
            </template>
          </CampoFormulario>

          <fieldset
            class="dias"
            :class="{ 'dias--invalido': erro('diasSemana') }"
            :aria-describedby="erro('diasSemana') ? 'campo-diasSemana-erro' : undefined"
          >
            <legend class="dias__rotulo">
              Dias da semana <span class="formulario__asterisco" aria-hidden="true">*</span>
            </legend>
            <div class="dias__opcoes">
              <label v-for="(dia, i) in DIAS_SEMANA" :key="dia.valor" class="dias__opcao">
                <input
                  :id="i === 0 ? 'campo-diasSemana' : undefined"
                  v-model="form.diasSemana"
                  type="checkbox"
                  :value="dia.valor"
                  @change="tocar('diasSemana')"
                />
                <span>{{ dia.rotulo }}</span>
              </label>
            </div>
            <p v-if="erro('diasSemana')" id="campo-diasSemana-erro" class="dias__erro">
              {{ erro('diasSemana') }}
            </p>
          </fieldset>

          <CampoFormulario
            id="campo-horarioInicio"
            rotulo="Horário de início"
            obrigatorio
            :erro="erro('horarioInicio')"
          >
            <template #default="{ id, descricao, invalido }">
              <input
                :id="id"
                v-model="form.horarioInicio"
                type="text"
                inputmode="numeric"
                autocomplete="off"
                placeholder="HH:MM"
                maxlength="5"
                pattern="(?:[01]\d|2[0-3]):[0-5]\d"
                :aria-invalid="invalido"
                :aria-describedby="descricao"
                @input="form.horarioInicio = formatarHorarioEntrada($event.target.value)"
                @blur="tocar('horarioInicio')"
              />
            </template>
          </CampoFormulario>

          <CampoFormulario
            id="campo-horarioTermino"
            rotulo="Horário de término"
            obrigatorio
            :erro="erro('horarioTermino')"
          >
            <template #default="{ id, descricao, invalido }">
              <input
                :id="id"
                v-model="form.horarioTermino"
                type="text"
                inputmode="numeric"
                autocomplete="off"
                placeholder="HH:MM"
                maxlength="5"
                pattern="(?:[01]\d|2[0-3]):[0-5]\d"
                :aria-invalid="invalido"
                :aria-describedby="descricao"
                @input="form.horarioTermino = formatarHorarioEntrada($event.target.value)"
                @blur="tocar('horarioTermino')"
              />
            </template>
          </CampoFormulario>
        </div>
      </fieldset>

      <fieldset class="secao">
        <legend class="secao__titulo">Como participar</legend>
        <div class="secao__campos">
          <CampoFormulario
            id="campo-comoInscrever"
            rotulo="Como se inscrever"
            largo
            dica="Pode ser um texto ou um link (ex.: https://forms.gle/...). Links ficam clicáveis na página do projeto."
          >
            <template #default="{ id, descricao }">
              <input
                :id="id"
                v-model="form.comoInscrever"
                type="text"
                :maxlength="LIMITES.comoInscrever"
                :aria-describedby="descricao"
              />
            </template>
          </CampoFormulario>

          <CampoFormulario id="campo-preRequisitos" rotulo="Pré-requisitos" largo>
            <template #default="{ id, descricao }">
              <textarea
                :id="id"
                v-model="form.preRequisitos"
                rows="3"
                :maxlength="LIMITES.preRequisitos"
                class="formulario__texto-curto"
                :aria-describedby="descricao"
              ></textarea>
            </template>
          </CampoFormulario>
        </div>
      </fieldset>

      <p v-if="erroEnvio" class="formulario__resumo" role="alert">{{ erroEnvio }}</p>

      <div class="formulario__acoes">
        <button type="button" class="botao botao--secundario" :disabled="salvando" @click="cancelar">
          Cancelar
        </button>
        <button type="submit" class="botao botao--primario" :disabled="salvando">
          <template v-if="salvando">Salvando…</template>
          <template v-else>{{ editando ? 'Salvar alterações' : 'Publicar projeto' }}</template>
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.formulario__titulo {
  font-size: 1.6rem;
}

.formulario__intro {
  margin: 4px 0 24px;
  color: var(--texto-suave);
  font-size: 0.9rem;
}

.formulario__asterisco {
  color: var(--rosa);
  font-weight: 600;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.formulario__resumo {
  margin: 0;
  padding: 12px 16px;
  border-left: 4px solid var(--vermelho);
  border-radius: var(--raio);
  background: var(--vermelho-fundo);
  color: var(--vermelho);
  font-weight: 500;
  font-size: 0.9rem;
}

.secao {
  margin: 0;
  padding: 24px 28px 28px;
  min-width: 0;
  background: var(--superficie);
  border: 1px solid var(--borda);
  border-radius: var(--raio);
  box-shadow: var(--sombra);
}

.secao__titulo {
  float: left;
  width: 100%;
  margin-bottom: 20px;
  padding: 0 0 12px;
  border-bottom: 1px solid var(--borda);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--rosa);
}

.secao__campos {
  clear: both;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 24px;
}

.formulario__texto-curto {
  min-height: 90px !important;
}

/* Dias da semana */

.dias {
  grid-column: 1 / -1;
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;
}

.dias__rotulo {
  padding: 0;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 0.9rem;
}

.dias__opcoes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dias__opcao {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border: 1px solid var(--borda-forte);
  border-radius: var(--raio);
  background: var(--superficie);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
}

.dias__opcao:hover {
  border-color: var(--roxo-medio);
}

.dias__opcao:has(input:checked) {
  background: var(--roxo-claro);
  border-color: var(--roxo);
  color: var(--roxo);
}

.dias__opcao:has(input:focus-visible) {
  outline: 3px solid var(--roxo-medio);
  outline-offset: 2px;
}

.dias__opcao input {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: var(--roxo);
}

.dias--invalido .dias__opcao {
  border-color: var(--vermelho);
}

.dias__erro {
  margin: 6px 0 0;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--vermelho);
}

.formulario__acoes {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .secao {
    padding: 20px 16px;
  }

  .secao__campos {
    grid-template-columns: 1fr;
  }

  .formulario__acoes .botao {
    flex: 1;
  }
}
</style>
