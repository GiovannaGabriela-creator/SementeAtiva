/**
 * Roteador por hash (#/caminho?chave=valor). Funciona em hospedagem estática (ex.: GitHub Pages).
 * Cada view é { titulo, montar(raiz, { params, caminho }) } e pode devolver uma função de limpeza.
 * Acessibilidade: atualiza o título, rola ao topo e leva o foco ao <h1> nas navegações seguintes.
 */
const rotas = new Map();
let raiz = null;
let config = {};
let limpezaAtual = null;
let primeira = true;

export function registrar(caminho, view) { rotas.set(caminho, view); }

function ler() {
  const hash = window.location.hash;
  if (hash && hash.indexOf('#/') !== 0) return null; // âncora comum: não é navegação
  const partes = (hash.slice(1) || '/').split('?');
  return {
    caminho: partes[0].replace(/\/+$/, '') || '/',
    params: Object.fromEntries(new URLSearchParams(partes[1] || ''))
  };
}

function navegar() {
  const destino = ler();
  if (!destino) return;
  const view = rotas.get(destino.caminho) || config.naoEncontrada;

  if (typeof limpezaAtual === 'function') limpezaAtual();
  limpezaAtual = null;

  const resultado = view.montar(raiz, { params: destino.params, caminho: destino.caminho });
  if (typeof resultado === 'function') limpezaAtual = resultado;

  document.title = view.titulo + ' — Instituto Semente Ativa';
  if (!primeira) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const titulo = raiz.querySelector('h1');
    if (titulo) { titulo.setAttribute('tabindex', '-1'); titulo.focus({ preventScroll: true }); }
  }
  if (config.aoNavegar) config.aoNavegar({ caminho: destino.caminho, titulo: view.titulo, inicial: primeira });
  primeira = false;
}

export function iniciar(opcoes) {
  config = opcoes;
  raiz = opcoes.raiz;
  window.addEventListener('hashchange', navegar);
  navegar();
}
