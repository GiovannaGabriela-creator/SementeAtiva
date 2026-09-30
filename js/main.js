/** Ponto de entrada da SPA: registra as rotas e inicia tema, menu e roteador. */
import { registrar, iniciar } from './core/router.js';
import { iniciarTema } from './ui/tema.js';
import { iniciarMenu } from './ui/menu.js';
import { inicio } from './views/inicio.js';
import { projetosView } from './views/projetos.js';
import { cadastro } from './views/cadastro.js';
import { voluntarios } from './views/voluntarios.js';
import { componentes } from './views/componentes.js';
import { naoEncontrada } from './views/naoEncontrada.js';

registrar('/', inicio);
registrar('/projetos', projetosView);
registrar('/cadastro', cadastro);
registrar('/voluntarios', voluntarios);
registrar('/componentes', componentes);

iniciarTema();
const menu = iniciarMenu();
const principal = document.getElementById('conteudo-principal');
const anuncio = document.getElementById('anuncio-rota');

// O link "Pular para o conteúdo" não pode mexer no hash (ele é usado pelo roteador)
document.querySelector('.pular-link').addEventListener('click', function (e) {
  e.preventDefault();
  principal.focus();
});

iniciar({
  raiz: document.getElementById('app'),
  naoEncontrada: naoEncontrada,
  aoNavegar: function (info) {
    document.querySelectorAll('.nav-principal a[data-rota]').forEach(function (a) {
      if (a.getAttribute('data-rota') === info.caminho) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    menu.fechar();
    if (!info.inicial) anuncio.textContent = info.titulo + ' — página carregada';
  }
});
