# Fluxo de Git e GitHub

O repositório já vem com histórico organizado: commits convencionais na `main`, quatro branches de trabalho já mescladas (`fix/acessibilidade`, `feat/build-producao`, `ci/deploy-github-pages`, `docs/documentacao`) e a tag `v1.0.0`.

## 1. Publicar no GitHub (primeira vez)

Crie um repositório **vazio** em github.com (sem README, sem .gitignore) e depois:

```bash
git remote add origin https://github.com/GiovannaGabriela-creator/SementeAtiva.git
git push -u origin main --tags
git push origin fix/acessibilidade feat/build-producao ci/deploy-github-pages docs/documentacao
```

Para o site ir ao ar, ative o Pages: **Settings > Pages > Build and deployment > Source: GitHub Actions**. Veja [DEPLOY.md](DEPLOY.md).

### E-mail dos commits

Os commits já estão com o nome "Giovanna G.S Muniz" e o e-mail privado `GiovannaGabriela-creator@users.noreply.github.com`, que não expõe seu e-mail pessoal. Ele pode não ligar os commits ao seu perfil (o gráfico de contribuições pode não contar). Para ligar, pegue o seu e-mail privado em github.com > Settings > Emails (formato `NUMERO+GiovannaGabriela-creator@users.noreply.github.com`) e rode **antes do primeiro push**:

```bash
git config user.email "SEU-EMAIL-PRIVADO-DO-GITHUB"
git filter-branch -f --env-filter 'export GIT_AUTHOR_EMAIL="SEU-EMAIL-PRIVADO-DO-GITHUB" GIT_COMMITTER_EMAIL="SEU-EMAIL-PRIVADO-DO-GITHUB"' --tag-name-filter cat -- --all
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
