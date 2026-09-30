/**
 * Instituto Semente Ativa — componentes de feedback: alerta, toast e modal.
 * API (módulo ES): alerta(container, tipo, mensagem)
 *             toast(tipo, mensagem, { duracao })
 *             confirmar({ titulo, mensagem, confirmar, cancelar, tipo }) -> Promise<boolean>
 *             informar({ titulo, mensagem, confirmar, tipo }) -> Promise<void>
 * tipo: 'sucesso' | 'erro' | 'info' | 'aviso'
 */
const TITULOS = { sucesso: 'Sucesso', erro: 'Erro', info: 'Informação', aviso: 'Atenção' };
const DESENHOS = {
  sucesso: '<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>',
  erro: '<circle cx="12" cy="12" r="10"/><path d="M12 7v6M12 16.5v.5"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7.5v.5"/>',
  aviso: '<path d="M12 3 2 20h20L12 3z"/><path d="M12 10v5M12 17.5v.5"/>',
  fechar: '<path d="M6 6l12 12M18 6 6 18"/>'
};

function icone(nome, tamanho) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', tamanho || 20);
  svg.setAttribute('height', tamanho || 20);
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('class', 'icone');
  svg.innerHTML = DESENHOS[nome] || DESENHOS.info;
  return svg;
}

function el(tag, classe, texto) {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (texto) e.textContent = texto;
  return e;
}

function tipoValido(tipo) { return TITULOS[tipo] ? tipo : 'info'; }

/* ---------- Alerta ---------- */
function alerta(container, tipo, mensagem) {
  if (!container) return;
  tipo = tipoValido(tipo);
  const caixa = el('div', 'alerta alerta--' + tipo);
  const texto = el('div', 'alerta__texto');
  texto.appendChild(el('strong', 'alerta__titulo', TITULOS[tipo]));
  texto.appendChild(el('p', '', mensagem));
  caixa.appendChild(icone(tipo));
  caixa.appendChild(texto);
  container.replaceChildren(caixa);
}

/* ---------- Toast ---------- */
let pilha = null;

function obterPilha() {
  if (!pilha) {
    pilha = el('div', 'toasts');
    pilha.setAttribute('role', 'region');
    pilha.setAttribute('aria-label', 'Notificações');
    document.body.appendChild(pilha);
  }
  return pilha;
}

function toast(tipo, mensagem, opcoes) {
  tipo = tipoValido(tipo);
  const duracao = (opcoes && opcoes.duracao) || (tipo === 'erro' ? 9000 : 6000);
  const item = el('div', 'toast toast--' + tipo);
  // erro interrompe a leitura; os demais esperam a fala atual terminar
  item.setAttribute('role', tipo === 'erro' ? 'alert' : 'status');
  const texto = el('p', 'toast__texto', mensagem);
  const fechar = el('button', 'toast__fechar');
  fechar.type = 'button';
  fechar.setAttribute('aria-label', 'Fechar notificação');
  fechar.appendChild(icone('fechar', 18));
  item.appendChild(icone(tipo));
  item.appendChild(texto);
  item.appendChild(fechar);

  const caixa = obterPilha();
  while (caixa.children.length >= 3) caixa.firstElementChild.remove();
  caixa.appendChild(item);
  window.requestAnimationFrame(function () { item.classList.add('toast--visivel'); });

  let temporizador = null;
  function remover() {
    window.clearTimeout(temporizador);
    item.classList.remove('toast--visivel');
    window.setTimeout(function () { item.remove(); }, 250);
  }
  function iniciar() { window.clearTimeout(temporizador); temporizador = window.setTimeout(remover, duracao); }
  function pausar() { window.clearTimeout(temporizador); }

  fechar.addEventListener('click', remover);
  // pausa o tempo enquanto a pessoa está lendo (mouse ou teclado)
  item.addEventListener('mouseenter', pausar);
  item.addEventListener('focusin', pausar);
  item.addEventListener('mouseleave', iniciar);
  item.addEventListener('focusout', iniciar);
  iniciar();
  return { fechar: remover };
}

/* ---------- Modal ---------- */
let contador = 0;

function dialogo(opcoes, comCancelar) {
  return new Promise(function (resolver) {
    const tipo = tipoValido(opcoes.tipo || 'info');
    const anterior = document.activeElement;

    if (typeof HTMLDialogElement === 'undefined') { // navegador muito antigo
      resolver(comCancelar ? window.confirm(opcoes.titulo + '\n\n' + opcoes.mensagem) : (window.alert(opcoes.titulo + '\n\n' + opcoes.mensagem), true));
      return;
    }

    const id = 'modal-' + (++contador);
    const dlg = el('dialog', 'modal modal--' + tipo);
    dlg.setAttribute('aria-labelledby', id + '-titulo');
    dlg.setAttribute('aria-describedby', id + '-texto');

    const corpo = el('div', 'modal__corpo');
    const cab = el('div', 'modal__cabecalho');
    const h2 = el('h2', '', opcoes.titulo);
    h2.id = id + '-titulo';
    cab.appendChild(icone(tipo, 24));
    cab.appendChild(h2);
    const p = el('p', '', opcoes.mensagem);
    p.id = id + '-texto';
    const acoes = el('div', 'modal__acoes');

    if (comCancelar) {
      const cancelar = el('button', 'botao botao--fantasma', opcoes.cancelar || 'Cancelar');
      cancelar.type = 'button';
      cancelar.addEventListener('click', function () { dlg.close('cancelar'); });
      acoes.appendChild(cancelar);
    }
    const ok = el('button', 'botao botao--primario', opcoes.confirmar || 'OK');
    ok.type = 'button';
    ok.addEventListener('click', function () { dlg.close('ok'); });
    acoes.appendChild(ok);

    corpo.appendChild(cab);
    corpo.appendChild(p);
    corpo.appendChild(acoes);
    dlg.appendChild(corpo);
    document.body.appendChild(dlg);

    // clique no fundo escuro fecha (equivale a cancelar)
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close('cancelar'); });
    dlg.addEventListener('close', function () {
      const confirmado = dlg.returnValue === 'ok';
      dlg.remove();
      if (anterior && anterior.isConnected && typeof anterior.focus === 'function') anterior.focus();
      resolver(comCancelar ? confirmado : true);
    });

    dlg.showModal(); // o foco vai para o primeiro botão (o de cancelar, a opção segura)
  });
}

const confirmar = function (opcoes) { return dialogo(opcoes, true); };
const informar = function (opcoes) { return dialogo(opcoes, false); };

export { alerta, toast, confirmar, informar };
