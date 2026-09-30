/** Alternador de tema (sol = claro, lua = escuro). Sem escolha salva, segue o sistema. */
const CHAVE = 'tema-semente-ativa'; // a mesma chave lida pelo script inline do <head>

export function iniciarTema() {
  const raiz = document.documentElement;
  const sistema = window.matchMedia('(prefers-color-scheme: dark)');

  function salvo() {
    try { const v = window.localStorage.getItem(CHAVE); return v === 'claro' || v === 'escuro' ? v : null; }
    catch (e) { return null; }
  }
  function efetivo() { return salvo() || (sistema.matches ? 'escuro' : 'claro'); }
  function atualizar() {
    document.querySelectorAll('.alternar-tema__botao').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-tema') === efetivo()));
    });
  }

  document.querySelectorAll('.alternar-tema__botao').forEach(function (botao) {
    botao.addEventListener('click', function () {
      const tema = botao.getAttribute('data-tema');
      raiz.setAttribute('data-tema', tema);
      try { window.localStorage.setItem(CHAVE, tema); } catch (e) { /* indisponível */ }
      atualizar();
    });
  });
  sistema.addEventListener('change', atualizar);
  atualizar();
}
