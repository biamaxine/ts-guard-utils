import { isObject, isTypeOf } from './types.utils';

/**
 * Tipo marcado que representa um objeto plano puro (`PlainObject`).
 *
 * @example
 *  const obj: PlainObject = PlainObject({ a: 1 });
 */
export type PlainObject = Record<string, unknown>;

/**
 * Verifica se um valor é um objeto plano puro (`PlainObject`).
 *
 * @remarks
 *  Um `PlainObject` é um objeto cujo protótipo é exatamente `Object.prototype`.
 *
 * @typeguard `value is PlainObject`
 * @param value - `unknown` - Valor a ser verificado.
 * @return `value is PlainObject` - Verdadeiro se o valor for um objeto plano.
 *
 * @example
 *  const value = { a: 1 };
 *  if (isPlainObject(value)) {
 *    // value é PlainObject
 *  }
 *
 *  console.log({}); // true
 *  console.log(new Object()); // true
 *  console.log(new Date()); // false
 *  console.log(Object.create(null)); // false
 *  console.log(Object.create({ a: 1 })); // false
 */
export function isPlainObject(value: unknown): value is PlainObject {
  return isObject(value) && Object.getPrototypeOf(value) === Object.prototype;
}

/**
 * Verifica se uma string, array ou objeto plano está vazio.
 *
 * @remarks
 *  Para objetos planos, considera vazio se não houver propriedades próprias
 *  enumeráveis.
 *
 * @param value - `string | unknown[] | PlainObject` - Valor a ser analisado.
 * @return `boolean` - Verdadeiro se o valor estiver vazio.
 *
 * @remarks
 *  - **value** - Strings e arrays são verificados pela propriedade `length`.
 *    Objetos são avaliados iterando sobre propriedades próprias.
 *
 * @example
 *  isEmpty('');        // true
 *  isEmpty({});        // true
 *  isEmpty([]);        // true
 *  isEmpty('example'); // false
 *  isEmpty([1, 2, 3]); // false
 *  isEmpty({ a: 1 });  // false
 */
export function isEmpty(value: string | unknown[] | PlainObject): boolean {
  if (isTypeOf(value, 'string', 'array')) return value.length === 0;
  for (const k in value) if (Object.hasOwn(value, k)) return false;
  return true;
}

/**
 * Verifica se uma string, array ou objeto plano não está vazio.
 *
 * @remarks
 *  Para objetos planos, considera não-vazio se houver propriedades próprias
 *  enumeráveis.
 *
 * @param value - `string | unknown[] | object` - Valor a ser analisado.
 * @return `boolean` - Verdadeiro se o valor não estiver vazio.
 *
 * @remarks
 *  - **value** - Strings e arrays são verificados pela propriedade `length`.
 *    Objetos são avaliados iterando sobre propriedades próprias.
 *
 * @example
 *  isNotEmpty('example');  // true
 *  isNotEmpty([1, 2, 3]);  // true
 *  isNotEmpty({ a: 1 });   // true
 *  isNotEmpty('');         // false
 *  isNotEmpty([]);         // false
 *  isNotEmpty({});         // false
 */
export function isNotEmpty(value: string | unknown[] | PlainObject): boolean {
  return !isEmpty(value);
}
