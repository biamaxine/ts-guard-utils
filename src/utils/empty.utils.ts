import { isObject, isTypeOf } from './types.utils';

/**
 * Representa um objeto plano (plain object), ou seja, um objeto cujo protótipo
 * é exatamente `Object.prototype`.
 */
export type PlainObject = Record<string, unknown>;

/**
 * Verifica se o valor é um objeto plano (plain object), ou seja, que possui
 * protótipo igual a `Object.prototype`.
 *
 * @typeguard `value is PlainObject`
 * @param value - `unknown` - Valor a ser testado.
 * @return `value is PlainObject` - Verdadeiro se for um objeto plano.
 *
 * @remarks
 *  **value** - Esta função considera apenas objetos cujo protótipo seja
 *  estritamente igual a `Object.prototype`. Objetos criados com
 *  `Object.create(null)`, instâncias de classes ou objetos com protótipo
 *  modificado não são considerados planos.
 *
 * @example
 *  const obj = { a: 1 };
 *  if (isPlainObject(obj)) {
 *    // obj é PlainObject
 *  }
 *
 *  isPlainObject(new Date()); // false
 *  isPlainObject(Object.create({ a: 1 })); // false
 */
export function isPlainObject(value: unknown): value is PlainObject {
  return isObject(value) && Object.getPrototypeOf(value) === Object.prototype;
}

/**
 * Verifica se o valor está vazio: string vazia (`''`), array vazio (`[]`) ou
 * objeto plano sem propriedades próprias.
 *
 * @param value - `string | unknown[] | object` - Valor a ser verificado.
 * @return `boolean` - Verdadeiro se o valor estiver vazio.
 *
 * @remarks
 *  **value** - A verificação para objetos aplica-se apenas a objetos planos
 *  (ver `isPlainObject`). Objetos não planos, como instâncias de classes ou
 *  objetos com protótipo diferente de `Object.prototype`, sempre retornam
 *  `false`, mesmo que não tenham propriedades próprias.
 *
 * @example
 *  isEmpty('');   // true
 *  isEmpty([]);   // true
 *  isEmpty({});   // true
 *  isEmpty('abc'); // false
 *  isEmpty([1]);   // false
 *  isEmpty({ a: 1 }); // false
 *  isEmpty(new Date()); // false (não é um objeto plano)
 */
export function isEmpty(value: string | unknown[] | object): boolean {
  if (isTypeOf(value, 'string', 'array')) return value.length === 0;
  if (!isPlainObject(value)) return false;
  for (const k in value) if (Object.hasOwn(value, k)) return true;
  return false;
}

/**
 * Verifica se o valor não está vazio. É a negação lógica de `isEmpty`.
 *
 * @param value - `string | unknown[] | object` - Valor a ser verificado.
 * @return `boolean` - Verdadeiro se o valor não estiver vazio.
 *
 * @remarks
 *  **value** - Segue as mesmas regras de `isEmpty`: para objetos, apenas
 *  objetos planos com pelo menos uma propriedade própria são considerados não
 *  vazios.
 *
 * @example
 *  isNotEmpty('abc'); // true
 *  isNotEmpty([1]);   // true
 *  isNotEmpty({ a: 1 }); // true
 *  isNotEmpty('');    // false
 *  isNotEmpty([]);    // false
 *  isNotEmpty({});    // false
 *  isNotEmpty(new Date()) // true (não é um objeto plano)
 */
export function isNotEmpty(value: string | unknown[] | object): boolean {
  return !isEmpty(value);
}
