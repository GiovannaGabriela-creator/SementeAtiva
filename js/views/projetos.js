import { html, montar } from '../core/template.js';
import { store } from '../core/store.js';
import { projetos } from '../data/projetos.js';
import { CATEGORIAS, STATUS } from '../data/opcoes.js';
import { projetoCard } from '../components/projetoCard.js';

const CHAVE_FILTRO = 'filtros-projetos';
const validos = (lista, v) => (v === 'todos' || lista.some((p) => p[0] === v)) ? v : 'todos';

const botoes = (atributo, opcoes, atual, rotuloTodos) => [['todos', rotuloTodos]].concat(opcoes).map((o) => html`
  <button type="button" aria-pressed="${String(o[0] === atual)}" ${atributo}="${o[0]}">${o[1]}</button>`);

const lista = (filtro) => {
  const itens = projetos.filter((p) => (filtro.categoria === 'todos' || p.categoria === filtro.categoria) &&
    (filtro.status === 'todos' || p.status === filtro.status));
  return { itens, marcacao: itens.length ? itens.map(projetoCard) : html`<p class="texto-ajuda">Nenhum projeto com esses filtros.</p>` };
};

export const projetosView = {
  titulo: 'Projetos',
  montar(raiz, { params }) {
    const salvo = store.ler(CHAVE_FILTRO, {});
    const filtro = {
      categoria: validos(CATEGORIAS, params.categoria !== undefined ? params.categoria : salvo.categoria),
      status: validos(STATUS, params.status !== undefined ? params.status : salvo.status)
    };
    montar(raiz, html`
    <div data-view="projetos">
      <div class="cabecalho-pagina"><div class="envolucro">
        <p class="trilha"><a href="#/">Início</a> / <span aria-current="page">Projetos</span></p>
        <h1>Iniciativas solidárias em andamento</h1>
        <p class="hero__texto">Cada projeto nasce de uma necessidade identificada junto às próprias comunidades — e conta com voluntários como você para acontecer.</p>
      </div></div>
      <section class="secao" aria-labelledby="titulo-lista-projetos"><div class="envolucro">
        <h2 id="titulo-lista-projetos" class="somente-leitor-tela">Lista de projetos</h2>
        <div class="filtros">
          <div class="filtro-projetos" role="group" aria-label="Filtrar projetos por categoria">${botoes('data-filtro', CATEGORIAS, filtro.categoria, 'Todos')}</div>
          <div class="filtro-projetos" role="group" aria-label="Filtrar projetos por status">${botoes('data-status-filtro', STATUS, filtro.status, 'Qualquer status')}</div>
        </div>
        <p class="somente-leitor-tela" id="contagem-projetos" role="status" aria-live="polite"></p>
        <div class="grade-projetos" id="lista-projetos">${lista(filtro).marcacao}</div>
      </div></section>
      <section class="secao cta-final" aria-labelledby="titulo-cta-projetos"><div class="envolucro"><div class="secao__cabecalho">
        <div><h2 id="titulo-cta-projetos">Encontrou um projeto com a sua cara?</h2>
        <p>Cadastre-se e escolha as áreas de interesse — entraremos em contato com as próximas turmas de voluntariado.</p></div>
        <a class="botao botao--acento botao--grande" href="#/cadastro">Cadastrar-me agora</a>
      </div></div></section>
    </div>`);

    // Delegação de eventos dentro da view (é descartada junto com o DOM ao trocar de rota)
    const vista = raiz.querySelector('[data-view="projetos"]');
    vista.addEventListener('click', (e) => {
      const botao = e.target.closest('[data-filtro], [data-status-filtro]');
      if (!botao) return;
      const porCategoria = botao.hasAttribute('data-filtro');
      filtro[porCategoria ? 'categoria' : 'status'] = botao.getAttribute(porCategoria ? 'data-filtro' : 'data-status-filtro');
      botao.parentElement.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === botao)));

      const { itens, marcacao } = lista(filtro);
      montar(vista.querySelector('#lista-projetos'), marcacao);
      vista.querySelector('#contagem-projetos').textContent = itens.length + (itens.length === 1 ? ' projeto exibido.' : ' projetos exibidos.');

      store.gravar(CHAVE_FILTRO, filtro);
      const consulta = new URLSearchParams();
      if (filtro.categoria !== 'todos') consulta.set('categoria', filtro.categoria);
      if (filtro.status !== 'todos') consulta.set('status', filtro.status);
      // replaceState atualiza o link compartilhável sem disparar nova navegação
      window.history.replaceState(null, '', '#/projetos' + (consulta.toString() ? '?' + consulta : ''));
    });
  }
};
