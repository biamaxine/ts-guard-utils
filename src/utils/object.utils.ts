import { isEmpty, PlainObject } from './empty.utils';
import { isString } from './types.utils';

/**
 * Cria um novo objeto contendo apenas as propriedades especificadas.
 *
 * @template T - Tipo do objeto de entrada (deve ser `PlainObject`).
 * @template K - Chaves a serem selecionadas (por padrão, todas as chaves de `T`).
 * @param object - `T` - Objeto plano de onde extrair as propriedades.
 * @param keys - `K[]` - Lista de chaves a serem mantidas.
 * @returns `Pick<T, K>` - Novo objeto com apenas as propriedades selecionadas.
 *
 * @remarks
 *  - Se `object` ou `keys` estiverem vazios, retorna um objeto vazio (`{}`).
 *  - Chaves duplicadas são ignoradas automaticamente (usando `Set`).
 *  - A função só funciona com objetos planos (`PlainObject`).
 *
 * @example
 *  const obj = { a: 1, b: 2, c: 3 };
 *  pick(obj, 'a', 'c'); // { a: 1, c: 3 }
 *  pick(obj); // {} (keys vazio)
 *  pick({}, 'a'); // {} (objeto vazio)
 */
export function pick<T extends PlainObject, K extends keyof T = keyof T>(
  object: T,
  ...keys: K[]
): Pick<T, K> {
  if (isEmpty(object) || isEmpty(keys)) return {} as Pick<T, K>;
  const result: PlainObject = {};
  for (const k of new Set(keys)) result[k as string] = object[k];
  return result as Pick<T, K>;
}

/**
 * Cria um novo objeto excluindo as propriedades especificadas.
 *
 * @template T - Tipo do objeto de entrada (deve ser `PlainObject`).
 * @template K - Chaves a serem omitidas (por padrão, todas as chaves de `T`).
 * @param object - `T` - Objeto plano de onde remover as propriedades.
 * @param keys - `K[]` - Lista de chaves a serem excluídas.
 * @returns `Omit<T, K>` - Novo objeto sem as propriedades omitidas.
 *
 * @remarks
 *  - Se `object` ou `keys` estiverem vazios, retorna uma cópia superficial do
 *    objeto original.
 *  - Chaves duplicadas são ignoradas (usando `Set`).
 *  - A função só funciona com objetos planos (`PlainObject`).
 *
 * @example
 *  const obj = { a: 1, b: 2, c: 3 };
 *  omit(obj, 'b'); // { a: 1, c: 3 }
 *  omit(obj); // { a: 1, b: 2, c: 3 } (cópia)
 *  omit({}, 'a'); // {} (objeto vazio)
 */
export function omit<T extends PlainObject, K extends keyof T = keyof T>(
  object: T,
  ...keys: K[]
): Omit<T, K> {
  if (isEmpty(object) || isEmpty(keys)) return { ...object };
  const result: PlainObject = {};
  const set = new Set(keys as string[]);
  for (const k in object)
    if (isKeyOf(object, k) && !set.has(k)) result[k] = object[k];
  return result as Omit<T, K>;
}

/**
 * Verifica se uma determinada chave (string) é uma propriedade própria do
 * objeto.
 *
 * @template T - Tipo do objeto (deve ser `PlainObject`).
 * @template K - Chave inferida (para uso em type guard).
 * @param object - `T` - Objeto a ser verificado.
 * @param key - `unknown` - Chave a ser testada.
 * @returns `key is K` - `true` se a chave for uma string e for uma propriedade própria do objeto.
 *
 * @remarks
 *  - A função é um type guard que refina o tipo da chave para `keyof T`.
 *  - Usa `Object.hasOwn` para verificar propriedades próprias (não herdadas).
 *
 * @example
 *  const obj = { a: 1, b: 2 };
 *  if (isKeyOf(obj, 'a')) {
 *    // 'a' é do tipo keyof typeof obj
 *  }
 *  isKeyOf(obj, 'c'); // false
 *  isKeyOf(obj, 123); // false (não é string)
 */
export function isKeyOf<T extends PlainObject, K extends keyof T = keyof T>(
  object: T,
  key: unknown,
): key is K {
  return isString(key) && Object.hasOwn(object, key);
}

/**
 * Verifica se um determinado valor existe como valor de alguma propriedade do
 * objeto.
 *
 * @template T - Tipo do objeto (deve ser `PlainObject`).
 * @template K - Chave inferida para o type guard (opcional).
 * @param object - `T` - Objeto a ser verificado.
 * @param value - `unknown` - Valor a ser procurado.
 * @returns `value is T[K]` - `true` se o valor for encontrado em alguma propriedade (comparação estrita `===`).
 *
 * @remarks
 *  - A função é um type guard que refina o tipo do valor para o tipo das
 *    propriedades do objeto.
 *  - A verificação é feita com igualdade estrita (`===`).
 *  - A busca percorre todas as propriedades próprias do objeto até encontrar
 *    uma correspondência.
 *
 * @example
 *  const obj = { a: 1, b: 2 };
 *  if (isValueOf(obj, 2)) {
 *    // 2 é do tipo (typeof obj)[keyof typeof obj]
 *  }
 *  isValueOf(obj, 3); // false
 */
export function isValueOf<T extends PlainObject, K extends keyof T = keyof T>(
  object: T,
  value: unknown,
): value is T[K] {
  for (const k in object)
    if (isKeyOf(object, k) && object[k] === value) return true;

  return false;
}

/**
 * Verifica se um par [chave, valor] corresponde a uma entrada (propriedade) do
 * objeto.
 *
 * @template T - Tipo do objeto (deve ser `PlainObject`).
 * @template K - Chave inferida para o type guard.
 * @param object - `T` - Objeto a ser verificado.
 * @param entry - `[unknown, unknown]` - Par contendo chave e valor a serem testados.
 * @returns `entry is [K, T[K]]` - `true` se a chave existir no objeto e o valor for estritamente igual ao valor da propriedade.
 *
 * @remarks
 *  - A função é um type guard que refina a tupla para `[keyof T, T[keyof T]]`.
 *  - Usa `isKeyOf` para validar a chave e depois compara o valor com `===`.
 *
 * @example
 *  const obj = { a: 1, b: 2 };
 *  if (isEntryOf(obj, ['a', 1])) {
 *    // entry é do tipo ['a', number]
 *  }
 *  isEntryOf(obj, ['b', 3]); // false
 *  isEntryOf(obj, ['c', 1]); // false (chave não existe)
 */
export function isEntryOf<T extends PlainObject, K extends keyof T = keyof T>(
  object: T,
  entry: [unknown, unknown],
): entry is [K, T[K]] {
  return isKeyOf(object, entry[0]) && object[entry[0]] === entry[1];
}
