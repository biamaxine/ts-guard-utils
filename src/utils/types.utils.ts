/* eslint-disable @typescript-eslint/no-unsafe-function-type */

/**
 * Mapeia strings literais para os respectivos tipos em tempo de execução.
 *
 * @example
 *  const example: TypeMap['string'] = 'example';
 */
export interface TypeMap {
  undefined: undefined;
  string: string;
  number: number;
  boolean: boolean;
  symbol: symbol;
  bigint: bigint;
  function: Function;
  object: object;
  null: null;
  array: unknown[];
}

/**
 * União das chaves do mapa de tipos.
 *
 * @example
 *  const value: unknown = 'example';
 *  const example1: TypeOf = typeof value; // 'string'
 *  const example2: TypeOf = 'null';
 *  const example2: TypeOf = 'array';
 */
export type TypeOf = keyof TypeMap;

/**
 * Recupera o tipo correspondente à chave fornecida.
 *
 * @example
 *  let example: Type<'string' | 'number'> = 'example'; // string | number
 *  example = 1;
 *
 *  example = true // TypeErr: Type 'boolean' is not assignable to type 'Type<"string" | "number">'.
 */
export type Type<T extends TypeOf> = TypeMap[T];

/**
 * Determina o tipo primitivo ou categorizado de um valor com tratamento
 * especial para `null` e `array`.
 *
 * @param value - `unknown` - Valor a ser inspecionado.
 * @return `TypeOf` - O tipo identificado.
 *
 * @example
 *  typeOf(null); // 'null'
 *  typeOf([]);   // 'array'
 *  typeOf('');   // 'string'
 */
