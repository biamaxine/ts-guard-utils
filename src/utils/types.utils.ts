/* eslint-disable @typescript-eslint/no-unsafe-function-type */

/** =============================================================================
 * O código se propõe à substituir o `typeof` nativo (emprestado do JavaScript)
 * por uma implementação mais adaptada e coerente dentro do TypeScript.
 *
 * Partimos da idéia de que `null` e `Array` deveriam ser considerados tipos
 * primitivos em TypeScript, visto que são inferíveis de forma específica, e
 * ainda recebem tratamento alternativo de acordo com o cenário.
 *
 * Por exemplo, mesmo que `typeof null === 'object'`, ao inferir `null` à uma
 * variável em TypeScript, você ativamente impossibilita que, futuramente,
 * objetos (ou funções) sejam atribuídos à ela, diferente do JavaScript.
 *
 * Já para arrays, existe toda uma sintaxe específica criada apenas para esse
 * "objeto" (e.g. `const arr: string[]`), além de um tratamento diferenciado
 * para tuplas que, sequer existem em JavaScript.
 *
 * Dessa forma, o código redefine o tipo `object` como uma exclusão de nulos e
 * arrays.
 *
 * Vale ressaltar que, mesmo que funções ainda sejam objetos, o próprio
 * JavaScript já diferencia ambos ao incluir a possibilidade de 'function' como
 * retorno de `typeof`. O código absorve esse comportamento.
 * =============================================================================
 */

/**
 * Mapeamento de strings literais para os tipos correspondentes em tempo de
 * execução.
 *
 * @remarks
 *  - Fornece a base para os demais utilitários de tipo. As chaves representam
 *    os possíveis retornos de `typeOf`.
 */
export interface TypeMap {
  undefined: undefined;
  null: null;
  string: string;
  number: number;
  boolean: boolean;
  symbol: symbol;
  bigint: bigint;
  function: Function;
  object: object;
  array: unknown[];
}

/**
 * União das chaves de `TypeMap`, representando todas as categorias de tipo
 * reconhecidas.
 */
export type TypeOf = keyof TypeMap;

/**
 * Recupera o tipo correspondente a uma chave de `TypeMap`.
 *
 * @template T - Chave(s) de `TypeMap`.
 *
 * @example
 *  let value: Type<'string' | 'number'>; // string | number
 */
export type Type<T extends TypeOf> = TypeMap[T];

/**
 * Retorna a categoria de tipo de um valor, tratando `null` e `Array`.
 *
 * @param value - `unknown` - Valor a ser inspecionado.
 * @return `TypeOf` - A categoria de tipo identificada.
 *
 * @example
 *  typeOf(null);     // 'null'
 *  typeOf([]);       // 'array'
 *  typeOf(() => {}); // 'function'
 *  typeOf({});       // 'object'
 *  typeOf('a');      // 'string'
 */
