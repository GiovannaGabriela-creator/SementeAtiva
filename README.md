# Instituto Semente Ativa

Site institucional de uma ONG de ação comunitária: apresentação, projetos e cadastro de voluntários.
HTML5 semântico, CSS3 (custom properties, grid, flexbox, `@layer`) e JavaScript sem dependências.

## Estrutura

```
index.html            casca da SPA (cabeçalho, <main id="app">, rodapé)
css/                  main.css (entrada) + tokens, base, layout, componentes, feedback, formulario, utilidades, responsivo
js/
  main.js             ponto de entrada: registra rotas e inicia tema, menu e roteador
  core/               router.js (rotas por hash) · template.js (tag html com escape) · store.js (localStorage)
  data/               projetos.js · voluntarios.js (CRUD) · rascunho.js · opcoes.js
  validacao/          mascaras.js · validadores.js · formulario.js (controlador genérico)
  servicos/           viacep.js
  components/         templates reutilizáveis: badge, projetoCard, campos
  views/              inicio · projetos · cadastro · voluntarios · componentes · naoEncontrada
  ui/                 feedback.js (alerta, toast, modal) · tema.js · menu.js
img/                  logo e ilustração (SVG, WebP e PNG 1x/2x)
```

## Rotas

`#/` início · `#/projetos` (aceita `?categoria=` e `?status=`) · `#/cadastro` · `#/voluntarios` · `#/componentes`

## Armazenamento (localStorage)

| Chave | Conteúdo |
| --- | --- |
| `semente-ativa:v1:voluntarios` | cadastros enviados |
| `semente-ativa:v1:rascunho-cadastro` | rascunho do formulário (sem CPF e sem aceite dos termos) |
| `semente-ativa:v1:filtros-projetos` | últimos filtros usados |
| `tema-semente-ativa` | tema escolhido (claro/escuro) |

Os dados ficam só no navegador; nada é enviado a um servidor. O envio do cadastro é uma simulação.

## Como abrir

O site usa módulos ES, então **não abre com duplo clique** (file://). Use um servidor local:

```
python -m http.server 8000     # e abra http://localhost:8000
```

ou a extensão Live Server do VS Code. Funciona em hospedagem estática, como o GitHub Pages.

## Componentes

Badges de status, alertas, toast, modal (`<dialog>` nativo) e alternador de tema (sol/lua). Exemplos na rota `#/componentes`.
Os status dos projetos (Ativo, Em andamento, Concluído) são provisórios: ajuste o campo `status` em `js/data/projetos.js`.

## Acessibilidade

Link de pular conteúdo, foco visível, `aria-*` nos formulários e no menu, mensagens de erro associadas
aos campos, contraste mínimo AA, alvos de toque de 44px e respeito a `prefers-reduced-motion`.

© 2026 Giovanna G.S Muniz. Todos os direitos reservados.
