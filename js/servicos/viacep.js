/** Consulta de CEP no ViaCEP. Devolve o endereço, ou null se o CEP não existir. */
export async function buscarCep(cep, sinal) {
  const resposta = await fetch('https://viacep.com.br/ws/' + cep + '/json/', { signal: sinal });
  if (!resposta.ok) throw new Error('Falha na consulta do CEP');
  const dados = await resposta.json();
  return dados.erro ? null : dados;
}
