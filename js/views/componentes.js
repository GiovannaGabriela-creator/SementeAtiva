import { html, montar } from '../core/template.js';
import { alerta, toast, confirmar, informar } from '../ui/feedback.js';
import { badge } from '../components/badge.js';

const secao = (id, titulo, intro, corpo) => html`
  <section class="secao" aria-labelledby="t-${id}"><div class="envolucro">
    <h2 id="t-${id}">${titulo}</h2><p class="secao__intro">${intro}</p>${corpo}
  </div></section>`;

export const componentes = {
  titulo: 'Guia de componentes',
  montar(raiz) {
    montar(raiz, html`
    <div data-view="componentes">
      <div class="cabecalho-pagina"><div class="envolucro">
        <p class="trilha"><a href="#/">Início</a> / <span aria-current="page">Guia de componentes</span></p>
        <h1>Guia de componentes</h1>
        <p class="hero__texto">Etiquetas, alertas, notificações e janelas de diálogo usados no site, com o comportamento de cada um.</p>
      </div></div>
      ${secao('badges', 'Badges', 'Etiquetas de status. O texto sempre diz o estado; a cor só reforça.',
        html`<div class="demo-linha">${['ativo', 'andamento', 'concluido'].map(badge)}</div>`)}
      ${secao('alertas', 'Alertas', 'Mensagens fixas na página. Cada tipo tem ícone e título, então não dependem só da cor.',
        html`<div class="demo-pilha">
          <div data-alerta="sucesso" data-mensagem="Cadastro enviado. Nossa equipe entra em contato em até 5 dias úteis."></div>
          <div data-alerta="erro" data-mensagem="Não foi possível enviar. Revise os campos indicados e tente de novo."></div>
          <div data-alerta="info" data-mensagem="O CEP preenche rua, bairro, cidade e estado. Você pode ajustar depois."></div>
          <div data-alerta="aviso" data-mensagem="Ao limpar o formulário, os dados preenchidos serão perdidos."></div></div>`)}
      ${secao('toast', 'Toast', 'Aviso curto após uma ação. Some sozinho, pausa quando você passa o mouse ou foca nele e pode ser fechado.',
        html`<div class="demo-linha">
          <button type="button" class="botao botao--primario" data-toast="sucesso" data-mensagem="Cadastro enviado.">Toast de sucesso</button>
          <button type="button" class="botao botao--fantasma" data-toast="erro" data-mensagem="Não foi possível salvar.">Toast de erro</button>
          <button type="button" class="botao botao--fantasma" data-toast="info" data-mensagem="Endereço preenchido pelo CEP.">Toast de informação</button>
          <button type="button" class="botao botao--fantasma" data-toast="aviso" data-mensagem="Sua sessão expira em breve.">Toast de aviso</button></div>`)}
      ${secao('modal', 'Modal', 'Janela de confirmação ou informação. O foco fica preso nela, Esc fecha e o foco volta ao botão que a abriu.',
        html`<div class="demo-linha">
          <button type="button" class="botao botao--primario" data-modal="confirmar">Abrir confirmação</button>
          <button type="button" class="botao botao--fantasma" data-modal="informar">Abrir informação</button></div>`)}
      ${secao('tema', 'Tema claro e escuro', 'Use o sol (claro) ou a lua (escuro) no topo da página. Sem escolha salva, o site segue a preferência do seu sistema.', '')}
    </div>`);

    const vista = raiz.querySelector('[data-view="componentes"]');
    vista.querySelectorAll('[data-alerta]').forEach((el) => alerta(el, el.getAttribute('data-alerta'), el.getAttribute('data-mensagem')));
    vista.addEventListener('click', (e) => {
      const t = e.target.closest('[data-toast]');
      if (t) { toast(t.getAttribute('data-toast'), t.getAttribute('data-mensagem')); return; }
      const m = e.target.closest('[data-modal]');
      if (!m) return;
      if (m.getAttribute('data-modal') === 'confirmar') {
        confirmar({ titulo: 'Excluir este rascunho?', mensagem: 'O rascunho será apagado e não poderá ser recuperado.',
          confirmar: 'Excluir', cancelar: 'Cancelar', tipo: 'aviso' })
          .then((ok) => toast(ok ? 'sucesso' : 'info', ok ? 'Rascunho excluído.' : 'Nada foi alterado.'));
      } else {
        informar({ titulo: 'Cadastro enviado', mensagem: 'Recebemos seus dados. Nossa equipe entra em contato em até 5 dias úteis.', confirmar: 'Entendi', tipo: 'sucesso' });
      }
    });
  }
};
