import test from 'node:test';
import assert from 'node:assert/strict';
import { cpfValido, telefoneValido, obrigatorio, minimo, email, idadeMinima, dataValida, dataLimiteISO, executar } from '../../js/validacao/validadores.js';
import { mascararCPF, mascararTelefone, mascararCEP, somenteDigitos } from '../../js/validacao/mascaras.js';

test('CPF: aceita válido e recusa dígito errado, sequência repetida e tamanho incorreto', () => {
  assert.equal(cpfValido('529.982.247-25'), true);
  assert.equal(cpfValido('529.982.247-24'), false);
  assert.equal(cpfValido('111.111.111-11'), false);
  assert.equal(cpfValido('123'), false);
});

test('telefone: exige DDD existente e celular começando com 9', () => {
  assert.equal(telefoneValido('(11) 91234-5678'), true);
  assert.equal(telefoneValido('(11) 3040-5060'), true);
  assert.equal(telefoneValido('(11) 81234-5678'), false);
  assert.equal(telefoneValido('(05) 91234-5678'), false);
});

test('regras: obrigatório trata texto, lista e booleano; executar devolve o primeiro erro', () => {
  assert.equal(obrigatorio('x')(''), 'x');
  assert.equal(obrigatorio('x')([]), 'x');
  assert.equal(obrigatorio('x')(false), 'x');
  assert.equal(obrigatorio('x')(['a']), '');
  assert.equal(executar([obrigatorio('vazio'), minimo(3, 'curto')], 'ab', {}), 'curto');
  assert.equal(executar([obrigatorio('vazio'), minimo(3, 'curto')], '', {}), 'vazio');
});

test('e-mail e datas', () => {
  assert.equal(email('x')('maria@ex.com'), '');
  assert.equal(email('x')('maria@ex'), 'x');
  assert.equal(dataValida('x')('2999-01-01'), 'x');
  assert.equal(dataValida('x')('1990-05-10'), '');
  assert.equal(idadeMinima(13, 'x')(dataLimiteISO(13)), '');
  assert.equal(idadeMinima(13, 'x')('2100-01-01'), 'x');
});

test('máscaras', () => {
  assert.equal(mascararCPF('52998224725'), '529.982.247-25');
  assert.equal(mascararTelefone('11912345678'), '(11) 91234-5678');
  assert.equal(mascararTelefone('1130405060'), '(11) 3040-5060');
  assert.equal(mascararCEP('01310100'), '01310-100');
  assert.equal(somenteDigitos('(11) 9-1234'), '1191234');
});
