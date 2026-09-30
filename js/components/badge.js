import { html } from '../core/template.js';
import { STATUS, rotulo } from '../data/opcoes.js';

export const badge = (status) => html`<span class="badge badge--${status}"><span class="badge__ponto" aria-hidden="true"></span>${rotulo(STATUS, status)}</span>`;
