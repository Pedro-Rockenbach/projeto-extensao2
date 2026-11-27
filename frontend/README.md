# frontend

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Tela de perfil

A tela autenticada do perfil fica em `src/views/PerfilView.vue` e é acessada pela rota `/perfil`.

### O que foi implementado

- Exibe iniciais do usuário, nome, e-mail, curso e tipo de vínculo.
- Permite editar nome, curso e vínculo, com feedback de carregamento, erro e sucesso.
- Inclui formulário de alteração de senha, com confirmação e validação mínima.
- Oferece logout usando o serviço de sessão existente.
- Adiciona o link “Meu perfil” no cabeçalho para usuários autenticados.
- Protege `/perfil` pelo guard de autenticação do roteador. Visitantes são enviados ao login e retornam ao perfil após entrar.
- Mantém chamadas de perfil isoladas em `src/services/perfil.js` e atualiza o usuário em `useSessao` após salvar.

### Integração com a API

- `PATCH /sessao/perfil` atualiza nome, curso e vínculo do usuário identificado pela sessão atual. O e-mail é somente leitura.
- A sessão usa cookie `httpOnly`; o frontend não armazena token em `localStorage`.
- A chamada de alteração de senha está preparada para `PUT /sessao/senha`, mas esse endpoint ainda precisa ser implementado no backend. Enquanto isso, a interface informa que a função não está disponível.

### Arquivos relacionados

- `src/views/PerfilView.vue` — interface do perfil.
- `src/services/perfil.js` — atualização do perfil e chamada preparada para alteração de senha.
- `src/router/index.js` — rota e proteção de autenticação.
- `src/components/AppCabecalho.vue` — link para o perfil.
- `src/composables/useSessao.js` — atualização do usuário na sessão do frontend.