export function typeOf(value: unknown): TypeOf {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

/**
 * Verifica se o valor pertence a pelo menos um dos tipos especificados.
 *
 * @remarks
 *  Retorna `false` se nenhum tipo for informado (`value is never`);
 *
 * @typeguard `value is Type<T>`
 * @template T - Categorias de tipo a verificar, estendendo `TypeOf`.
 * @param value - `unknown` - Valor a ser testado.
 * @param ...types - `T[]` - Lista de categorias de tipo aceitas.
 * @return `value is Type<T>` - `true` se o tipo do valor estiver entre os especificados.
 *
 * @example
 *  if (isTypeOf(value, 'string', 'number')) {
 *    // value é string | number
 *  }
 */
export function isTypeOf<T extends TypeOf>(
  value: unknown,
  ...types: T[]
): value is Type<T> {
  if (types.length === 0) return false;
  return types.includes(typeOf(value) as T);
}

/**
 * Verifica se o valor não pertence a nenhum dos tipos especificados.
 *
 * @remarks
 *  - Sempre retorna `true` se nenhum tipo for informado (`value is U`).
 *  - Remove apenas os tipos fornecidos do tipo original.
 *
 * @typeguard `value is Exclude<U, Type<T>>`
 * @template U - Tipo original do valor (inferido automaticamente).
 * @template T - Categorias de tipo a excluir, estendendo `TypeOf`.
 * @param value - `U` - Valor a ser testado.
 * @param ...types - `T[]` - Categorias de tipo que devem ser excluídas do tipo.
 * @return `value is Exclude<U, Type<T>>` - `true` se o tipo não estiver entre os informados.
 *
 * @example
 *  let value: string | number = 'abc';
 *  if (isNotTypeOf(value, 'string')) {
 *    // value agora é number
 *  }
 */
export function isNotTypeOf<U, T extends TypeOf>(
  value: U,
  ...types: T[]
): value is Exclude<U, Type<T>> {
  return !isTypeOf(value, ...types);
}

// undefined ===================================================================

/**
 * Verifica se o valor é estritamente `undefined`.
 *
 * @typeguard `value is undefined`
 * @param value - `unknown` - Valor a ser testado.
 * @return `value is undefined` - `true` se for `undefined`.
 *
 * @example
 *  if (isUndefined(value)) {
 *    // value é undefined
 *  }
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

/**
 * Verifica se o valor não é `undefined`, removendo-o do tipo original.
 *
 * @typeguard `value is Exclude<T, undefined>`
 * @template T - Tipo original do valor.
 * @param value - `T` - Valor a ser testado.
 * @return `value is Exclude<T, undefined>` - `true` se não for `undefined`.
 *
 * @example
 *  let value: string | undefined = 'abc';
 *  if (isNotUndefined(value)) {
 *    // value é string
 *  }
 */
export function isNotUndefined<T>(value: T): value is Exclude<T, undefined> {
  return !isUndefined(value);
}

/**
 * Verifica se todos os elementos do array são `undefined`.
 *
 * @typeguard `value is undefined[]`
 * @param value - `unknown[]` - Array a ser verificado.
 * @return `value is undefined[]` - `true` se todos os elementos forem `undefined`.
 *
 * @example
 *  if (isUndefinedList(array)) {
 *    // array é undefined[]
 *  }
 */
export function isUndefinedList(value: unknown[]): value is undefined[] {
  return value.every(v => isUndefined(v));
}

// null ========================================================================

/**
 * Verifica se o valor é estritamente `null`.
 *
 * @typeguard `value is null`
 * @param value - `unknown` - Valor a ser testado.
 * @return `value is null` - `true` se for `null`.
 *
 * @example
 *  if (isNull(value)) {
 *    // value é null
 *  }
 */
export function isNull(value: unknown): value is null {
  return value === null;
}

/**
 * Verifica se o valor não é `null`, removendo-o do tipo original.
 *
 * @typeguard `value is Exclude<T, null>`
 * @template T - Tipo original do valor.
 * @param value - `T` - Valor a ser testado.
 * @return `value is Exclude<T, null>` - `true` se não for `null`.
 *
 * @example
 *  let value: string | null = 'abc';
 *  if (isNotNull(value)) {
 *    // value é string
 *  }
 */
export function isNotNull<T>(value: T): value is Exclude<T, null> {
  return !isNull(value);
}

/**
 * Verifica se todos os elementos do array são `null`.
 *
 * @typeguard `value is null[]`
 * @param value - `unknown[]` - Array a ser verificado.
 * @return `value is null[]` - `true` se todos os elementos forem `null`.
 *
 * @example
 *  if (isNullList(array)) {
 *    // array é null[]
 *  }
 */
export function isNullList(value: unknown[]): value is null[] {
  return value.every(v => isNull(v));
}

// nullable ====================================================================

/**
 * Verifica se o valor é `undefined` ou `null`.
 *
 * @typeguard `value is undefined | null`
 * @param value - `unknown` - Valor a ser testado.
 * @return `value is undefined | null` - `true` se for anulável.
 *
 * @example
 *  if (isNullable(value)) {
 *    // value é undefined ou null
 *  }
 */
export function isNullable(value: unknown): value is undefined | null {
  return value === undefined || value === null;
}

/**
 * Verifica se o valor não é `undefined` nem `null`, removendo-os do tipo.
 *
 * @typeguard `value is Exclude<T, undefined | null>`
 * @template T - Tipo original do valor.
 * @param value - `T` - Valor a ser testado.
 * @return `value is Exclude<T, undefined | null>` - `true` se não for anulável.
 *
 * @example
 *  let value: string | null | undefined = 'abc';
 *  if (isNotNullable(value)) {
 *    // value é string
 *  }
 */
export function isNotNullable<T>(
  value: T,
): value is Exclude<T, undefined | null> {
  return !isNullable(value);
}

/**
 * Verifica se todos os elementos do array são `undefined` ou `null`.
 *
 * @typeguard `value is (undefined | null)[]`
 * @param value - `unknown[]` - Array a ser verificado.
 * @return `value is (undefined | null)[]` - `true` se todos os elementos forem anuláveis.
 *
 * @example
 *  if (isNullableList(array)) {
 *    // array é (undefined | null)[]
 *  }
 */
export function isNullableList(
  value: unknown[],
): value is (undefined | null)[] {
  return value.every(v => isNullable(v));
}

// string ======================================================================

/**
 * Verifica se o valor é uma `string`.
 *
 * @typeguard `value is string`
 * @param value - `unknown` - Valor a ser testado.
 * @return `value is string` - `true` se for `string`.
 *
 * @example
 *  if (isString(value)) {
 *    // value é string
 *  }
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Verifica se o valor não é uma `string`, removendo-a do tipo original.
 *
 * @typeguard `value is Exclude<T, string>`
 * @template T - Tipo original do valor.
 * @param value - `T` - Valor a ser testado.
 * @return `value is Exclude<T, string>` - `true` se não for `string`.
 *
 * @example
 *  let value: string | number = 'abc';
 *  if (isNotString(value)) {
 *    // value é number
 *  }
 */
export function isNotString<T>(value: T): value is Exclude<T, string> {
  return !isString(value);
}

/**
 * Verifica se todos os elementos do array são `string`.
 *
 * @typeguard `value is string[]`
 * @param value - `unknown[]` - Array a ser verificado.
 * @return `value is string[]` - `true` se todos os elementos forem `string`.
 *
 * @example
 *  if (isStringList(array)) {
 *    // array é string[]
 *  }
 */
export function isStringList(value: unknown[]): value is string[] {
  return value.every(v => isString(v));
}

// number ======================================================================

/**
 * Verifica se o valor é um `number`.
 *
 * @typeguard `value is number`
 * @param value - `unknown` - Valor a ser testado.
 * @return `value is number` - `true` se for `number`.
 *
 * @example
 *  if (isNumber(value)) {
 *    // value é number
 *  }
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

/**
 * Verifica se o valor não é um `number`, removendo-o do tipo original.
 *
 * @typeguard `value is Exclude<T, number>`
 * @template T - Tipo original do valor.
 * @param value - `T` - Valor a ser testado.
 * @return `value is Exclude<T, number>` - `true` se não for `number`.
 *
 * @example
 *  let value: number | string = 1;
 *  if (isNotNumber(value)) {
 *    // value é string
 *  }
 */
export function isNotNumber<T>(value: T): value is Exclude<T, number> {
  return !isNumber(value);
}

/**
 * Verifica se todos os elementos do array são `number`.
 *
 * @typeguard `value is number[]`
 * @param value - `unknown[]` - Array a ser verificado.
 * @return `value is number[]` - `true` se todos os elementos forem `number`.
 *
 * @example
 *  if (isNumberList(array)) {
 *    // array é number[]
 *  }
 */
export function isNumberList(value: unknown[]): value is number[] {
  return value.every(v => isNumber(v));
}

// boolean =====================================================================

/**
 * Verifica se o valor é um `boolean`.
 *
 * @typeguard `value is boolean`
 * @param value - `unknown` - Valor a ser testado.
 * @return `value is boolean` - `true` se for `boolean`.
 *
 * @example
 *  if (isBoolean(value)) {
 *    // value é boolean
 *  }
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Verifica se o valor não é um `boolean`, removendo-o do tipo original.
 *
 * @typeguard `value is Exclude<T, boolean>`
 * @template T - Tipo original do valor.
 * @param value - `T` - Valor a ser testado.
 * @return `value is Exclude<T, boolean>` - `true` se não for `boolean`.
 *
 * @example
 *  let value: boolean | string = true;
 *  if (isNotBoolean(value)) {
 *    // value é string
 *  }
 */
export function isNotBoolean<T>(value: T): value is Exclude<T, boolean> {
  return !isBoolean(value);
}

/**
 * Verifica se todos os elementos do array são `boolean`.
 *
 * @typeguard `value is boolean[]`
 * @param value - `unknown[]` - Array a ser verificado.
 * @return `value is boolean[]` - `true` se todos os elementos forem `boolean`.
 *
 * @example
 *  if (isBooleanList(array)) {
 *    // array é boolean[]
 *  }
 */
export function isBooleanList(value: unknown[]): value is boolean[] {
  return value.every(v => isBoolean(v));
}

// symbol ======================================================================

/**
 * Verifica se o valor é um `symbol`.
 *
 * @typeguard `value is symbol`
 * @param value - `unknown` - Valor a ser testado.
 * @return `value is symbol` - `true` se for `symbol`.
 *
 * @example
 *  if (isSymbol(value)) {
 *    // value é symbol
 *  }
 */
export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol';
}

