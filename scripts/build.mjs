/**
 * Build de produção, sem dependências (só módulos nativos do Node).
 *  - CSS: resolve os @import em camadas (@layer) num único arquivo e minifica.
 *  - JS: junta os módulos ES num único script (ordem topológica), remove comentários e indentação.
 *  - Nomes com hash do conteúdo (cache de longo prazo), imagens copiadas e relatório de tamanhos.
 * Uso: npm run build   ->   pasta dist/
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SAIDA = join(RAIZ, 'dist');
const ler = (rel) => readFileSync(join(RAIZ, rel), 'utf8');
const hash = (texto) => createHash('sha1').update(texto).digest('hex').slice(0, 8);

/* ---------- CSS ---------- */
function minificarCss(css) {
  // as strings ficam fora da compactação (índices ímpares do split)
  return css.replace(/\/\*[\s\S]*?\*\//g, '')
    .split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/)
    .map((parte, i) => i % 2 ? parte : parte.replace(/\s+/g, ' ').replace(/\s*([{};,>])\s*/g, '$1').replace(/;}/g, '}'))
    .join('').trim();
}

function construirCss() {
  const principal = ler('css/main.css');
  const unido = principal.replace(/@import url\("([^"]+)"\)\s*layer\((\w+)\);/g,
    (_, arquivo, camada) => `@layer ${camada}{${ler('css/' + arquivo)}}`);
  if (unido.includes('@import')) throw new Error('Sobrou um @import no CSS final.');
  return minificarCss(unido);
}

/* ---------- JS ---------- */
const RE_IMPORT = /^import\s+\{([^}]*)\}\s+from\s+'([^']+)';?[ \t]*$/gm;
const RE_EXPORT_DECL = /^export\s+(?:async\s+)?(?:const|let|function|class)\s+(\w+)/gm;
const RE_EXPORT_LISTA = /^export\s*\{([^}]*)\};?[ \t]*$/gm;

function limparJs(codigo) {
  return codigo
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^[ \t]*\/\/.*$/gm, '')
    .replace(/^[ \t]+/gm, '')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

function construirJs() {
  const modulos = new Map(); // id -> { codigo, exportados }
  const ordem = [];

  function visitar(id) {
    if (modulos.has(id)) return;
    modulos.set(id, null); // marca "em visita" (detecta ciclos)
    let codigo = ler(id);
    const nomes = [];

    codigo = codigo.replace(RE_IMPORT, (_, itens, origem) => {
      const dep = posix.normalize(posix.join(posix.dirname(id), origem));
      visitar(dep);
      const desestruturar = itens.split(',').map((s) => s.trim()).filter(Boolean)
        .map((s) => s.replace(/^(\w+)\s+as\s+(\w+)$/, '$1: $2')).join(', ');
      return `const { ${desestruturar} } = __m['${dep}'];`;
    });
    codigo = codigo.replace(RE_EXPORT_LISTA, (_, lista) => {
      lista.split(',').map((s) => s.trim()).filter(Boolean).forEach((n) => nomes.push(n));
      return '';
    });
    codigo = codigo.replace(RE_EXPORT_DECL, (trecho, nome) => { nomes.push(nome); return trecho.replace(/^export\s+/, ''); });
    if (/^(import|export)\s/m.test(codigo)) throw new Error('Sintaxe de módulo não suportada em ' + id);

    modulos.set(id, { codigo: limparJs(codigo), nomes });
    ordem.push(id);
  }
  visitar('js/main.js');

  const corpo = ordem.map((id) => {
    const { codigo, nomes } = modulos.get(id);
    return `__m['${id}']=(()=>{\n${codigo}\nreturn {${nomes.join(',')}};\n})();`;
  }).join('\n');
  return `(function(){\n'use strict';\nconst __m={};\n${corpo}\n})();\n`;
}

/* ---------- HTML e cópia dos arquivos estáticos ---------- */
function construirHtml(arquivoCss, arquivoJs) {
  let h = ler('index.html');
  const antes = h;
  h = h.replace('href="css/main.css"', `href="assets/${arquivoCss}"`)
    .replace('<script type="module" src="js/main.js"></script>', `<script defer src="assets/${arquivoJs}"></script>`)
    .replace(/\s*<script>\s*if \(location\.protocol === 'file:'\)[\s\S]*?<\/script>/, ''); // aviso só serve ao modo dev
  if (h.includes('css/main.css') || h.includes('js/main.js') || h === antes) throw new Error('Não foi possível reescrever o index.html.');
  return h;
}

function tamanho(texto) {
  const bruto = Buffer.byteLength(texto);
  return `${(bruto / 1024).toFixed(1)} KB (gzip ${(gzipSync(texto).length / 1024).toFixed(1)} KB)`;
}

rmSync(SAIDA, { recursive: true, force: true });
mkdirSync(join(SAIDA, 'assets'), { recursive: true });

const css = construirCss();
const js = construirJs();
const arquivoCss = `estilo.${hash(css)}.css`;
const arquivoJs = `app.${hash(js)}.js`;
writeFileSync(join(SAIDA, 'assets', arquivoCss), css);
writeFileSync(join(SAIDA, 'assets', arquivoJs), js);
writeFileSync(join(SAIDA, 'index.html'), construirHtml(arquivoCss, arquivoJs));
cpSync(join(RAIZ, 'img'), join(SAIDA, 'img'), { recursive: true });
writeFileSync(join(SAIDA, '.nojekyll'), ''); // o GitHub Pages não deve processar a pasta com Jekyll

console.log('Build concluído em', relative(process.cwd(), SAIDA) || 'dist');
console.log('  CSS :', tamanho(css));
console.log('  JS  :', tamanho(js));
if (!existsSync(join(SAIDA, 'index.html'))) process.exit(1);
