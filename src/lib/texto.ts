// Junta as duas últimas palavras com um espaço que não quebra, para nenhuma linha
// terminar com uma palavra sozinha (viúva). Funciona em qualquer navegador.
export const semViuva = (texto: string) => texto.replace(/ (\S+)\s*$/, " $1");