export function typeOf(value: unknown): TypeOf {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

/**
 * Verifica se o tipo do valor está entre os tipos especificados. Sempre retorna
 * `false` se nenhum tipo for especificado.
 *
 * @typeguard `value is Type<T>`
 * @template T - Estende `TypeOf`.
 * @param value - `unknown` - Valor a ser testado.
 * @param ...types - `T[]` - Lista de tipos a serem verificados.
 * @return `value is Type<T>` - Verdadeiro se o tipo estiver na lista.
 *
 * @example
 *  if (isTypeOf(val, 'string', 'number')) {
 *    // val é string | number
 *  }
 *
 *  console.log(isTypeOf(val)); // false
 */
export function isTypeOf<T extends TypeOf>(
  value: unknown,
  ...types: T[]
): value is Type<T> {
  if (types.length === 0) return false;
  return types.includes(typeOf(value) as T);
}

/** Exclui um ou mais tipos do mapa, retornando a união dos tipos restantes. */
export type NotType<T extends TypeOf> = Type<Exclude<TypeOf, T>>;

/**
 * Verifica se o valor não pertence a nenhum dos tipos especificados. Sempre
 * retorna `true` se nenhum tipo for especificado.
 *
 * @typeguard `value is NotType<T>`
 * @template T - Estende `TypeOf`.
 * @param value - `unknown` - Valor a ser testado.
 * @param ...types - `T[]` - Lista de tipos a serem excluídos.
 * @return `value is NotType<T>` - Verdadeiro se o tipo não estiver na lista.
 *
 * @example
 *  if (isNotTypeOf(val, 'null', 'undefined')) {
 *    // val não é null nem undefined
 *  }
 *
 *  console.log(val); // true
 */
export function isNotTypeOf<T extends TypeOf>(
  value: unknown,
  ...types: T[]
): value is NotType<T> {
  return !isTypeOf(value, ...types);
}

type Aux<T> = T | T[];

function aux<T>(v: Aux<unknown>, cb: (item: unknown) => boolean): v is Aux<T> {
  return Array.isArray(v) ? v.every(cb) : cb(v);
}

/**
 * Verifica se o valor (ou todos os itens do array) é estritamente `undefined`.
 *
 * @remarks
 *  Possui sobrecargas para refinar o tipo corretamente:
 *  - `value is undefined` para entrada `unknown`.
 *  - `value is undefined[]` para entrada `unknown[]`.
 *
 * @typeguard `value is undefined | undefined[]`
 * @param value - `unknown | unknown[]` - Valor ou array a ser verificado.
 * @return `value is undefined | undefined[]` - Verdadeiro se todos os itens forem `undefined`.
 *
 * @remarks
 *  **value** - A função aceita tanto um valor único quanto um array. Se for um
 *  array, a verificação é aplicada a todos os elementos.
 *
 * @example
 *  const value: unknown = undefined;
 *  if (isUndefined(value)) {
 *    // value é undefined
 *  }
 *
 *  const array: unknown[] = [undefined, undefined, undefined];
 *  if (isUndefined(array)) {
 *    // value é undefined[]
 *  }
 */
export function isUndefined(value: unknown): value is undefined;
export function isUndefined(value: unknown[]): value is undefined[];
export function isUndefined(value: Aux<unknown>): value is Aux<undefined> {
  return aux(value, v => v === undefined);
}

/**
 * Verifica se o valor não é estritamente `undefined`.
 *
 * @typeguard `value is NotType<'undefined'>`
 * @param value - `unknown` - Valor a ser testado.
 * @return `value is NotType<'undefined'>` - Verdadeiro se não for `undefined`.
 *
 * @example
 *  if (isNotUndefined(val)) {
 *    // val não é undefined
 *  }
 */
export function isNotUndefined(value: unknown): value is NotType<'undefined'> {
  return !isUndefined(value);
}

/**
 * Verifica se o valor (ou todos os itens do array) é estritamente `null`.
 *
 * @remarks
 *  Possui sobrecargas para refinar o tipo corretamente:
 *  - `value is null` para entrada `unknown`.
 *  - `value is null[]` para entrada `unknown[]`.
 *
 * @typeguard `value is null | null[]`
 * @param value - `unknown | unknown[]` - Valor ou array a ser verificado.
 * @return `value is null | null[]` - Verdadeiro se todos os itens forem `null`.
 *
 * @remarks
 *  **value** - A função aceita tanto um valor único quanto um array. Se for um
 *  array, a verificação é aplicada a todos os elementos.
 *
 * @example
 *  const value: unknown = null;
 *  if (isNull(value)) {
 *    // value é null
 *  }
 *
 *  const array: unknown[] = [null, null, null];
 *  if (isNull(array)) {
 *    // value é null[]
 *  }
 */
export function isNull(value: unknown): value is null;
export function isNull(value: unknown[]): value is null[];
export function isNull(value: Aux<unknown>): value is Aux<null> {
  return aux(value, v => v === null);
}

/**
 * Verifica se o valor não é estritamente `null`.
 *
 * @typeguard `value is NotType<'null'>`
 * @param value - `unknown` - Valor a ser testado.
 * @return `value is NotType<'null'>` - Verdadeiro se não for `null`.
 *
 * @example
 *  if (isNotNull(val)) {
 *    // val não é null
 *  }
 */
export function isNotNull(value: unknown): value is NotType<'null'> {
  return !isNull(value);
}

/** Tipo que representa `null` ou `undefined`. */
export type Nullable = null | undefined;

/**
 * Verifica se o valor (ou todos os itens do array) é `null` ou `undefined`.
 *
 * @remarks
 *  Possui sobrecargas para refinar o tipo corretamente:
 *  - `value is Nullable` para entrada `unknown`.
 *  - `value is Nullable[]` para entrada `unknown[]`.
 *
 * @typeguard `value is Nullable | Nullable[]`
 * @param value - `unknown | unknown[]` - Valor ou array a ser verificado.
 * @return `value is Nullable | Nullable[]` - Verdadeiro se todos os itens forem anuláveis.
 *
 * @remarks
 *  **value** - A função aceita tanto um valor único quanto um array. Se for um
 *  array, a verificação é aplicada a todos os elementos.
 *
 * @example
 *  const value: unknown = null;
 *  if (isNullable(value)) {
 *    // value é null ou undefined
 *  }
 *
 *  const array: unknown[] = [null, undefined, null];
 *  if (isNullable(array)) {
 *    // value é uma lista de nulos e/ou undefineds
 *  }
 */
export function isNullable(value: unknown): value is Nullable;
export function isNullable(value: unknown[]): value is Nullable[];
export function isNullable(value: Aux<unknown>): value is Aux<Nullable> {
  return aux(value, v => isTypeOf(v, 'undefined', 'null'));
}

/**
 * Verifica se o valor não é `null` nem `undefined`.
 *
 * @typeguard `value is NotType<'null' | 'undefined'>`
 * @param value - `unknown` - Valor a ser testado.
 * @return `value is NotType<'null' | 'undefined'>` - Verdadeiro se não for anulável.
 *
 * @example
 *  if (isNotNullable(val)) {
 *    // val não é null nem undefined
 *  }
 */
export function isNotNullable(value: unknown): value is NotType<`${Nullable}`> {
  return !isNullable(value);
}

/**
 * Verifica se o valor (ou todos os itens do array) é uma `string`.
 *
 * @remarks
 *  Possui sobrecargas para refinar o tipo corretamente:
 *  - `value is string` para entrada `unknown`.
 *  - `value is string[]` para entrada `unknown[]`.
 *
 * @typeguard `value is string | string[]`
 * @param value - `unknown | unknown[]` - Valor ou array a ser verificado.
 * @return `value is string | string[]` - Verdadeiro se todos os itens forem `string`.
 *
 * @remarks
 *  **value** - A função aceita tanto um valor único quanto um array. Se for um
 *  array, a verificação é aplicada a todos os elementos.
 *
 * @example
 *  const value: unknown = 'example';
 *  if (isString(value)) {
 *    // value é string
 *  }
 *
 *  const array: unknown[] = ['ex 1', 'ex 2', 'ex 3'];
 *  if (isString(array)) {
 *    // value é string[]
 *  }
 */
export function isString(value: unknown): value is string;
export function isString(value: unknown[]): value is string[];
export function isString(value: Aux<unknown>): value is Aux<string> {
  return aux(value, v => typeof v === 'string');
}

/**
 * Verifica se o valor não é uma `string`.
 *
 * @typeguard `value is NotType<'string'>`
 * @param value - `unknown` - Valor a ser testado.
 * @return `value is NotType<'string'>` - Verdadeiro se não for `string`.
 *
 * @example
 *  if (isNotString(val)) {
 *    // val não é string
 *  }
 */
export function isNotString(value: unknown): value is NotType<'string'> {
  return !isString(value);
}

/**
 * Verifica se o valor (ou todos os itens do array) é um `number`.
 *
 * @remarks
 *  Possui sobrecargas para refinar o tipo corretamente:
 *  - `value is number` para entrada `unknown`.
 *  - `value is number[]` para entrada `unknown[]`.
 *
 * @typeguard `value is number | number[]`
 * @param value - `unknown | unknown[]` - Valor ou array a ser verificado.
 * @return `value is number | number[]` - Verdadeiro se todos os itens forem `number`.
 *
 * @remarks
 *  **value** - A função aceita tanto um valor único quanto um array. Se for um
 *  array, a verificação é aplicada a todos os elementos.
 *
 * @example
 *  const value: unknown = 0;
 *  if (isNumber(value)) {
 *    // value é number
 *  }
 *
 *  const array: unknown[] = [0, 1, 2];
 *  if (isNumber(array)) {
 *    // value é number[]
 *  }
 */
export function isNumber(value: unknown): value is number;
export function isNumber(value: unknown[]): value is number[];
export function isNumber(value: Aux<unknown>): value is Aux<number> {
  return aux(value, v => typeof v === 'number');
}

/**
 * Verifica se o valor não é um `number`.
 *
 * @typeguard `value is NotType<'number'>`
 * @param value - `unknown` - Valor a ser testado.
 * @return `value is NotType<'number'>` - Verdadeiro se não for `number`.
 *
 * @example
 *  if (isNotNumber(val)) {
 *    // val não é number
 *  }
 */
export function isNotNumber(value: unknown): value is NotType<'number'> {
  return !isNumber(value);
}

/**
 * Verifica se o valor (ou todos os itens do array) é um `boolean`.
 *
 * @remarks
 *  Possui sobrecargas para refinar o tipo corretamente:
 *  - `value is boolean` para entrada `unknown`.
 *  - `value is boolean[]` para entrada `unknown[]`.
 *
 * @typeguard `value is boolean | boolean[]`
 * @param value - `unknown | unknown[]` - Valor ou array a ser verificado.
 * @return `value is boolean | boolean[]` - Verdadeiro se todos os itens forem `boolean`.
 *
 * @remarks
 *  **value** - A função aceita tanto um valor único quanto um array. Se for um
 *  array, a verificação é aplicada a todos os elementos.
 *
 * @example
 *  const value: unknown = true;
 *  if (isBoolean(value)) {
 *    // value é boolean
 *  }
 *
 *  const array: unknown[] = [true, false, true];
 *  if (isBoolean(array)) {
 *    // value é boolean[]
 *  }
 */
export function isBoolean(value: unknown): value is boolean;
export function isBoolean(value: unknown[]): value is boolean[];
export function isBoolean(value: Aux<unknown>): value is Aux<boolean> {
  return aux(value, v => typeof v === 'boolean');
}

/**
 * Verifica se o valor não é um `boolean`.
 *
 * @typeguard `value is NotType<'boolean'>`
 * @param value - `unknown` - Valor a ser testado.
 * @return `value is NotType<'boolean'>` - Verdadeiro se não for `boolean`.
 *
 * @example
 *  if (isNotBoolean(val)) {
 *    // val não é boolean
 *  }
 */
export function isNotBoolean(value: unknown): value is NotType<'boolean'> {
  return !isBoolean(value);
}

/**
 * Verifica se o valor (ou todos os itens do array) é um `symbol`.
 *
 * @remarks
 *  Possui sobrecargas para refinar o tipo corretamente:
 *  - `value is symbol` para entrada `unknown`.
 *  - `value is symbol[]` para entrada `unknown[]`.
 *
 * @typeguard `value is symbol | symbol[]`
 * @param value - `unknown | unknown[]` - Valor ou array a ser verificado.
 * @return `value is symbol | symbol[]` - Verdadeiro se todos os itens forem `symbol`.
 *
 * @remarks
 *  **value** - A função aceita tanto um valor único quanto um array. Se for um
 *  array, a verificação é aplicada a todos os elementos.
 *
 * @example
 *  const value: unknown = Symbol('example');
 *  if (isSymbol(value)) {
 *    // value é symbol
 *  }
 *
 *  const array: unknown[] = [Symbol('ex 1'), Symbol(ex 2), Symbol(ex 3)];
 *  if (isSymbol(array)) {
 *    // value é symbol[]
 *  }
 */
export function isSymbol(value: unknown): value is symbol;
export function isSymbol(value: unknown[]): value is symbol[];
export function isSymbol(value: Aux<unknown>): value is Aux<symbol> {
  return aux(value, v => typeof v === 'symbol');
}

/**
 * Verifica se o valor não é um `symbol`.
 *
 * @typeguard `value is NotType<'symbol'>`
 * @param value - `unknown` - Valor a ser testado.
 * @return `value is NotType<'symbol'>` - Verdadeiro se não for `symbol`.
 *
 * @example
 *  if (isNotSymbol(val)) {
 *    // val não é symbol
 *  }
 */
export function isNotSymbol(value: unknown): value is NotType<'symbol'> {
  return !isSymbol(value);
}

/**
 * Verifica se o valor (ou todos os itens do array) é um `bigint`.
 *
 * @remarks
 *  Possui sobrecargas para refinar o tipo corretamente:
 *  - `value is bigint` para entrada `unknown`.
 *  - `value is bigint[]` para entrada `unknown[]`.
 *
 * @typeguard `value is bigint | bigint[]`
 * @param value - `unknown | unknown[]` - Valor ou array a ser verificado.
 * @return `value is bigint | bigint[]` - Verdadeiro se todos os itens forem `bigint`.
 *
 * @remarks
 *  **value** - A função aceita tanto um valor único quanto um array. Se for um
 *  array, a verificação é aplicada a todos os elementos.
 *
 * @example
 *  const value: unknown = BigInt(0);
 *  if (isBigint(value)) {
 *    // value é bigint
 *  }
 *
 *  const array: unknown[] = [BigInt(0), BigInt(1), BigInt(2)];
 *  if (isBigint(array)) {
 *    // value é bigint[]
 *  }
 */
export function isBigint(value: unknown): value is bigint;
export function isBigint(value: unknown[]): value is bigint[];
export function isBigint(value: Aux<unknown>): value is Aux<bigint> {
  return aux(value, v => typeof v === 'bigint');
}

/**
 * Verifica se o valor não é um `bigint`.
 *
 * @typeguard `value is NotType<'bigint'>`
 * @param value - `unknown` - Valor a ser testado.
 * @return `value is NotType<'bigint'>` - Verdadeiro se não for `bigint`.
 *
 * @example
 *  if (isNotBigint(val)) {
 *    // val não é bigint
 *  }
 */
export function isNotBigint(value: unknown): value is NotType<'bigint'> {
  return !isBigint(value);
}

/**
 * Verifica se o valor (ou todos os itens do array) é uma função.
 *
 * @remarks
 *  Inclui funções declaradas, arrow functions, métodos e funções construtoras.
 *  Possui sobrecargas para refinar o tipo corretamente:
 *  - `value is Function` para entrada `unknown`.
 *  - `value is Function[]` para entrada `unknown[]`.
 *
 * @typeguard `value is Function | Function[]`
 * @param value - `unknown | unknown[]` - Valor ou array a ser verificado.
 * @return `value is Function | Function[]` - Verdadeiro se todos os itens forem funções.
 *
 * @remarks
 *  **value** - A função aceita tanto um valor único quanto um array. Se for um
 *  array, a verificação é aplicada a todos os elementos.
 *
 * @example
 *  const value: unknown = () => {};
 *  if (isFunction(value)) {
 *    // value é Function
 *  }
 *
 *  const array: unknown[] = [() => {}, Array.from, Date.constructor];
 *  if (isFunction(array)) {
 *    // value é Function[]
 *  }
 */
export function isFunction(value: unknown): value is Function;
export function isFunction(value: unknown[]): value is Function[];
export function isFunction(value: Aux<unknown>): value is Aux<Function> {
  return aux(value, v => typeof v === 'function');
}

/**
 * Verifica se o valor não é uma função.
 *
 * @typeguard `value is NotType<'function'>`
 * @param value - `unknown` - Valor a ser testado.
 * @return `value is NotType<'function'>` - Verdadeiro se não for uma função.
 *
 * @example
 *  if (isNotFunction(val)) {
 *    // val não é função
 *  }
 */
export function isNotFunction(value: unknown): value is NotType<'function'> {
  return !isFunction(value);
}

/**
 * Verifica se o valor (ou todos os itens do array) é um objeto.
 *
 * @remarks
 *  Considera objetos literais, instâncias de classes e Object.create(null),
 *  mas exclui `null`, arrays e funções.
 *  Possui sobrecargas para refinar o tipo corretamente:
 *  - `value is object` para entrada `unknown`.
 *  - `value is object[]` para entrada `unknown[]`.
 *
 * @typeguard `value is object | object[]`
 * @param value - `unknown | unknown[]` - Valor ou array a ser verificado.
 * @return `value is object | object[]` - Verdadeiro se todos os itens forem objetos.
 *
 * @remarks
 *  **value** - A função aceita tanto um valor único quanto um array. Se for um
 *  array, a verificação é aplicada a todos os elementos.
 *
 * @example
 *  const value: unknown = {};
 *  if (isObject(value)) {
 *    // value é object
 *  }
 *
 *  const array: unknown[] = [{}, Object.create(null), Date];
 *  if (isObject(array)) {
 *    // value é object[]
 *  }
 */
export function isObject(value: unknown): value is object;
export function isObject(value: unknown[]): value is object[];
export function isObject(value: Aux<unknown>): value is Aux<object> {
  return aux(value, v => isTypeOf(v, 'object'));
}

/**
 * Verifica se o valor não é um objeto.
 *
 * @typeguard `value is NotType<'object'>`
 * @param value - `unknown` - Valor a ser testado.
 * @return `value is NotType<'object'>` - Verdadeiro se não for um objeto.
 *
 * @example
 *  if (isNotObject(val)) {
 *    // val não é objeto
 *  }
 */
export function isNotObject(value: unknown): value is NotType<'object'> {
  return !isObject(value);
}

/**
 * Verifica se o valor é um array.
 *
 * @typeguard `value is unknown[]`
 * @param value - `unknown` - Valor a ser testado.
 * @return `value is unknown[]` - Verdadeiro se for um array.
 *
 * @example
 *  if (isArray(val)) {
 *    // val é unknown[]
 *  }
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Verifica se o valor não é um array.
 *
 * @typeguard `value is NotType<'array'>`
 * @param value - `unknown` - Valor a ser testado.
 * @return `value is NotType<'array'>` - Verdadeiro se não for um array.
 *
 * @example
 *  if (isNotArray(val)) {
 *    // val não é array
 *  }
 */
export function isNotArray(value: unknown): value is NotType<'array'> {
  return !isArray(value);
}

/**
 * Verifica se **todos** os elementos de um array pertencem a um dos tipos
 * especificados. Sempre retorna `true` se o array estiver vazio. Sempre retorna
 * `false` se nenhum tipo for especificado.
 *
 * @typeguard `value is Type<T>[]`
 * @template T - Tipos literais permitidos. Estende `TypeOf`.
 * @param value - `unknown[]` - Array cujos elementos serão verificados.
 * @param ...types - `T[]` - Lista de tipos que os elementos devem possuir.
 * @return `value is Type<T>[]` - Verdadeiro se todos os elementos forem pelo menos de um dos tipos especificados.
 *
 * @example
 *  const data: unknown[] = ['a', 'b', 'c'];
 *  if (isArrayOf(data, 'string')) {
 *    // data é string[]
 *  }
 *
 *  const mixed: unknown[] = [1, 'two', 3];
 *  if (isArrayOf(mixed, 'string', 'number')) {
 *    // mixed é (string | number)[]
 *  }
 */
export function isArrayOf<T extends TypeOf>(
  value: unknown[],
  ...types: T[]
): value is Type<T>[] {
  return value.every(v => isTypeOf(v, ...types));
}
