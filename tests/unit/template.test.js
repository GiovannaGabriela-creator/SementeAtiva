import test from 'node:test';
import assert from 'node:assert/strict';
import { html, bruto, escapar, atributos } from '../../js/core/template.js';

test('escapa HTML interpolado (proteção contra XSS)', () => {
  assert.equal(String(html`<b>${'<script>x</script>'}</b>`), '<b>&lt;script&gt;x&lt;/script&gt;</b>');
  assert.equal(escapar(`"&'`), '&quot;&amp;&#39;');
});

test('fragmentos de html aninhados e listas passam sem escape duplo', () => {
  const itens = ['a', 'b'].map((x) => html`<li>${x}</li>`);
  assert.equal(String(html`<ul>${itens}</ul>`), '<ul><li>a</li><li>b</li></ul>');
});

test('bruto() marca conteúdo confiável; null, false e true não imprimem nada', () => {
  assert.equal(String(html`${bruto('<i>ok</i>')}${null}${false}${true}${0}`), '<i>ok</i>0');
});

test('atributos() ignora vazios e escapa valores', () => {
  assert.equal(String(atributos({ maxlength: 14, required: true, placeholder: '', title: 'a"b' })), ' maxlength="14" required title="a&quot;b"');
});
