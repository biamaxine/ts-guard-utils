import { isNotNullable, isString } from './types.utils';

/**
 * Remove elementos duplicados de um array, preservando a ordem.
 *
 * @template T - Tipo dos elementos do array.
 * @param array - `T[]` - Array de entrada que pode conter duplicatas.
 * @return `T[]` - Novo array sem elementos duplicados.
 *
 * @remarks
 *  A comparação é feita por igualdade referencial (`===`), portanto objetos
 *  com conteúdo idêntico, mas referências diferentes, não são considerados
 *  duplicados.
 *
 * @example
 *  clearDuplicates([1, 2, 2, 3]); // [1, 2, 3]
 *  clearDuplicates(['a', 'b', 'a']); // ['a', 'b']
 *  clearDuplicates([{ a: 1 }, { a: 1 }]); // [{ a: 1 }, { a: 1 }]
 */
export function clearDuplicates<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Remove todos os valores `undefined` de um array.
 *
 * @template T - Tipo dos elementos do array.
 * @param array - `(T | undefined)[]` - Array que pode conter `undefined`.
 * @return `T[]` - Novo array contendo apenas elementos definidos.
 *
 * @example
 *  clearUndefineds([0, undefined, '', false, null]); // [0, '', false, null]
 */
export function clearUndefineds<T>(array: (T | undefined)[]): T[] {
  return array.filter(v => v !== undefined);
}

/**
 * Remove todos os valores `null` de um array.
 *
 * @template T - Tipo dos elementos do array.
 * @param array - `(T | null)[]` - Array que pode conter `null`.
 * @return `T[]` - Novo array contendo apenas elementos não nulos.
 *
 * @example
 *  clearNulls([0, null, '', false, undefined]); // [0, '', false, undefined]
 */
export function clearNulls<T>(array: (T | null)[]): T[] {
  return array.filter(v => v !== null);
}

/**+
 * Remove todos os valores `null` e `undefined` de um array.
 *
 * @template T - Tipo dos elementos do array.
 * @param array - `(T | Nullable)[]` - Array que pode conter valores nulos/indefinidos.
 * @return `T[]` - Novo array contendo apenas elementos não nulos e não indefinidos.
 *
 * @example
 *  clearNullables([0, null, '', undefined, false]); // [0, '', false]
 */
export function clearNullables<T>(array: (T | undefined | null)[]): T[] {
  return array.filter(v => isNotNullable(v));
}

/**
 * Divide um array ou string em partes (`chunks`) de um tamanho (`size`)
 * específico.
 *
 * @remarks
 *  - Para string, retorna um array de substrings de comprimento `size` (a
 *    última pode ser menor).
 *  - Para array, retorna uma matriz `1:size`.
 *
 * @template T - Tipo dos elementos do array (usado apenas na sobrecarga para array).
 * @param value - `T[] | string` - O array ou string a ser dividido.
 * @param size - `number` - Tamanho de cada parte (deve ser `> 0`).
 * @return `T[][] | string[]` - Array contendo as partes.
 *
 * @example
 *  // Com array
 *  chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
 *
 *  // Com string
 *  chunk('abcdef', 2); // ['ab', 'cd', 'ef']
 *
 *  // size <= 0
 *  chunk([1, 2, 3, 4], -2); // []
 *
 *  // size >= value.length
 *  chunk([1, 2, 3, 4], 6); // [[1, 2, 3, 4]]
 */
export function chunk<T>(value: T[], size: number): T[][];
export function chunk(value: string, size: number): string[];
export function chunk<T>(value: string | T[], size: number): string[] | T[][] {
  if (size <= 0) return [];

  const str = isString(value);
  if (size >= value.length) return str ? [value] : [[...value]];

  const s = Math.floor(size);
  const copy = [...value];
  const result = Array.from({ length: Math.ceil(copy.length / s) }, (_, i) => {
    const j = i + 1;
    const chunk = copy.slice(i * s, j * s);
    return str ? chunk.join('') : chunk;
  });

  return result as string[] | T[][];
}

/**
 * =============================================================================
 * Todas as funções de aleatoriedade, definidas abaixo, recebem uma função
 * `random` que por padrão, assume `Math.random`. Essa escolha de design permite
 * que o desenvolvedor final tenha a possibilidade do introduzir aleatoriedade
 * de deterministica e/ou reprodutibilidade.
 *
 * Tendo ciência de que validar uma função de aleatoriedade exigiria uma gama de
 * testes extremamente ampla, além de um mínimo contexto do algorítimo e lógica
 * utilizadas, a biblioteca escolhe confiar que a função `random`, quando
 * fornecida, já foi validada e atende ao critério de resposta no intervalo
 * `[0,1)`, devolvendo ao desenvolvedor final exatamente a resposta obtida com o
 * uso da mesma.
 *
 * Esse comportamento será documentado e frizado no `README.md`.
 * =============================================================================
 */

/**
 * Embaralha um array ou string usando o algoritmo Fisher-Yates.
 *
 * @template T - Tipo dos elementos do array (usado apenas na sobrecarga para array).
 * @param value - `T[] | string` - Array ou string a ser embaralhado.
 * @param random - `() => number` - (opcional) Gerador de números aleatórios no intervalo `[0,1)` (padrão: `Math.random`).
 * @return `T[] | string` - Novo array ou string embaralhada (não modifica o original).
 *
 * @example
 *  shuffle([1, 2, 3, 4]); // pode retornar [3, 1, 4, 2]
 *  shuffle('abc'); // pode retornar 'bca'
 */
