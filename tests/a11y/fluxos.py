import json
from playwright.sync_api import sync_playwright
import sys
B=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:8080/index.html'
with sync_playwright() as p:
    b=p.chromium.launch(); ctx=b.new_context(viewport={'width':1280,'height':900}); pg=ctx.new_page()
    erros=[]; pg.on('pageerror',lambda e:erros.append(str(e)))
    pg.goto(B); pg.wait_for_timeout(500)
    # 1) a auditoria enxerga texto? (sanidade)
    print('textos com contraste medido >0:', pg.evaluate("[...document.querySelectorAll('body *')].filter(e=>[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())).length"))
    # 2) filtros: aria-pressed
    pg.evaluate("location.hash='#/projetos'"); pg.wait_for_timeout(300)
    print('aria-pressed inicial:', pg.eval_on_selector_all('[data-filtro]','els=>els.map(e=>e.getAttribute("aria-pressed"))'))
    pg.click('[data-filtro="saude"]'); pg.wait_for_timeout(200)
    print('após clicar saúde:', pg.eval_on_selector_all('[data-filtro]','els=>els.map(e=>e.getAttribute("aria-pressed"))'), '| visíveis:', pg.locator('#lista-projetos .projeto').count(), '| hash:', pg.evaluate('location.hash'))
    # 3) pular link + foco
    pg.evaluate("location.hash='#/'"); pg.wait_for_timeout(200); pg.reload(); pg.wait_for_timeout(400)
    pg.keyboard.press('Tab'); print('1º foco:', pg.evaluate('document.activeElement.className'))
    pg.keyboard.press('Enter'); print('após Enter no pular-link, foco em:', pg.evaluate('document.activeElement.id'), '| hash:', pg.evaluate('location.hash'))
    # 4) cadastro: erro, envio, duplicado, localStorage
    pg.evaluate("location.hash='#/cadastro'"); pg.wait_for_timeout(300)
    pg.click('button[type=submit]'); pg.wait_for_timeout(200)
    print('foco após envio vazio:', pg.evaluate('document.activeElement.id'), '| erro nome:', pg.inner_text('#erro-nome'))
    dados={'nome':'Maria da Silva','cpf':'52998224725','nascimento':'1990-05-10','email':'maria@ex.com','telefone':'11912345678','cep':'01310100','rua':'Av Paulista','bairro':'Bela Vista','numero':'100','cidade':'São Paulo'}
    for k,v in dados.items(): pg.fill('#'+k,v)
    pg.select_option('#estado','SP'); pg.select_option('#disponibilidade','semanal')
    print('máscara cpf/tel/cep:', pg.input_value('#cpf'), pg.input_value('#telefone'), pg.input_value('#cep'))
    pg.click('input[name=areas][value=educacao]')
    pg.click('button[type=submit]'); pg.wait_for_timeout(200)
    print('erro termos:', pg.inner_text('#erro-termos'))
    pg.check('#termos'); pg.click('button[type=submit]'); pg.wait_for_timeout(300)
    print('modal aberto:', pg.locator('dialog[open]').count(), '| foco no modal:', pg.evaluate("document.activeElement.closest('dialog')!==null"))
    pg.keyboard.press('Escape'); pg.wait_for_timeout(200)
    print('após Esc: modal', pg.locator('dialog[open]').count(), '| foco volta em:', pg.evaluate('document.activeElement.tagName+"."+document.activeElement.id'))
    print('localStorage:', pg.evaluate("Object.keys(localStorage)"))
    print('rascunho tem cpf?', pg.evaluate("'cpf' in (JSON.parse(localStorage.getItem('semente-ativa:v1:rascunho-cadastro')||'{}'))"))
    # duplicado
    for k,v in dados.items(): pg.fill('#'+k,v)
    pg.select_option('#estado','SP'); pg.select_option('#disponibilidade','semanal'); pg.click('input[name=areas][value=educacao]'); pg.check('#termos')
    pg.click('button[type=submit]'); pg.wait_for_timeout(300)
    print('duplicado:', pg.inner_text('#erro-cpf'))
    # 5) lista + excluir
    pg.evaluate("location.hash='#/voluntarios'"); pg.wait_for_timeout(300)
    print('linhas:', pg.locator('tbody tr').count(), '| cpf mascarado:', pg.inner_text('tbody td:nth-child(2)'))
    pg.click('[data-excluir]'); pg.wait_for_timeout(200); pg.click('dialog button.botao--primario'); pg.wait_for_timeout(400)
    print('após excluir: linhas', pg.locator('tbody tr').count(), '| toast:', pg.locator('.toast').count())
    # 6) tema
    pg.click('[data-tema=escuro]'); print('tema:', pg.evaluate("document.documentElement.dataset.tema"), pg.evaluate("localStorage.getItem('tema-semente-ativa')"))
    print('erros de página:', erros)
    b.close()
