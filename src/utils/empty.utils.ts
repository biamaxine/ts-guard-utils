import { isObject, isTypeOf } from './types.utils';

/**
 * Tipo marcado que representa um objeto plano puro (`PlainObject`).
 *
 * @remarks
 *  O brand `_brand` garante que apenas objetos validados pela função
 *  `PlainObject` possam ser atribuídos a este tipo.
 *
 * @example
 *  const obj: PlainObject = PlainObject({ a: 1 });
 */
export type PlainObject = Record<string, unknown> & { _brand: PlainObject };

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
 * Converte um `Record<string, unknown>` em `PlainObject`, validando o tipo.
 *
 * @remarks
 *  Lança um `TypeError` caso o valor não seja um objeto plano.
 *
 * @param value - `Record<string, unknown>` - Objeto candidato a `PlainObject`.
 * @return `PlainObject` - O mesmo objeto com a marca de tipo nominal.
 *
 * @example
 *  const p = PlainObject({ x: 10 }); // p é PlainObject
 */
export function PlainObject(value: Record<string, unknown>): PlainObject {
  if (!isPlainObject(value)) throw new TypeError('value is not a PlainObject');
  return value;
}

/**
 * Verifica se uma string, array ou objeto plano está vazio.
 *
 * @remarks
 *  Para objetos planos, considera vazio se não houver propriedades próprias
 *  enumeráveis.
 *
 * @param value - `string | unknown[] | object` - Valor a ser analisado.
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