/**
 * Verifica se o valor não é um `symbol`, removendo-o do tipo original.
 *
 * @typeguard `value is Exclude<T, symbol>`
 * @template T - Tipo original do valor.
 * @param value - `T` - Valor a ser testado.
 * @return `value is Exclude<T, symbol>` - `true` se não for `symbol`.
 *
 * @example
 *  let value: symbol | string = Symbol();
 *  if (isNotSymbol(value)) {
 *    // value é string
 *  }
 */
export function isNotSymbol<T>(value: T): value is Exclude<T, symbol> {
  return !isSymbol(value);
}

/**
 * Verifica se todos os elementos do array são `symbol`.
 *
 * @typeguard `value is symbol[]`
 * @param value - `unknown[]` - Array a ser verificado.
 * @return `value is symbol[]` - `true` se todos os elementos forem `symbol`.
 *
 * @example
 *  if (isSymbolList(array)) {
 *    // array é symbol[]
 *  }
 */
export function isSymbolList(value: unknown[]): value is symbol[] {
  return value.every(v => isSymbol(v));
}

// bigint ======================================================================

/**
 * Verifica se o valor é um `bigint`.
 *
 * @typeguard `value is bigint`
 * @param value - `unknown` - Valor a ser testado.
 * @return `value is bigint` - `true` se for `bigint`.
 *
 * @example
 *  if (isBigInt(value)) {
 *    // value é bigint
 *  }
 */
