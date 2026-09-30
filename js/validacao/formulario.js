/**
 * Controlador genérico de formulário. Espera a marcação:
 *   <div class="campo" data-campo="nome"> ...campos com name="nome"... <p class="mensagem-erro"></p> </div>
 * e um objeto de regras { nome: [regra, ...] }. Valida ao sair do campo, revalida enquanto há erro
 * e expõe validarTudo() para o envio.
 */
import { executar } from './validadores.js';

export function lerDados(form) {
  const fd = new FormData(form);
  const dados = {};
  new Set(fd.keys()).forEach(function (nome) {
    const valores = fd.getAll(nome).map(function (v) { return String(v).trim(); });
    dados[nome] = nome === 'areas' ? valores : valores[0];
  });
  dados.areas = dados.areas || [];
  dados.termos = fd.has('termos');
  return dados;
}

export function ligarFormulario(form, regras) {
  function container(nome) { return form.querySelector('[data-campo="' + nome + '"]'); }

  function mostrarErro(nome, mensagem) {
    const c = container(nome);
    if (!c) return;
    c.classList.add('campo--erro');
    c.classList.remove('campo--valido');
    c.querySelector('.mensagem-erro').textContent = mensagem;
    c.querySelectorAll('[name]:not([name="areas"])').forEach(function (e) { e.setAttribute('aria-invalid', 'true'); });
  }
  function limparErro(nome) {
    const c = container(nome);
    if (!c) return;
    c.classList.remove('campo--erro');
    c.classList.add('campo--valido');
    c.querySelector('.mensagem-erro').textContent = '';
    c.querySelectorAll('[name]').forEach(function (e) { e.removeAttribute('aria-invalid'); });
  }
  function validarCampo(nome) {
    const dados = lerDados(form);
    const mensagem = executar(regras[nome], dados[nome], dados);
    if (mensagem) mostrarErro(nome, mensagem); else limparErro(nome);
    return !mensagem;
  }
  function temErro(nome) { const c = container(nome); return !!c && c.classList.contains('campo--erro'); }

  function validarTudo() {
    let primeiro = null;
    form.querySelectorAll('[data-campo]').forEach(function (c) {
      const nome = c.getAttribute('data-campo');
      if (regras[nome] && !validarCampo(nome) && !primeiro) primeiro = c.querySelector('input, select, textarea');
    });
    return { valido: !primeiro, primeiro: primeiro };
  }

  function limparEstado() {
    form.querySelectorAll('[data-campo]').forEach(function (c) {
      c.classList.remove('campo--erro', 'campo--valido');
      c.querySelectorAll('[aria-invalid]').forEach(function (e) { e.removeAttribute('aria-invalid'); });
    });
  }

  // validação ao sair do campo (checkboxes de "areas" só são checados no envio)
  form.addEventListener('focusout', function (e) {
    const nome = e.target.name;
    if (nome && regras[nome] && nome !== 'areas') validarCampo(nome);
  });
  // enquanto há erro, revalida a cada alteração para o aviso sumir assim que for corrigido
  function aoAlterar(e) { if (e.target.name && temErro(e.target.name)) validarCampo(e.target.name); }
  form.addEventListener('input', aoAlterar);
  form.addEventListener('change', aoAlterar);

  return { dados: function () { return lerDados(form); }, validarCampo, validarTudo, mostrarErro, temErro, limparEstado };
}
