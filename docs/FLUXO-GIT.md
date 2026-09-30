# Fluxo de Git e GitHub

O repositório já vem com histórico organizado: commits convencionais na `main`, quatro branches de trabalho já mescladas (`fix/acessibilidade`, `feat/build-producao`, `ci/deploy-github-pages`, `docs/documentacao`) e a tag `v1.0.0`.

## 1. Publicar no GitHub (primeira vez)

Crie um repositório **vazio** em github.com (sem README, sem .gitignore) e depois:

```bash
git remote add origin https://github.com/SEU-USUARIO/semente-ativa.git
git push -u origin main --tags
git push origin fix/acessibilidade feat/build-producao ci/deploy-github-pages docs/documentacao
```

Para o site ir ao ar, ative o Pages: **Settings > Pages > Build and deployment > Source: GitHub Actions**. Veja [DEPLOY.md](DEPLOY.md).

### Trocar o e-mail dos commits (opcional, antes do primeiro push)

Os commits foram criados com o e-mail `seu-email@exemplo.com`. Para usar o seu:

```bash
git config user.name "Giovanna G.S Muniz"
git config user.email "seu-email-real@exemplo.com"
git rebase --root --rebase-merges --exec "git commit --amend --reset-author --no-edit"
```

Isso reescreve o histórico, então só faça antes de publicar.

## 2. Ciclo de trabalho com pull request

```bash
git switch main && git pull                 # começa da main atualizada
git switch -c feat/pagina-doacoes           # uma branch por tarefa
# ...edite, teste...
npm test && npm run build
git add js/views/doacoes.js
git commit -m "feat(views): adiciona página de doações"
git push -u origin feat/pagina-doacoes
gh pr create --fill                         # ou abra o PR pelo site do GitHub
```

Depois do PR aberto: o CI roda sozinho, uma pessoa revisa (comentários linha a linha), você corrige com novos commits e o merge acontece com o CI verde. Ao mesclar, o workflow publica a nova versão.

```bash
git switch main && git pull
git branch -d feat/pagina-doacoes           # apaga a branch local
```

Como as quatro branches que já vêm no repositório estão mescladas na `main`, um PR delas não teria diferenças. Para praticar o fluxo de revisão, abra uma branch nova, como acima.

## 3. Desfazer com segurança

| Situação | Comando |
| --- | --- |
| Descartar alterações ainda não commitadas em um arquivo | `git restore arquivo` |
| Tirar um arquivo do commit que vai ser feito | `git restore --staged arquivo` |
| Corrigir a mensagem do último commit (ainda não publicado) | `git commit --amend` |
| Desfazer um commit já publicado | `git revert <hash>` (cria um novo commit) |
| Ver o histórico | `git log --oneline --graph` |

## 4. Versões

Ao fechar um conjunto de mudanças: atualize o `CHANGELOG.md`, o `version` do `package.json` e crie a tag:

```bash
git tag -a v1.1.0 -m "v1.1.0"
git push origin v1.1.0
```
