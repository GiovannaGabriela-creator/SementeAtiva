/** Menu de navegação em telas estreitas (alterna a classe .nav-principal--aberto). */
export function iniciarMenu() {
  const botao = document.querySelector('.botao-menu');
  const menu = document.getElementById('menu-principal');
  if (!botao || !menu) return { fechar: function () {} };

  function definir(aberto) {
    botao.setAttribute('aria-expanded', String(aberto));
    menu.classList.toggle('nav-principal--aberto', aberto);
  }
  botao.addEventListener('click', function () { definir(botao.getAttribute('aria-expanded') !== 'true'); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && botao.getAttribute('aria-expanded') === 'true') { definir(false); botao.focus(); }
  });
  window.matchMedia('(min-width: 921px)').addEventListener('change', function (e) { if (e.matches) definir(false); });
  return { fechar: function () { definir(false); } };
}
