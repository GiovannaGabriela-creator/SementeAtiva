/**
 * Sistema de templates. A tag `html` escapa tudo que é interpolado (proteção contra XSS);
 * fragmentos vindos de outro `html` ou de `bruto()` passam sem escape. Arrays são concatenados.
 */
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

class HtmlSeguro {
  constructor(texto) { this.texto = texto; }
  toString() { return this.texto; }
}

export function escapar(valor) {
  return String(valor).replace(/[&<>"']/g, function (c) { return ESCAPES[c]; });
}

/** Marca um texto como HTML confiável (use só com conteúdo escrito por você). */
export function bruto(texto) { return new HtmlSeguro(String(texto)); }

function renderizar(valor) {
  if (valor === null || valor === undefined || valor === false || valor === true) return '';
  if (valor instanceof HtmlSeguro) return valor.texto;
  if (Array.isArray(valor)) return valor.map(renderizar).join('');
  return escapar(valor);
}

export function html(partes, ...valores) {
  let saida = '';
  partes.forEach(function (parte, i) {
    saida += parte;
    if (i < valores.length) saida += renderizar(valores[i]);
  });
  return new HtmlSeguro(saida);
}

/** Monta atributos opcionais: atributos({ maxlength: 14, required: true, placeholder: '' }) */
export function atributos(mapa) {
  return bruto(Object.entries(mapa)
    .filter(function (par) { return par[1] !== '' && par[1] !== false && par[1] != null; })
    .map(function (par) { return par[1] === true ? ' ' + par[0] : ' ' + par[0] + '="' + escapar(par[1]) + '"'; })
    .join(''));
}

export function montar(alvo, conteudo) { alvo.innerHTML = String(conteudo); }
