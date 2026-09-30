/** Camada sobre o localStorage: chaves com prefixo/versão, JSON e tolerância a falhas. */
const PREFIXO = 'semente-ativa:v1:';

export const store = {
  ler(chave, padrao) {
    try {
      const bruto = window.localStorage.getItem(PREFIXO + chave);
      return bruto === null ? padrao : JSON.parse(bruto);
    } catch (e) { return padrao; }
  },
  gravar(chave, valor) {
    try { window.localStorage.setItem(PREFIXO + chave, JSON.stringify(valor)); return true; }
    catch (e) { return false; } // cota cheia, modo privado ou armazenamento bloqueado
  },
  remover(chave) {
    try { window.localStorage.removeItem(PREFIXO + chave); } catch (e) { /* ignora */ }
  }
};