export function isBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint';
}

/**
 * Verifica se o valor não é um `bigint`, removendo-o do tipo original.
 *
 * @typeguard `value is Exclude<T, bigint>`
 * @template T - Tipo original do valor.
 * @param value - `T` - Valor a ser testado.
 * @return `value is Exclude<T, bigint>` - `true` se não for `bigint`.
 *
 * @example
 *  let value: bigint | string = BigInt(1);
 *  if (isNotBigInt(value)) {
 *    // value é string
 *  }
 */
export function isNotBigInt<T>(value: T): value is Exclude<T, bigint> {
  return !isBigInt(value);
}

/**
 * Verifica se todos os elementos do array são `bigint`.
 *
 * @typeguard `value is bigint[]`
 * @param value - `unknown[]` - Array a ser verificado.
 * @return `value is bigint[]` - `true` se todos os elementos forem `bigint`.
 *
 * @example
 *  if (isBigIntList(array)) {
 *    // array é bigint[]
 *  }
 */
export function isBigIntList(value: unknown[]): value is bigint[] {
  return value.every(v => isBigInt(v));
}

// function ====================================================================

/**
 * Verifica se o valor é uma função (inclui classes e callables).
 *
 * @typeguard `value is Function`
 * @param value - `unknown` - Valor a ser testado.
 * @return `value is Function` - `true` se for função.
 *
 * @example
 *  if (isFunction(value)) {
 *    // value é Function
 *  }
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

/**
 * Verifica se o valor não é uma função, removendo-a do tipo original.
 *
 * @typeguard `value is Exclude<T, Function>`
 * @template T - Tipo original do valor.
 * @param value - `T` - Valor a ser testado.
 * @return `value is Exclude<T, Function>` - `true` se não for função.
 *
 * @example
 *  let value: Function | string = () => {};
 *  if (isNotFunction(value)) {
 *    // value é string
 *  }
 */
export function isNotFunction<T>(value: T): value is Exclude<T, Function> {
  return !isFunction(value);
}

/**
 * Verifica se todos os elementos do array são funções.
 *
 * @typeguard `value is Function[]`
 * @param value - `unknown[]` - Array a ser verificado.
 * @return `value is Function[]` - `true` se todos os elementos forem funções.
 *
 * @example
 *  if (isFunctionList(array)) {
 *    // array é Function[]
 *  }
 */
