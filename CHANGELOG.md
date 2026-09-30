# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e versionamento semântico.

## [1.0.0] - 2026-09-29

### Adicionado
- SPA com roteador por hash, sistema de templates, camada de `localStorage` e código modular por área.
- Cadastro de voluntários com máscaras, validação, busca de CEP, rascunho e lista de cadastros salvos.
- Projetos com badges de status e filtros por categoria e status.
- Alertas, toast, modal, tema claro/escuro e guia de componentes.
- Build de produção sem dependências, servidor local e 14 testes unitários.
- Workflow de CI e deploy no GitHub Pages, com alternativa para Netlify.
- Documentação: README, guia de contribuição, acessibilidade, deploy e fluxo de Git.

### Corrigido
- `aria-pressed` dos filtros saía vazio (WCAG 4.1.2).
- Rolagem horizontal em 320px na grade de estatísticas (WCAG 1.4.10).
- Toasts de erro sumiam sozinhos (WCAG 2.2.1).
