import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// localStorage falso, em memória (os módulos só usam window.localStorage ao serem chamados)
function novoStorage() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), _m: m };
}
beforeEach(() => { globalThis.window = { localStorage: novoStorage() }; });

const { store } = await import('../../js/core/store.js');
const voluntarios = await import('../../js/data/voluntarios.js');
const rascunho = await import('../../js/data/rascunho.js');

const base = { nome: 'Maria', cpf: '529.982.247-25', email: 'm@ex.com', areas: ['educacao'], termos: true };

test('store: grava e lê JSON com prefixo, devolve o padrão quando não existe ou está corrompido', () => {
  assert.equal(store.ler('x', 'padrao'), 'padrao');
  assert.equal(store.gravar('x', { a: 1 }), true);
  assert.deepEqual(store.ler('x'), { a: 1 });
  assert.ok([...window.localStorage._m.keys()][0].startsWith('semente-ativa:v1:'));
  window.localStorage.setItem('semente-ativa:v1:y', '{quebrado');
  assert.equal(store.ler('y', 'padrao'), 'padrao');
});

test('store: devolve false quando o armazenamento falha', () => {
  window.localStorage.setItem = () => { throw new Error('cota'); };
  assert.equal(store.gravar('x', 1), false);
});

test('voluntários: adiciona, guarda só dígitos do CPF, não guarda o aceite e barra CPF duplicado', () => {
  const r = voluntarios.adicionar(base);
  assert.equal(r.ok, true);
  assert.equal(r.registro.cpf, '52998224725');
  assert.equal('termos' in r.registro, false);
  assert.ok(r.registro.id && r.registro.criadoEm);
  assert.deepEqual(voluntarios.adicionar({ ...base, nome: 'Outra' }), { ok: false, erro: 'cpf-duplicado' });
  assert.equal(voluntarios.listar().length, 1);
});

test('voluntários: remove por id e limpa tudo', () => {
  const { registro } = voluntarios.adicionar(base);
  voluntarios.remover(registro.id);
  assert.equal(voluntarios.listar().length, 0);
  voluntarios.adicionar(base);
  voluntarios.limpar();
  assert.equal(voluntarios.listar().length, 0);
});

test('rascunho: nunca guarda CPF nem aceite dos termos e some se estiver vazio', () => {
  rascunho.salvarRascunho({ nome: 'Ana', cpf: '529.982.247-25', termos: true, areas: [] });
  assert.deepEqual(rascunho.carregarRascunho(), { nome: 'Ana', areas: [] });
  rascunho.salvarRascunho({ nome: '', cpf: '529.982.247-25', termos: true, areas: [] });
  assert.equal(rascunho.carregarRascunho(), null);
});
