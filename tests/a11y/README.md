# Testes de acessibilidade e fluxos (Playwright)

Dois scripts que abrem o site num Chromium real. Não fazem parte do `npm test` porque exigem Python e um navegador.

```bash
pip install playwright
playwright install chromium
npm run dev                                   # em outro terminal (porta 8080)
python tests/a11y/auditoria.py                # contraste, nomes acessíveis, ids, títulos, imagens e reflow
python tests/a11y/fluxos.py                   # teclado, formulário, modal, filtros, localStorage e tema
```

Para testar a versão de produção: `npm run build && npm run preview` e passe `http://localhost:8081/index.html`.

- **auditoria.py** percorre as 5 rotas, nos temas claro e escuro, em 1280px e 320px. Calcula a razão de contraste de todo texto visível (mínimo 4,5:1, ou 3:1 para texto grande), procura controles sem nome acessível, ids duplicados, saltos de nível de título, imagens sem `alt` e rolagem horizontal (reflow, WCAG 1.4.10). Imprime `OK` por combinação ou a lista de problemas.
- **fluxos.py** exercita o site como uma pessoa faria com teclado: link de pular, foco após erro de validação, máscaras, modal (foco preso, Esc), duplicidade de CPF, exclusão, filtros com `aria-pressed`, localStorage e tema.
