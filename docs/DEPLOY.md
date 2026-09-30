# Deploy

O site é estático (só HTML, CSS e JS), então roda em qualquer hospedagem de arquivos. As rotas usam hash (`#/projetos`), portanto **não precisa de nenhuma regra de redirecionamento** no servidor.

## GitHub Pages (padrão, automático)

1. Publique o código no GitHub (veja [FLUXO-GIT.md](FLUXO-GIT.md)).
2. Em **Settings > Pages > Build and deployment**, escolha **Source: GitHub Actions**.
3. Faça um push na `main` (ou rode o workflow em **Actions > CI e deploy > Run workflow**).
4. O workflow executa `npm test`, `npm run build` e publica a pasta `dist/`. O endereço aparece no job "Publica no GitHub Pages" e em Settings > Pages, no formato `https://giovannagabriela-creator.github.io/SementeAtiva/`.

Os caminhos dos arquivos no build são relativos, então funciona dentro do subcaminho `/semente-ativa/` sem configuração extra.

## Conferir antes de publicar

```bash
npm run build
npm run preview          # http://localhost:8081
```

Cheque: as cinco rotas abrem, o cadastro salva e aparece em "Cadastros salvos", o tema claro/escuro funciona, e o console do navegador está sem erros. Para uma checagem mais completa, rode `tests/a11y/auditoria.py` e `tests/a11y/fluxos.py` apontando para a porta 8081.

## Alternativa: Netlify

Conecte o repositório em netlify.com. O `netlify.toml` já define o comando (`npm run build`), a pasta publicada (`dist`) e o cache longo para `/assets/*`. Também dá para arrastar a pasta `dist/` para a página de deploy manual.

## Desempenho

- Os arquivos em `assets/` têm o hash do conteúdo no nome, então podem ser guardados em cache por um ano; ao mudar o código o nome muda.
- CSS e JS são entregues em um arquivo cada (5 KB e 15 KB com gzip).
- Imagens em SVG, com WebP e PNG de reserva em 1x e 2x, e `width`/`height` definidos para evitar saltos de layout.
- Fontes com `font-display: swap` e `preconnect`.

## Voltar a uma versão anterior

```bash
git revert <hash-do-commit-com-problema>
git push
```

O push dispara um novo deploy com a correção. Para reproduzir uma versão antiga, faça o checkout da tag (`git checkout v1.0.0`) e rode `npm run build`.

## Problemas comuns

| Sintoma | Causa provável |
| --- | --- |
| Página em branco ao abrir `index.html` do código-fonte | Módulos ES exigem servidor: use `npm run dev` |
| Pages mostra 404 | Source do Pages não está em "GitHub Actions", ou o workflow ainda não terminou |
| Fontes diferentes do esperado | Sem acesso ao Google Fonts, o navegador usa as fontes de reserva do sistema |
