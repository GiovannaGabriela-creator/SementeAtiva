import { html } from '../core/template.js';
import { badge } from './badge.js';
import { CATEGORIAS, rotulo } from '../data/opcoes.js';

export const projetoCard = (p) => html`
  <article class="projeto" data-categoria="${p.categoria}" data-status="${p.status}">
    <div class="projeto__faixa"></div>
    <div class="projeto__corpo">
      <div class="projeto__topo">
        <p class="projeto__categoria">${rotulo(CATEGORIAS, p.categoria)}</p>
        ${badge(p.status)}
      </div>
      <h3>${p.titulo}</h3>
      <p>${p.descricao}</p>
      <div class="projeto__meta">
        ${p.metricas.map((m) => html`<span><strong>${m.valor}</strong> ${m.rotulo}</span>`)}
      </div>
    </div>
  </article>`;
