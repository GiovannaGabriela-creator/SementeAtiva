/**
 * Servidor estático mínimo, sem dependências.
 * Uso: node scripts/serve.mjs [pasta] [porta]   (padrão: . e 8080)
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const pasta = resolve(process.argv[2] || '.');
const porta = Number(process.argv[3] || 8080);
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8'
};

createServer(async (req, res) => {
  try {
    let caminho = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([/\\])+/, '');
    let arquivo = join(pasta, caminho);
    if (!arquivo.startsWith(pasta)) { res.writeHead(403).end('Acesso negado'); return; } // impede ../
    if ((await stat(arquivo).catch(() => null))?.isDirectory()) arquivo = join(arquivo, 'index.html');
    const conteudo = await readFile(arquivo);
    res.writeHead(200, { 'Content-Type': TIPOS[extname(arquivo)] || 'application/octet-stream' }).end(conteudo);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Não encontrado');
  }
}).listen(porta, () => console.log(`Servindo ${pasta} em http://localhost:${porta}`));
