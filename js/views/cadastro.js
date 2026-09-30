import { html, montar } from '../core/template.js';
import { campoTexto, campoSelect, campoTextarea, grupoCheckbox, campoTermos } from '../components/campos.js';
import { AREAS, DISPONIBILIDADES, UFS } from '../data/opcoes.js';
import { adicionar } from '../data/voluntarios.js';
import { salvarRascunho, carregarRascunho, descartarRascunho } from '../data/rascunho.js';
import { aplicarMascara, mascararCPF, mascararTelefone, mascararCEP, somenteDigitos } from '../validacao/mascaras.js';
import { obrigatorio, minimo, email, cpf, telefone, cep, dataValida, idadeMinima, dataLimiteISO } from '../validacao/validadores.js';
import { ligarFormulario } from '../validacao/formulario.js';
import { buscarCep } from '../servicos/viacep.js';
import { alerta, toast, confirmar, informar } from '../ui/feedback.js';

const regras = {
  nome: [obrigatorio('Informe seu nome completo.'), minimo(3, 'O nome precisa ter ao menos 3 caracteres.')],
  cpf: [obrigatorio('Informe seu CPF.'), cpf('Digite um CPF válido, com 11 dígitos.')],
  nascimento: [obrigatorio('Informe sua data de nascimento.'), dataValida('Informe uma data válida.'), idadeMinima(13, 'É preciso ter 13 anos ou mais.')],
  email: [obrigatorio('Informe seu e-mail.'), email('Digite um e-mail válido, como voce@email.com.')],
  telefone: [obrigatorio('Informe seu telefone com DDD.'), telefone('Digite um telefone válido, com DDD.')],
  cep: [obrigatorio('Informe seu CEP.'), cep('Digite um CEP válido, com 8 dígitos.')],
  rua: [obrigatorio('Informe o nome da rua.')],
  bairro: [obrigatorio('Informe o bairro.')],
  numero: [obrigatorio('Informe o número (ou "S/N").')],
  cidade: [obrigatorio('Informe a cidade.')],
  estado: [obrigatorio('Selecione um estado.')],
  areas: [obrigatorio('Selecione ao menos uma área de interesse.')],
  disponibilidade: [obrigatorio('Selecione sua disponibilidade.')],
  termos: [obrigatorio('É necessário aceitar os termos para continuar.')]
};

