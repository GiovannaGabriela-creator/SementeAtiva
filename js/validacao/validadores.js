/**
 * Validadores puros. Cada fábrica recebe a mensagem de erro e devolve uma função
 * (valor, dados) => '' (válido) ou a mensagem.
 */
import { somenteDigitos } from './mascaras.js';

export function cpfValido(valor) {
  const cpf = somenteDigitos(valor);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i], 10) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto >= 10) resto = 0;
  if (resto !== parseInt(cpf[9], 10)) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i], 10) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto >= 10) resto = 0;
  return resto === parseInt(cpf[10], 10);
}

export function telefoneValido(valor) {
  const t = somenteDigitos(valor);
  if (t.length !== 10 && t.length !== 11) return false;
  if (Number(t.slice(0, 2)) < 11) return false;   // DDD inexistente
  return t.length === 10 || t[2] === '9';          // celular começa com 9
}

export function dataLimiteISO(anos) {
  const h = new Date();
  h.setFullYear(h.getFullYear() - anos);
  return h.getFullYear() + '-' + String(h.getMonth() + 1).padStart(2, '0') + '-' + String(h.getDate()).padStart(2, '0');
}

export const obrigatorio = (msg) => (v) =>
  (v === undefined || v === null || v === false || String(v).trim() === '' || (Array.isArray(v) && v.length === 0)) ? msg : '';
export const minimo = (n, msg) => (v) => String(v).trim().length < n ? msg : '';
export const email = (msg) => (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : msg;
export const cpf = (msg) => (v) => cpfValido(v) ? '' : msg;
export const telefone = (msg) => (v) => telefoneValido(v) ? '' : msg;
export const cep = (msg) => (v) => somenteDigitos(v).length === 8 ? '' : msg;
export const dataValida = (msg) => (v) => {
  const d = new Date(v + 'T00:00:00');
  return (!isNaN(d) && d.getFullYear() >= 1900 && d <= new Date()) ? '' : msg;
};
export const idadeMinima = (anos, msg) => (v) => v <= dataLimiteISO(anos) ? '' : msg;

/** Executa as regras em ordem e devolve a primeira mensagem de erro. */
export function executar(regras, valor, dados) {
  for (const regra of regras || []) {
    const erro = regra(valor, dados);
    if (erro) return erro;
  }
  return '';
}
