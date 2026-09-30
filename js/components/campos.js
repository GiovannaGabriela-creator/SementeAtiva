/** Templates de campos de formulário. Todos seguem o padrão .campo[data-campo] + .mensagem-erro. */
import { html, bruto, atributos } from '../core/template.js';

const opcional = bruto(' <span class="rotulo-opcional">(opcional)</span>');

export const campoTexto = ({ id, rotulo, tipo = 'text', placeholder = '', autocomplete = '', inputmode = '', maxlength = '', minlength = '', aviso = false }) => html`
  <div class="campo" data-campo="${id}">
    <label for="${id}">${rotulo}</label>
    <input type="${tipo}" id="${id}" name="${id}" aria-describedby="erro-${id}${aviso ? ' aviso-' + id : ''}"
      ${atributos({ placeholder, autocomplete, inputmode, maxlength, minlength, required: true })}>
    <p class="mensagem-erro" id="erro-${id}"></p>
    ${aviso ? html`<p class="texto-ajuda" id="aviso-${id}" aria-live="polite"></p>` : ''}
  </div>`;

export const campoSelect = ({ id, rotulo, autocomplete = '', opcoes }) => html`
  <div class="campo" data-campo="${id}">
    <label for="${id}">${rotulo}</label>
    <select id="${id}" name="${id}" aria-describedby="erro-${id}" ${atributos({ autocomplete, required: true })}>
      <option value="">Selecione</option>
      ${opcoes.map((o) => html`<option value="${o[0]}">${o[1]}</option>`)}
    </select>
    <p class="mensagem-erro" id="erro-${id}"></p>
  </div>`;

export const campoTextarea = ({ id, rotulo, placeholder, maxlength }) => html`
  <div class="campo" data-campo="${id}">
    <label for="${id}">${rotulo}${opcional}</label>
    <textarea id="${id}" name="${id}" placeholder="${placeholder}" maxlength="${maxlength}"></textarea>
    <p class="mensagem-erro" id="erro-${id}"></p>
  </div>`;

export const grupoCheckbox = ({ nome, rotulo, dica, opcoes }) => html`
  <div class="campo" data-campo="${nome}">
    <label id="rotulo-${nome}">${rotulo} <span class="rotulo-opcional">(${dica})</span></label>
    <div class="grupo-opcoes" role="group" aria-labelledby="rotulo-${nome}" aria-describedby="erro-${nome}">
      ${opcoes.map((o) => html`
        <label class="opcao-checkbox"><input type="checkbox" name="${nome}" value="${o[0]}"> ${o[1]}</label>`)}
    </div>
    <p class="mensagem-erro" id="erro-${nome}"></p>
  </div>`;

export const campoTermos = ({ id, texto }) => html`
  <div class="campo" data-campo="${id}">
    <div class="campo-termos">
      <input type="checkbox" id="${id}" name="${id}" required aria-describedby="erro-${id}">
      <label for="${id}">${texto}</label>
    </div>
    <p class="mensagem-erro" id="erro-${id}"></p>
  </div>`;
