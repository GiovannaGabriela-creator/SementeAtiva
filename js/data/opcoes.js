/** Listas de opções compartilhadas entre formulário, tabela e filtros. */
export const AREAS = [
  ['alimentar', 'Segurança alimentar'],
  ['educacao', 'Educação'],
  ['saude', 'Saúde e apoio psicossocial'],
  ['ambiental', 'Meio ambiente']
];
export const DISPONIBILIDADES = [
  ['semanal', 'Semanal'], ['quinzenal', 'Quinzenal'], ['mensal', 'Mensal'], ['eventual', 'Eventual / pontual']
];
export const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
export const CATEGORIAS = [
  ['alimentar', 'Segurança alimentar'], ['educacao', 'Educação'], ['saude', 'Saúde'], ['ambiental', 'Meio ambiente']
];
export const STATUS = [['ativo', 'Ativo'], ['andamento', 'Em andamento'], ['concluido', 'Concluído']];

export function rotulo(lista, valor) {
  const par = lista.find(function (p) { return p[0] === valor; });
  return par ? par[1] : valor;
}
