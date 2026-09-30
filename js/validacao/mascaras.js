/** Máscaras de entrada (CPF, telefone, CEP). O valor puro é sempre extraído com somenteDigitos. */
export function somenteDigitos(valor) { return (valor || '').replace(/\D/g, ''); }

export function mascararCPF(d) {
  d = d.slice(0, 11);
  return d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}
export function mascararTelefone(d) {
  d = d.slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2');
}
export function mascararCEP(d) { return d.slice(0, 8).replace(/(\d{5})(\d{1,3})$/, '$1-$2'); }

/** Aplica a máscara mantendo o cursor ao lado do mesmo dígito. */
export function aplicarMascara(campo, funcao) {
  campo.addEventListener('input', function () {
    const pos = campo.selectionStart == null ? campo.value.length : campo.selectionStart;
    const digitosAntes = somenteDigitos(campo.value.slice(0, pos)).length;
    campo.value = funcao(somenteDigitos(campo.value));
    let nova = digitosAntes === 0 ? 0 : campo.value.length;
    let contados = 0;
    for (let i = 0; i < campo.value.length && digitosAntes > 0; i++) {
      if (/\d/.test(campo.value[i])) contados++;
      if (contados === digitosAntes) { nova = i + 1; break; }
    }
    try { campo.setSelectionRange(nova, nova); } catch (e) { /* tipos sem seleção */ }
  });
}
