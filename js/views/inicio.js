import { html, montar } from '../core/template.js';
import { CATEGORIAS } from '../data/opcoes.js';

const PILARES = {
  alimentar: 'Hortas comunitárias e distribuição mensal de cestas básicas para famílias em situação de insegurança alimentar.',
  educacao: 'Reforço escolar para crianças e cursos profissionalizantes para jovens e adultos.',
  saude: 'Grupos de apoio psicossocial e encaminhamento à rede pública de saúde.',
  ambiental: 'Plantio de mudas nativas em áreas urbanas degradadas, em parceria com escolas públicas.'
};
const NUMEROS = [['1.200', 'famílias recebem cestas básicas por mês'], ['410', 'crianças no reforço escolar comunitário'],
  ['310', 'pessoas formadas em cursos profissionalizantes'], ['2.100', 'mudas nativas plantadas']];

export const inicio = {
  titulo: 'Início',
  montar(raiz) {
    montar(raiz, html`
    <section class="hero" aria-labelledby="titulo-principal">
      <div class="envolucro">
        <div>
          <span class="hero__elo">Instituto Semente Ativa</span>
          <h1 id="titulo-principal" class="hero__titulo">Cultivando oportunidades, transformando comunidades</h1>
          <p class="hero__texto">Atuamos para fortalecer comunidades por meio de ações em segurança alimentar, educação, saúde e meio ambiente.</p>
          <div class="hero__acoes">
            <a class="botao botao--acento" href="#/projetos">Conheça nossos projetos</a>
            <a class="botao botao--fantasma" href="#/cadastro">Seja voluntário</a>
          </div>
        </div>
        <picture>
          <source srcset="img/comunidade.svg" type="image/svg+xml">
          <source srcset="img/comunidade@1x.webp 1x, img/comunidade@2x.webp 2x" type="image/webp">
          <img class="hero__grafico" src="img/comunidade@1x.png" srcset="img/comunidade@1x.png 1x, img/comunidade@2x.png 2x"
            alt="Ilustração de pessoas trabalhando juntas em uma comunidade" width="400" height="340" loading="eager">
        </picture>
      </div>
    </section>

    <section class="secao" aria-labelledby="titulo-institucional">
      <div class="envolucro"><div class="secao__cabecalho"><div>
        <h2 id="titulo-institucional">Quem somos</h2>
        <p class="secao__intro">O Instituto Semente Ativa é uma organização dedicada ao desenvolvimento social e ao fortalecimento de comunidades.</p>
      </div></div></div>
    </section>

    <section class="secao" aria-labelledby="titulo-numeros">
      <div class="envolucro">
        <h2 id="titulo-numeros" class="somente-leitor-tela">Nosso impacto em números</h2>
        <ul class="grade-estatisticas">
          ${NUMEROS.map((n) => html`<li class="estatistica"><span class="estatistica__numero">${n[0]}</span><span class="estatistica__rotulo">${n[1]}</span></li>`)}
        </ul>
      </div>
    </section>

    <section class="secao" aria-labelledby="titulo-pilares">
      <div class="envolucro">
        <div class="secao__cabecalho">
          <div><h2 id="titulo-pilares">Onde atuamos</h2>
          <p class="secao__intro">Quatro frentes de trabalho, definidas junto às próprias comunidades.</p></div>
          <a class="botao botao--fantasma" href="#/projetos">Ver todos os projetos</a>
        </div>
        <div class="grade-pilares">
          ${CATEGORIAS.map((c) => html`
            <article class="pilar"><h3>${c[1]}</h3><p>${PILARES[c[0]]}</p>
              <p><a class="link-secao" href="#/projetos?categoria=${c[0]}">Ver projetos de ${c[1].toLowerCase()}</a></p></article>`)}
        </div>
      </div>
    </section>

    <section class="secao cta-final" aria-labelledby="titulo-cta-home">
      <div class="envolucro"><div class="secao__cabecalho">
        <div><h2 id="titulo-cta-home">Quer fazer parte?</h2><p>Cadastre-se como voluntário e escolha as áreas em que quer atuar.</p></div>
        <a class="botao botao--acento botao--grande" href="#/cadastro">Quero ser voluntário</a>
      </div></div>
    </section>`);
  }
};
