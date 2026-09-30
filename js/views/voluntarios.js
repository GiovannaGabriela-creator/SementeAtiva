import { html, montar } from '../core/template.js';
import { listar, remover, limpar } from '../data/voluntarios.js';
import { AREAS, DISPONIBILIDADES, rotulo } from '../data/opcoes.js';
import { toast, confirmar } from '../ui/feedback.js';

const cpfMascarado = (c) => '***.***.***-' + String(c).slice(9);
const data = (iso) => new Date(iso).toLocaleDateString('pt-BR');

const conteudoLista = (itens) => itens.length === 0
  ? html`<div class="alerta alerta--info"><svg class="icone" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7.5v.5"/></svg>
      <div class="alerta__texto"><strong class="alerta__titulo">Nenhum cadastro por aqui</strong><p>Os cadastros feitos neste navegador aparecem nesta lista. <a class="link-secao" href="#/cadastro">Fazer um cadastro</a></p></div></div>`
  : html`<div class="tabela-rolagem" tabindex="0" role="region" aria-label="Tabela de voluntários cadastrados">
      <table class="tabela">
        <caption>${itens.length} ${itens.length === 1 ? 'cadastro salvo' : 'cadastros salvos'} neste navegador</caption>
        <thead><tr><th scope="col">Nome</th><th scope="col">CPF</th><th scope="col">E-mail</th><th scope="col">Cidade/UF</th><th scope="col">Áreas</th><th scope="col">Disponibilidade</th><th scope="col">Cadastro em</th><th scope="col">Ações</th></tr></thead>
        <tbody>${itens.map((v) => html`<tr>
          <th scope="row">${v.nome}</th><td>${cpfMascarado(v.cpf)}</td><td>${v.email}</td><td>${v.cidade}/${v.estado}</td>
          <td>${v.areas.map((a) => rotulo(AREAS, a)).join(', ')}</td><td>${rotulo(DISPONIBILIDADES, v.disponibilidade)}</td><td>${data(v.criadoEm)}</td>
          <td><button type="button" class="botao botao--perigo botao--pequeno" data-excluir="${v.id}" aria-label="Excluir cadastro de ${v.nome}">Excluir</button></td>
        </tr>`)}</tbody>
      </table></div>`;

export const voluntarios = {
  titulo: 'Cadastros salvos',
  montar(raiz) {
    montar(raiz, html`
    <div data-view="voluntarios">
      <div class="cabecalho-pagina"><div class="envolucro">
        <p class="trilha"><a href="#/">Início</a> / <span aria-current="page">Cadastros salvos</span></p>
        <h1>Cadastros salvos neste navegador</h1>
        <p class="hero__texto">Os dados ficam apenas no armazenamento local do seu navegador (localStorage) e não são enviados a nenhum servidor. O CPF aparece mascarado.</p>
      </div></div>
      <section class="secao" aria-labelledby="titulo-lista"><div class="envolucro">
        <div class="barra-ferramentas">
          <h2 id="titulo-lista" tabindex="-1">Voluntários cadastrados</h2>
          <button type="button" class="botao botao--perigo" data-limpar-tudo>Apagar todos os cadastros</button>
        </div>
        <div id="area-lista"></div>
      </div></section>
    </div>`);

    const vista = raiz.querySelector('[data-view="voluntarios"]');
    const area = vista.querySelector('#area-lista');
    const botaoLimpar = vista.querySelector('[data-limpar-tudo]');

    function desenhar() {
      const itens = listar();
      montar(area, conteudoLista(itens));
      botaoLimpar.hidden = itens.length === 0;
    }
    desenhar();

    vista.addEventListener('click', async (e) => {
      const excluir = e.target.closest('[data-excluir]');
      if (excluir) {
        const alvo = listar().find((v) => v.id === excluir.getAttribute('data-excluir'));
        if (!alvo) return;
        const ok = await confirmar({ titulo: 'Excluir este cadastro?', mensagem: 'O cadastro de ' + alvo.nome + ' será removido deste navegador.',
          confirmar: 'Excluir', cancelar: 'Cancelar', tipo: 'aviso' });
        if (!ok) return;
        remover(alvo.id);
        desenhar();
        toast('sucesso', 'Cadastro excluído.');
        vista.querySelector('#titulo-lista').focus();
      } else if (e.target.closest('[data-limpar-tudo]')) {
        const ok = await confirmar({ titulo: 'Apagar todos os cadastros?', mensagem: 'Todos os cadastros salvos neste navegador serão removidos. Essa ação não pode ser desfeita.',
          confirmar: 'Apagar tudo', cancelar: 'Cancelar', tipo: 'aviso' });
        if (!ok) return;
        limpar();
        desenhar();
        toast('sucesso', 'Todos os cadastros foram apagados.');
        vista.querySelector('#titulo-lista').focus();
      }
    });
  }
};
