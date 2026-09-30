import { html, montar } from '../core/template.js';

export const naoEncontrada = {
  titulo: 'Página não encontrada',
  montar(raiz) {
    montar(raiz, html`
    <section class="secao"><div class="envolucro">
      <h1>Página não encontrada</h1>
      <p class="hero__texto">O endereço que você abriu não existe neste site.</p>
      <p><a class="botao botao--primario" href="#/">Voltar ao início</a></p>
    </div></section>`);
  }
};
