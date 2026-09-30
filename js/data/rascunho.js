/** Rascunho do formulário. CPF e aceite dos termos nunca são guardados. */
import { store } from '../core/store.js';

const CHAVE = 'rascunho-cadastro';
const EXCLUIDOS = ['cpf', 'termos'];

export function salvarRascunho(dados) {
  const copia = {};
  Object.keys(dados).forEach(function (k) { if (EXCLUIDOS.indexOf(k) === -1) copia[k] = dados[k]; });
  const preenchido = Object.keys(copia).some(function (k) {
    return Array.isArray(copia[k]) ? copia[k].length > 0 : String(copia[k]).trim() !== '';
  });
  if (preenchido) store.gravar(CHAVE, copia); else store.remover(CHAVE);
}
export function carregarRascunho() { return store.ler(CHAVE, null); }
export function descartarRascunho() { store.remover(CHAVE); }
