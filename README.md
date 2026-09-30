# Instituto Semente Ativa

Site de uma ONG de ação comunitária, feito como **SPA** (Single Page Application) em HTML5, CSS3 e JavaScript puro, sem frameworks e sem dependências. Apresenta a organização, lista os projetos e permite o cadastro de voluntários, com dados guardados no navegador.

- **Demonstração:** `https://giovannagabriela-creator.github.io/SementeAtiva/`
- **Status do build:** ![CI](https://github.com/GiovannaGabriela-creator/SementeAtiva/actions/workflows/ci-deploy.yml/badge.svg)

## Funcionalidades

- Navegação sem recarregar a página, por rotas com hash (`#/projetos`), com título da aba, foco e anúncio para leitores de tela a cada mudança.
- Sistema de templates em JavaScript (tag `html` com escape automático) e componentes reutilizáveis.
- Formulário de cadastro com máscaras (CPF, telefone, CEP), validação por campo, busca de endereço pelo CEP (ViaCEP), rascunho automático e confirmação antes de limpar.
- Armazenamento em `localStorage`: cadastros, rascunho, filtros de projetos e tema.
- Projetos com filtros por categoria e status (o filtro vira link compartilhável).
- Alertas, toasts, modal (`<dialog>`), badges de status e tema claro/escuro (sol/lua).
- Acessibilidade WCAG 2.1 AA (ver [docs/ACESSIBILIDADE.md](docs/ACESSIBILIDADE.md)).

## Requisitos

- [Node.js](https://nodejs.org) 22 ou superior (servidor local, build e testes). Não há pacotes a instalar: o projeto não tem dependências.
- Um navegador atual.

## Como executar

```bash
git clone https://github.com/GiovannaGabriela-creator/SementeAtiva.git
cd SementeAtiva
npm run dev          # abre em http://localhost:8080
```

O código-fonte usa módulos ES, que os navegadores bloqueiam ao abrir o arquivo direto (`file://`). Por isso é preciso um servidor local. Sem Node, serve `python -m http.server 8080`.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor local do código-fonte (porta 8080) |
| `npm test` | Testes unitários (14 testes, runner nativo do Node) |
| `npm run build` | Gera a versão de produção em `dist/` |
| `npm run preview` | Serve a pasta `dist/` (porta 8081) para conferir o build |

## Estrutura

```
index.html            casca da SPA (cabeçalho, <main id="app">, rodapé)
css/                  main.css (entrada) + tokens, base, layout, componentes, feedback, formulario, utilidades, responsivo
js/
  main.js             ponto de entrada: registra rotas e inicia tema, menu e roteador
  core/               router.js (rotas por hash) · template.js (tag html) · store.js (localStorage)
  data/               projetos.js · voluntarios.js (CRUD) · rascunho.js · opcoes.js
  validacao/          mascaras.js · validadores.js · formulario.js (controlador genérico)
  servicos/           viacep.js
  components/         templates reutilizáveis: badge, projetoCard, campos
  views/              inicio · projetos · cadastro · voluntarios · componentes · naoEncontrada
  ui/                 feedback.js (alerta, toast, modal) · tema.js · menu.js
img/                  logo e ilustração (SVG, WebP e PNG 1x/2x)
scripts/              build.mjs (build de produção) · serve.mjs (servidor estático)
tests/unit/           testes unitários · tests/a11y/ auditoria de acessibilidade (Playwright)
docs/                 acessibilidade, deploy e fluxo de Git
.github/              workflow de CI/deploy e modelos de pull request e issue
```

## Rotas

`#/` início · `#/projetos` (aceita `?categoria=` e `?status=`) · `#/cadastro` · `#/voluntarios` (cadastros salvos) · `#/componentes` (guia de componentes)

## Armazenamento (localStorage)

| Chave | Conteúdo |
| --- | --- |
| `semente-ativa:v1:voluntarios` | cadastros enviados |
| `semente-ativa:v1:rascunho-cadastro` | rascunho do formulário (nunca inclui CPF nem o aceite dos termos) |
| `semente-ativa:v1:filtros-projetos` | últimos filtros usados |
| `tema-semente-ativa` | tema escolhido (`claro` ou `escuro`) |

Os dados ficam só neste navegador; nada é enviado a um servidor, e o envio do cadastro é uma simulação. Na lista de cadastros o CPF aparece mascarado.

## Build e deploy

`npm run build` gera `dist/` com um CSS e um JS minificados e com hash no nome (cache de longo prazo), mais as imagens. A página passa de 36 para 5 requisições locais (CSS 21 KB e JS 52 KB, ou 5 KB e 15 KB com gzip). O resultado também abre por `file://`.

O deploy é automático no GitHub Pages: a cada push na `main`, o workflow `.github/workflows/ci-deploy.yml` roda os testes, o build e publica `dist/`. Passo a passo e alternativa com Netlify em [docs/DEPLOY.md](docs/DEPLOY.md).

## Como manter

- **Adicionar ou editar um projeto:** altere `js/data/projetos.js` (campos `categoria` e `status`; valores válidos em `js/data/opcoes.js`).
- **Adicionar uma página:** crie uma view em `js/views/` com `{ titulo, montar(raiz) }` e registre-a em `js/main.js` com `registrar('/caminho', view)`.
- **Adicionar um campo ao formulário:** use um template de `js/components/campos.js` em `js/views/cadastro.js` e inclua as regras em `regras`.
- **Mudar cores, fontes e espaçamentos:** `css/tokens.css` (tema claro e escuro). Ao alterar cores, rode a auditoria de contraste (`tests/a11y/README.md`).
- **Importante:** ao interpolar valores nos templates, booleanos não são impressos. Converta com `String(...)` quando o atributo precisar de `true` ou `false`.

## Contribuindo

Fluxo com branches, commits convencionais e pull requests em [CONTRIBUTING.md](CONTRIBUTING.md) e [docs/FLUXO-GIT.md](docs/FLUXO-GIT.md).

---

© 2026 Giovanna G.S Muniz. Todos os direitos reservados.
