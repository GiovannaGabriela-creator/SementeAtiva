"""Auditoria de acessibilidade automatizada (contraste, nomes acessíveis, ids, títulos, imagens)."""
import json, sys
from playwright.sync_api import sync_playwright
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8080/index.html'
ROTAS = ['#/', '#/projetos', '#/cadastro', '#/voluntarios', '#/componentes']
JS = r"""
() => {
  const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if(!m) return [0,0,0,0]; const p = m[1].split(',').map(parseFloat); return [p[0],p[1],p[2], p.length>3?p[3]:1]; };
  const lum = ([r,g,b]) => { const f = v => { v/=255; return v<=0.03928? v/12.92 : Math.pow((v+0.055)/1.055,2.4); }; return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b); };
  const over = (top, bot) => { const a = top[3]; return [0,1,2].map(i => top[i]*a + bot[i]*(1-a)).concat([1]); };
  function fundo(el) { const cadeia = []; for (let e = el; e; e = e.parentElement) cadeia.push(e);
    let base = [255,255,255,1]; for (let i = cadeia.length-1; i>=0; i--) { const bg = parse(getComputedStyle(cadeia[i]).backgroundColor); if (bg[3] > 0) base = over(bg, base); } return base; }
  const out = { contraste: [], semNome: [], idsDuplicados: [], titulos: [], imgSemAlt: [], erroFoco: [] };
  const vis = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width>0 && r.height>0 && s.visibility!=='hidden' && s.display!=='none' && !el.closest('.somente-leitor-tela'); };
  document.querySelectorAll('body *').forEach(el => {
    const tem = [...el.childNodes].some(n => n.nodeType===3 && n.textContent.trim());
    if (!tem || !vis(el)) return;
    const s = getComputedStyle(el); const fg = over(parse(s.color), fundo(el));
    const l1 = lum(fg), l2 = lum(fundo(el)); const razao = (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05);
    const px = parseFloat(s.fontSize), peso = parseInt(s.fontWeight); const grande = px>=24 || (px>=18.66 && peso>=700);
    const min = grande ? 3 : 4.5;
    if (razao < min) out.contraste.push({ el: el.tagName.toLowerCase()+'.'+el.className, texto: el.textContent.trim().slice(0,40), razao: +razao.toFixed(2), min });
  });
  document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea').forEach(el => {
    if (!vis(el)) return;
    const nome = (el.getAttribute('aria-label') || (el.labels && [...el.labels].map(l=>l.textContent).join('')) || el.textContent || el.getAttribute('title') || '').trim();
    const lb = el.getAttribute('aria-labelledby'); const nome2 = lb ? lb.split(' ').map(i => (document.getElementById(i)||{}).textContent||'').join('').trim() : '';
    if (!nome && !nome2) out.semNome.push(el.outerHTML.slice(0,90));
  });
  const ids = {}; document.querySelectorAll('[id]').forEach(e => ids[e.id] = (ids[e.id]||0)+1);
  Object.keys(ids).forEach(k => ids[k]>1 && out.idsDuplicados.push(k));
  let ult = 0; document.querySelectorAll('h1,h2,h3,h4').forEach(h => { const n = +h.tagName[1]; if (n > ult+1 && ult) out.titulos.push('salto h'+ult+'→h'+n+': '+h.textContent.trim().slice(0,30)); ult = n; });
  document.querySelectorAll('img').forEach(i => { if (!i.hasAttribute('alt')) out.imgSemAlt.push(i.src); });
  return out;
}
"""
with sync_playwright() as p:
    b = p.chromium.launch()
    for tema in ['claro', 'escuro']:
        for largura in [1280, 320]:
            ctx = b.new_context(viewport={'width': largura, 'height': 900}, color_scheme='dark' if tema=='escuro' else 'light')
            pg = ctx.new_page()
            pg.goto(BASE); pg.wait_for_timeout(500)
            if tema == 'escuro': pg.evaluate("document.documentElement.setAttribute('data-tema','escuro')")
            for r in ROTAS:
                pg.evaluate(f"location.hash='{r}'"); pg.wait_for_timeout(300)
                if r == '#/cadastro':  # força estado de erro para auditar as mensagens
                    pg.evaluate("document.querySelector('#formulario-cadastro').requestSubmit()"); pg.wait_for_timeout(200)
                res = pg.evaluate(JS)
                # rolagem horizontal (WCAG 1.4.10 reflow)
                overflow = pg.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
                prob = {k: v for k, v in res.items() if v}
                print(f"[{tema} {largura}px] {r}: " + ('OK' if not prob and overflow <= 0 else json.dumps(prob, ensure_ascii=False)[:900] + (f' overflow={overflow}px' if overflow>0 else '')))
            ctx.close()
    b.close()
