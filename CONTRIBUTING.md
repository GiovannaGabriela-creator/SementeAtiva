# Guia de contribuição

## Preparar o ambiente

```bash
git clone https://github.com/GiovannaGabriela-creator/SementeAtiva.git
cd SementeAtiva
npm test && npm run dev
```

## Branches

Nunca trabalhe direto na `main`. Crie uma branch a partir dela, com um prefixo que diga o tipo de trabalho:

| Prefixo | Uso | Exemplo |
| --- | --- | --- |
| `feat/` | nova funcionalidade | `feat/pagina-doacoes` |
| `fix/` | correção de erro | `fix/mascara-telefone` |
| `docs/` | documentação | `docs/atualiza-readme` |
| `ci/` `chore/` | automação e manutenção | `ci/cache-do-build` |

## Commits

Mensagens no formato [Conventional Commits](https://www.conventionalcommits.org/pt-br/), no imperativo e em português:

```
tipo(escopo): resumo curto, até 72 caracteres

Corpo opcional explicando o porquê da mudança.
```

Tipos usados: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `build`, `ci`, `chore`. Faça commits pequenos, cada um com uma mudança coerente. Exemplo: `fix(a11y): converte aria-pressed dos filtros para texto`.

## Pull requests

1. Atualize sua branch com a `main` e rode `npm test` e `npm run build`.
2. Se mexeu em interface, rode a auditoria de acessibilidade (`tests/a11y/README.md`) e teste com o teclado.
3. Abra o PR preenchendo o modelo: o que mudou, por quê e como testar.
4. Peça revisão de outra pessoa. Responda cada comentário com um commit ou uma justificativa.
5. Faça o merge só com o CI verde. Prefira "Squash and merge" para PRs com muitos commits de ajuste, ou "Create a merge commit" para preservar commits bem escritos.

## Revisando um PR

- O código está organizado na pasta certa (`core`, `data`, `validacao`, `components`, `views`, `ui`)?
- Tem teste para a regra nova? Os testes antigos continuam passando?
- Textos interpolados nos templates passam pela tag `html` (sem `innerHTML` com dados de usuário)?
- Acessibilidade: rótulo em todo controle, foco visível, contraste, nada que dependa só de cor, mensagens de erro claras.
- A documentação (README, CHANGELOG) foi atualizada?

## Estilo de código

Siga o `.editorconfig` (UTF-8, 2 espaços, LF). JavaScript em módulos ES, nomes e comentários em português, funções curtas e sem variáveis globais.
