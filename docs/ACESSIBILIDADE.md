# Acessibilidade (WCAG 2.1, nível AA)

Este documento registra o que foi verificado, como e o que foi corrigido.

## Como foi verificado

1. **Automatizado**: `tests/a11y/auditoria.py` (contraste, nomes acessíveis, ids, títulos, imagens, reflow) nas 5 rotas, temas claro e escuro, larguras de 1280px e 320px.
2. **Fluxos com teclado**: `tests/a11y/fluxos.py` (link de pular, foco, formulário, modal, filtros, tema).
3. **Revisão manual do código** contra os critérios da tabela abaixo.

Ferramentas automáticas cobrem só parte dos critérios. Antes de entregar, vale repetir uma passada manual com leitor de tela (NVDA no Windows, VoiceOver no macOS/iOS) e com zoom de 200%.

## Problemas encontrados e corrigidos

| Problema | Critério | Correção |
| --- | --- | --- |
| Botões de filtro sem `aria-pressed` válido: a tag `html` não imprime booleanos, então o atributo saía vazio | 4.1.2 Nome, função, valor | O valor passou a ser convertido com `String(...)` em `js/views/projetos.js` |
| Rolagem horizontal em 320px na grade de estatísticas | 1.4.10 Reflow | Colunas com `minmax(0, 1fr)` e uma coluna abaixo de 420px |
| Toast de erro sumia sozinho em 9 segundos | 2.2.1 Tempo ajustável | Toasts de erro ficam até serem fechados; os demais pausam com mouse ou foco |
| Botão de destaque com texto branco sobre laranja (3,3:1) | 1.4.3 Contraste | Texto escuro sobre o laranja (4,9:1) |
| Placeholder e bordas de campo com contraste baixo | 1.4.3 e 1.4.11 | Tokens `--cor-placeholder` e `--cor-borda-campo` |
| Mensagem de erro dizia "destacadas em vermelho" | 1.4.1 Uso de cor | Texto sem referência a cor; ícone, título e mensagem em cada campo |
| Erro do aceite dos termos nunca aparecia | 3.3.1 Identificação do erro | Campo dentro de `.campo[data-campo]`, com mensagem própria |
| Menu móvel com estilos inline e sem Esc | 2.1.1 e 2.4.3 | Classe CSS, Esc fecha e devolve o foco ao botão |

## Checklist por critério

| Critério | Situação | Como é atendido |
| --- | --- | --- |
| 1.1.1 Conteúdo não textual | Atende | Ilustração com `alt`; logo decorativo com `alt=""`; ícones com `aria-hidden` |
| 1.3.1 Informações e relações | Atende | Landmarks, hierarquia de títulos, `fieldset/legend`, tabela com `caption` e `scope` |
| 1.3.5 Finalidade da entrada | Atende | Atributos `autocomplete` nos campos pessoais e de endereço |
| 1.4.1 Uso de cor | Atende | Badges, alertas e erros têm texto e ícone; o estado nunca depende só de cor |
| 1.4.3 Contraste mínimo | Atende | Verificado por script nos dois temas |
| 1.4.4 Redimensionar texto | Atende | Medidas em `rem`; sem alturas fixas em texto |
| 1.4.10 Reflow | Atende | Sem rolagem horizontal em 320px; a tabela rola dentro do próprio contêiner |
| 1.4.11 Contraste não textual | Atende | Bordas de campo, foco e alternador de tema com contraste mínimo de 3:1 |
| 1.4.13 Conteúdo em hover ou foco | Atende | Toasts pausam e podem ser fechados |
| 2.1.1 Teclado | Atende | Tudo é operável por teclado; o modal usa `<dialog>` nativo |
| 2.2.1 Tempo ajustável | Atende | Ver tabela acima |
| 2.4.1 Ignorar blocos | Atende | Link "Pular para o conteúdo principal" |
| 2.4.2 Página com título | Atende | O título muda a cada rota |
| 2.4.3 Ordem do foco | Atende | Após a navegação o foco vai ao `<h1>`; ao fechar o modal volta ao acionador |
| 2.4.4 Finalidade do link | Atende | Textos descritivos ("Ver projetos de saúde") |
| 2.4.6 Títulos e rótulos | Atende | Rótulos visíveis em todos os campos |
| 2.4.7 Foco visível | Atende | Contorno global com `:focus-visible` |
| 3.1.1 Idioma da página | Atende | `lang="pt-BR"` |
| 3.2.2 Ao receber entrada | Atende | Nenhuma mudança de contexto automática |
| 3.3.1 e 3.3.3 Erros | Atende | Mensagem específica por campo, `aria-invalid`, foco no primeiro erro |
| 3.3.2 Rótulos ou instruções | Atende | Rótulo, exemplo no placeholder e indicação de campos opcionais |
| 4.1.2 Nome, função, valor | Atende | `aria-pressed`, `aria-expanded`, `aria-current`, `role="group"` |
| 4.1.3 Mensagens de status | Atende | Regiões `role="status"`, toasts e anúncio da mudança de rota |

## Limites conhecidos

- O envio do cadastro é uma simulação (sem servidor); a validação no servidor ficaria a cargo do back-end.
- As fontes vêm do Google Fonts; sem internet, o navegador usa as fontes do sistema (declaradas como reserva).
- Não foi feita bateria de testes com leitores de tela reais nem com outros navegadores além do Chromium.