export function shuffle<T>(value: T[], random?: () => number): T[];
export function shuffle(value: string, random?: () => number): string;
export function shuffle<T>(
  value: T[] | string,
  random = Math.random,
): T[] | string {
  const copy = [...value];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return isString(value) ? copy.join('') : (copy as T[]);
}

/**
 * Gera um índice aleatório dentro dos limites de um array ou string.
 *
 * @param value - `unknown[] | string` - Array ou string cujo comprimento é usado como limite superior (exclusivo).
 * @param random - `() => number` - (opcional) Gerador de números aleatórios no intervalo `[0,1)` (padrão: `Math.random`).
 * @return `number` - Índice aleatório entre 0 e `value.length - 1`, ou `-1` se o valor estiver vazio.
 *
 * @example
 *  randomIndex([10, 20, 30]); // pode retornar 1
 *  randomIndex('hello'); // pode retornar 3
 *  randomIndex([]); // -1
 */
export function randomIndex(
  value: unknown[] | string,
  random = Math.random,
): number {
  return value.length === 0 ? -1 : Math.floor(random() * value.length);
}

/**
 * Seleciona aleatoriamente um elemento de um array ou caractere de uma string.
 *
 * @template T - Tipo dos elementos do array (usado na sobrecarga para array).
 * @param value - `T[] | string` - Array ou string de onde selecionar.
 * @param random - `() => number` - (opcional) Gerador de números aleatórios no intervalo `[0,1)` (padrão: `Math.random`).
 * @return `T | string | undefined` - Elemento/caractere selecionado, ou `undefined` se a coleção estiver vazia.
 *
 * @example
 *  randomItem([10, 20, 30]); // pode retornar 20
 *  randomItem('abc'); // pode retornar 'b'
 *  randomItem([]); // undefined
 */
export function randomItem<T>(value: T[], random?: () => number): T | undefined;
export function randomItem(
  value: string,
  random?: () => number,
): string | undefined;
export function randomItem<T>(
  value: T[] | string,
  random = Math.random,
): T | string | undefined {
  const index = randomIndex(value, random);
  return value[index];
}

/**
 * Remove e retorna um elemento aleatório de um array (modifica o array original).
 *
 * @template T - Tipo dos elementos do array.
 * @param value - `T[]` - Array do qual remover o elemento.
 * @param random - `() => number` - (opcional) Gerador de números aleatórios no intervalo `[0,1)` (padrão: `Math.random`).
 * @return `T | undefined` - Elemento removido, ou `undefined` se o array estiver vazio.
 *
 * @example
 *  const arr = [1, 2, 3];
 *  const item = takeRandomItem(arr); // item = 2, arr agora é [1, 3]
 */
export function takeRandomItem<T>(
  value: T[],
  random = Math.random,
): T | undefined {
  const index = randomIndex(value, random);
  return value.splice(index, 1)[0];
}

/**
 * Seleciona `n` elementos aleatórios distintos de um array ou caracteres de uma
 * string.
 *
 * @remarks
 *  - se `n` for maior ou igual ao comprimento, retorna todos os elementos
 *    embaralhados.
 *
 * @template T - Tipo dos elementos do array (usado na sobrecarga para array).
 * @param value - `T[] | string` - Coleção de origem.
 * @param n - `number` - Número de itens a selecionar (deve ser >= 0).
 * @param random - `() => number` - (opcional) Gerador de números aleatórios no intervalo `[0,1)` (padrão: `Math.random`).
 * @return `T[] | string[]` - Array contendo os elementos selecionados (para string, retorna um array de caracteres).
 *
 * @example
 *  randomItems([1, 2, 3, 4, 5], 2) // pode retornar [3, 1]
 *  randomItems('abcdef', 3) // pode retornar ['b', 'e', 'c']
 */
export function randomItems<T>(
  value: T[],
  n: number,
  random?: () => number,
): T[];
export function randomItems(
  value: string,
  n: number,
  random?: () => number,
): string[];
export function randomItems<T>(
  value: T[] | string,
  n: number,
  random = Math.random,
): T[] | string[] {
  const copy = [...value];
  return takeRandomItems(copy, n, random) as T[] | string[];
}

/**
 * Remove e retorna `n` elementos aleatórios de um array (modifica o array
 * original).
 *
 * @template T - Tipo dos elementos do array.
 * @param value - `T[]` - Array do qual remover os elementos.
 * @param n - `number` - Número de elementos a remover (deve ser >= 0).
 * @param random - `() => number` - (opcional) Gerador de números aleatórios no intervalo `[0,1)` (padrão: `Math.random`).
 * @return `T[]` - Array contendo os elementos removidos.
 *
 * @example
 *  const arr = [1, 2, 3, 4, 5];
 *  const removed = takeRandomItems(arr, 2); // removed = [4, 1], arr agora = [2, 3, 5]
 */
export function takeRandomItems<T>(
  value: T[],
  n: number,
  random = Math.random,
): T[] {
  if (n <= 0) return [];
  if (n >= value.length) {
    const shuffled = shuffle(value, random);
    value.length = 0;
    return shuffled;
  }

  return Array.from({ length: n }, () => takeRandomItem(value, random)!);
}