const modelo = () => html`
<div data-view="cadastro">
  <div class="cabecalho-pagina"><div class="envolucro">
    <p class="trilha"><a href="#/">Início</a> / <span aria-current="page">Cadastro de voluntário</span></p>
    <h1>Faça parte do Instituto Semente Ativa</h1>
    <p class="hero__texto">Preencha seus dados abaixo. Leva cerca de cinco minutos e nossa equipe entrará em contato para combinar os próximos passos.</p>
  </div></div>
  <section class="secao" aria-labelledby="titulo-formulario"><div class="envolucro">
    <h2 id="titulo-formulario" class="somente-leitor-tela">Formulário de cadastro</h2>
    <div class="layout-cadastro">
      <form class="formulario" id="formulario-cadastro" novalidate autocomplete="on">
        <div class="regiao-status" id="status-formulario" role="status" aria-live="polite" tabindex="-1"></div>
        <fieldset>
          <legend>Dados pessoais</legend>
          ${campoTexto({ id: 'nome', rotulo: 'Nome completo', placeholder: 'Ex.: Maria da Silva', autocomplete: 'name', maxlength: 120 })}
          <div class="linha-campos linha-campos--2">
            ${campoTexto({ id: 'cpf', rotulo: 'CPF', placeholder: '000.000.000-00', inputmode: 'numeric', autocomplete: 'off', maxlength: 14 })}
            ${campoTexto({ id: 'nascimento', rotulo: 'Data de nascimento', tipo: 'date', autocomplete: 'bday' })}
          </div>
          <div class="linha-campos linha-campos--2">
            ${campoTexto({ id: 'email', rotulo: 'E-mail', tipo: 'email', placeholder: 'voce@email.com', autocomplete: 'email' })}
            ${campoTexto({ id: 'telefone', rotulo: 'Telefone com DDD', tipo: 'tel', placeholder: '(00) 00000-0000', inputmode: 'numeric', autocomplete: 'tel', maxlength: 15 })}
          </div>
        </fieldset>
        <fieldset>
          <legend>Endereço</legend>
          <div class="linha-campos linha-campos--cep">
            ${campoTexto({ id: 'cep', rotulo: 'CEP', placeholder: '00000-000', inputmode: 'numeric', autocomplete: 'postal-code', maxlength: 9, aviso: true })}
            ${campoTexto({ id: 'rua', rotulo: 'Rua / Logradouro', placeholder: 'Preenchido automaticamente pelo CEP', autocomplete: 'address-line1' })}
          </div>
          <div class="linha-campos linha-campos--endereco">
            ${campoTexto({ id: 'bairro', rotulo: 'Bairro', autocomplete: 'address-line2' })}
            ${campoTexto({ id: 'numero', rotulo: 'Número' })}
          </div>
          <div class="linha-campos linha-campos--cidade">
            ${campoTexto({ id: 'cidade', rotulo: 'Cidade', autocomplete: 'address-level2' })}
            ${campoSelect({ id: 'estado', rotulo: 'UF', autocomplete: 'address-level1', opcoes: UFS.map((u) => [u, u]) })}
          </div>
        </fieldset>
        <fieldset>
          <legend>Interesse em voluntariado</legend>
          ${grupoCheckbox({ nome: 'areas', rotulo: 'Áreas de interesse', dica: 'selecione ao menos uma', opcoes: AREAS })}
          ${campoSelect({ id: 'disponibilidade', rotulo: 'Disponibilidade', opcoes: DISPONIBILIDADES })}
          ${campoTextarea({ id: 'mensagem', rotulo: 'Conte um pouco sobre você', placeholder: 'Experiências anteriores, habilidades ou motivações que queira compartilhar', maxlength: 500 })}
        </fieldset>
        ${campoTermos({ id: 'termos', texto: 'Li e concordo com o uso dos meus dados para fins de cadastro de voluntariado, conforme a Lei Geral de Proteção de Dados (LGPD).' })}
        <div class="acoes-formulario">
          <button type="submit" class="botao botao--primario botao--grande">Enviar cadastro</button>
          <button type="reset" class="botao botao--fantasma">Limpar formulário</button>
        </div>
      </form>
      <aside class="painel-lateral" aria-labelledby="titulo-painel">
        <h2 id="titulo-painel">Antes de enviar</h2>
        <ul>
          <li>Seus dados são usados apenas para contato sobre oportunidades de voluntariado.</li>
          <li>O CEP preenche automaticamente rua, bairro, cidade e estado — você pode ajustar se necessário.</li>
          <li>Enquanto você preenche, um rascunho fica salvo neste navegador (sem o CPF e sem o aceite dos termos).</li>
          <li>Após o envio, nossa equipe entra em contato em até 5 dias úteis.</li>
          <li>Dúvidas? Escreva para <a href="mailto:voluntarios@institutosementeativa.org.br">voluntarios@institutosementeativa.org.br</a>.</li>
        </ul>
      </aside>
    </div>
  </div></section>
</div>`;

function preencher(form, dados) {
  Object.keys(dados).forEach((nome) => {
    if (nome === 'areas') {
      form.querySelectorAll('input[name="areas"]').forEach((c) => { c.checked = dados.areas.indexOf(c.value) !== -1; });
    } else if (form.elements[nome] && form.elements[nome].type !== 'checkbox') {
      form.elements[nome].value = dados[nome];
    }
  });
}

