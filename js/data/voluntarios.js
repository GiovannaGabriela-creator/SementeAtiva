/** Repositório de voluntários (CRUD sobre o localStorage). */
import { store } from '../core/store.js';
import { somenteDigitos } from '../validacao/mascaras.js';

const CHAVE = 'voluntarios';

function novoId() {
  return (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function listar() { return store.ler(CHAVE, []); }

export function adicionar(dados) {
  const lista = listar();
  const cpf = somenteDigitos(dados.cpf);
  if (lista.some(function (v) { return v.cpf === cpf; })) return { ok: false, erro: 'cpf-duplicado' };
  const registro = Object.assign({}, dados, { id: novoId(), cpf: cpf, criadoEm: new Date().toISOString() });
  delete registro.termos; // o aceite é condição do envio, não um dado a guardar
  lista.push(registro);
  return store.gravar(CHAVE, lista) ? { ok: true, registro: registro } : { ok: false, erro: 'armazenamento' };
}

export function remover(id) {
  return store.gravar(CHAVE, listar().filter(function (v) { return v.id !== id; }));
}

export function limpar() { store.remover(CHAVE); }