export function isFunctionList(value: unknown[]): value is Function[] {
  return value.every(v => isFunction(v));
}

// object ======================================================================

/**
 * Verifica se o valor é um objeto não nulo, não função e não array.
 *
 * @remarks
 *  O Type Guard refina para o tipo TypeScript `object`, que ainda inclui
 *  `null`, `Array` e `Function`, mas garante que o valor não seja nenhum deste
 *  no momento da validação.
 *
 * @typeguard `value is object`
 * @param value - `unknown` - Valor a ser testado.
 * @return `value is object` - `true` se for objeto (não null, array ou função).
 *
 * @example
 *  if (isObject(value)) {
 *    // value é object (segundo a verificação restrita)
 *  }
 */
export function isObject(value: unknown): value is object {
  return isTypeOf(value, 'object');
}

/**
 * Verifica se o valor não é um objeto.
 *
 * @remarks
 *  A validação retorna `false` para qualquer `null`, `Function` ou `Array`.
 *
 * @typeguard `value is Exclude<T, object>`
 * @template T - Tipo original do valor.
 * @param value - `T` - Valor a ser testado.
 * @return `value is Exclude<T, object>` - `true` se não for objeto.
 *
 * @example
 *  let value: object | string = {};
 *  if (isNotObject(value)) {
 *    // value é string
 *  }
 */
export function isNotObject<T>(value: T): value is Exclude<T, object> {
  return !isObject(value);
}

/**
 * Verifica se todos os elementos do array são objetos não nulos, não funções e
 * não arrays.
 *
 * @remarks
 *  Utiliza `ìsObject` para validar cada item do array, utilizando os mesmos
 *  princípios.
 *
 * @typeguard `value is object[]`
 * @param value - `unknown[]` - Array a ser verificado.
 * @return `value is object[]` - `true` se todos os elementos forem objetos.
 *
 * @example
 *  if (isObjectList(array)) {
 *    // array é object[]
 *  }
 */
export function isObjectList(value: unknown[]): value is object[] {
  return value.every(v => isObject(v));
}

// array =======================================================================

/**
 * Verifica se o valor é um array.
 *
 * @typeguard `value is unknown[]`
 * @param value - `unknown` - Valor a ser testado.
 * @return `value is unknown[]` - `true` se for array.
 *
 * @example
 *  if (isArray(value)) {
 *    // value é unknown[]
 *  }
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Verifica se o valor não é um array, removendo-o do tipo original.
 *
 * @remarks
 *  Para `T = object`, o Type Guard mantém o tipo original, que ainda inclui
 *  `Array`, mas garante que o valor não o seja no momento da validação.
 *
 * @typeguard `value is Exclude<T, unknown[]>`
 * @template T - Tipo original do valor.
 * @param value - `T` - Valor a ser testado.
 * @return `value is Exclude<T, unknown[]>` - `true` se não for array.
 *
 * @example
 *  let value: unknown[] | string = [];
 *  if (isNotArray(value)) {
 *    // value é string
 *  }
 */
export function isNotArray<T>(value: T): value is Exclude<T, unknown[]> {
  return !isArray(value);
}

/**
 * Verifica se todos os elementos do array pertencem a pelo menos um dos tipos.
 *
 * @remarks
 *  - Sempre retorna `true` se o array estiver vazio, senão;
 *  - Retorna `false` se nenhum tipo for informado;
 *
 * @typeguard `value is Type<T>[]`
 * @template T - Categorias de tipo aceitas, estendendo `TypeOf`.
 * @param value - `unknown[]` - Array a ser verificado.
 * @param ...types - `T[]` - Categorias permitidas para os elementos.
 * @return `value is Type<T>[]` - `true` se todos os elementos forem de algum dos tipos.
 *
 * @example
 *  if (isArrayOf(array, 'string', 'number')) {
 *    // array é (string | number)[]
 *  }
 *
 *  console.log(isArrayOf([])); // true
 *  console.log(isArrayOf([1, 2, 3])); // false
 */
export function isArrayOf<T extends TypeOf>(
  value: unknown[],
  ...types: T[]
): value is Type<T>[] {
  return value.every(v => isTypeOf(v, ...types));
}