export const cadastro = {
  titulo: 'Cadastro de voluntário',
  montar(raiz) {
    montar(raiz, modelo());
    const form = raiz.querySelector('#formulario-cadastro');
    const status = raiz.querySelector('#status-formulario');
    const avisoCep = raiz.querySelector('#aviso-cep');
    const controle = ligarFormulario(form, regras);

    aplicarMascara(form.elements.cpf, mascararCPF);
    aplicarMascara(form.elements.telefone, mascararTelefone);
    aplicarMascara(form.elements.cep, mascararCEP);
    form.elements.nascimento.max = dataLimiteISO(13);

    // ----- rascunho (localStorage) -----
    const rascunho = carregarRascunho();
    if (rascunho) {
      preencher(form, rascunho);
      toast('info', 'Rascunho recuperado. Seu CPF e o aceite dos termos não são guardados.');
    }
    let temporizador = null;
    const agendar = () => {
      window.clearTimeout(temporizador);
      temporizador = window.setTimeout(() => { temporizador = null; salvarRascunho(controle.dados()); }, 400);
    };
    form.addEventListener('input', agendar);
    form.addEventListener('change', agendar);

    // ----- busca de CEP -----
    let consulta = null;
    form.elements.cep.addEventListener('blur', async () => {
      const numero = somenteDigitos(form.elements.cep.value);
      if (numero.length !== 8) return;
      if (consulta) consulta.abort();
      consulta = new AbortController();
      avisoCep.textContent = 'Buscando endereço...';
      try {
        const e = await buscarCep(numero, consulta.signal);
        if (!e) { avisoCep.textContent = 'CEP não encontrado. Preencha o endereço manualmente.'; return; }
        if (!form.elements.rua.value) form.elements.rua.value = e.logradouro || '';
        if (!form.elements.bairro.value) form.elements.bairro.value = e.bairro || '';
        form.elements.cidade.value = e.localidade || '';
        form.elements.estado.value = e.uf || '';
        ['rua', 'bairro', 'cidade', 'estado'].forEach((n) => { if (controle.temErro(n)) controle.validarCampo(n); });
        avisoCep.textContent = 'Endereço preenchido automaticamente. Confira antes de enviar.';
        agendar();
      } catch (erro) {
        if (erro.name !== 'AbortError') avisoCep.textContent = 'Não foi possível buscar o CEP agora. Preencha o endereço manualmente.';
      }
    });

    // ----- limpar (com confirmação quando há dados) -----
    let limpezaConfirmada = false;
    form.addEventListener('reset', (evento) => {
      if (limpezaConfirmada) { limpezaConfirmada = false; window.setTimeout(() => controle.limparEstado(), 0); return; }
      const preenchido = Array.from(new FormData(form)).some((par) => String(par[1]).trim() !== '');
      if (!preenchido) return;
      evento.preventDefault();
      confirmar({ titulo: 'Limpar o formulário?', mensagem: 'Todos os dados preenchidos serão apagados. Essa ação não pode ser desfeita.',
        confirmar: 'Limpar', cancelar: 'Manter dados', tipo: 'aviso' }).then((ok) => {
        if (!ok) return;
        window.clearTimeout(temporizador);
        descartarRascunho();
        limpezaConfirmada = true;
        form.reset();
        status.replaceChildren();
        avisoCep.textContent = '';
        toast('info', 'Formulário limpo.');
        form.elements.nome.focus();
      });
    });

    // ----- envio -----
    form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const { valido, primeiro } = controle.validarTudo();
      if (!valido) {
        alerta(status, 'erro', 'Há campos que precisam de atenção. Revise a mensagem indicada em cada campo.');
        if (primeiro) primeiro.focus();
        return;
      }
      const resultado = adicionar(controle.dados());
      if (!resultado.ok) {
        if (resultado.erro === 'cpf-duplicado') {
          controle.mostrarErro('cpf', 'Já existe um cadastro com este CPF neste navegador.');
          alerta(status, 'erro', 'Este CPF já foi cadastrado neste navegador.');
          form.elements.cpf.focus();
        } else {
          alerta(status, 'erro', 'Não foi possível salvar: o armazenamento do navegador está indisponível.');
        }
        return;
      }
      window.clearTimeout(temporizador);
      descartarRascunho();
      limpezaConfirmada = true; // limpeza programática: não pede confirmação
      form.reset();
      controle.limparEstado();
      avisoCep.textContent = '';
      alerta(status, 'sucesso', 'Cadastro enviado com sucesso! Em breve nossa equipe entrará em contato por e-mail ou telefone.');
      informar({ titulo: 'Cadastro enviado', mensagem: 'Recebemos seus dados. Nossa equipe entra em contato em até 5 dias úteis.',
        confirmar: 'Entendi', tipo: 'sucesso' }).then(() => status.focus());
    });

    // limpeza ao sair da rota: grava o que estiver pendente e cancela pedidos em andamento
    return () => {
      if (temporizador) { window.clearTimeout(temporizador); salvarRascunho(controle.dados()); }
      if (consulta) consulta.abort();
    };
  }
};
