# TS Guard Utils

[![NPM Version](https://img.shields.io/npm/v/ts-guard-utils?style=for-the-badge&color=0098ff&labelColor=0098ff&label=ts-guard-utils)](https://npmjs.com/package/ts-guard-utils)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

O `typeof` é um **Type Guard** nativo do _TypeScript_ herdado do _JavaScript_. Por ser uma herança, ele carrega a inconsistência do JS ao tratar `null` como `'object'`, o que em TypeScript se agrava porque `null` é inferível como um tipo distinto.

Além disso, o TypeScript dá tratamento especial a `Array`, com inferência específica e sintaxe própria para tuplas — algo que sequer existe em JavaScript.

```ts
// inferência específica para objetos Array
const array: number[] = [1, 2, 3, 4, 5];

// reconhecimento de tuplas
const tuple: [number, number] = [1, 2];
```

A **ts-guard-utils** trata `null` e `Array` como categorias próprias, introduzindo a função `typeOf` que retorna `'null'` para `null` e `'array'` para arrays, mantendo as demais verificações idênticas ao `typeof` original.

```ts
console.log(typeOf(null)); // 'null'
console.log(typeOf([1, 2, 3])); // 'array'
```

A partir dessa filosofia, a biblioteca oferece **dezenas de Type Guards e utilitários de tipagem forte**, cobrindo:

- Checagem de tipos (ex.: `isUndefined`, `isStringList`, `isNotNullable`, `isArrayOf`);
- Manipulação segura de objetos planos (`isPlainObject`, `pick`, `omit`);
- Operações com arrays (limpeza de duplicatas e anuláveis, `chunk`);
- Utilitários para strings (`toCamelCase`, `toSnakeCase`, `normalize`, `isLiteral`);
- Suporte a geradores de números aleatórios customizáveis (veja também a biblioteca [Drawlots](https://npmjs.com/package/drawlots)).

## Sumário

- [Motivação](#ts-guard-utils)
- [Instalação](#instalação)
- [Uso rápido](#uso-rápido)
- [Módulos](#módulos)
  - [`types.utils`](#typesutils)
  - [`empty.utils`](#emptyutils)
  - [`array.utils`](#arrayutils)
  - [`object.utils`](#objectutils)
  - [`string.utils`](#stringutils)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Documentação interna](#documentação-interna)
- [Licença](#licença)
- [Links](#links)

## Instalação

```bash
npm install ts-guard-utils
# ou
yarn add ts-guard-utils
# ou
pnpm add ts-guard-utils
```

> A biblioteca é escrita inteiramente em TypeScript e não possui dependências externas.

## Uso rápido

```ts
import {
  typeOf,
  isTypeOf,
  isStringList,
  toCamelCase,
  shuffle,
} from 'ts-guard-utils';

console.log(typeOf(null)); // 'null'
console.log(typeOf([])); // 'array'
console.log(typeOf(() => {})); // 'function'

const value: unknown = 'hello';
if (isTypeOf(value, 'string', 'number')) {
  // value é refinado para `string | number`
  console.log(value.toUpperCase());
}

const array = ['a', 'b', 'c'];
if (isStringList(array)) {
  // array é refinado para `string[]`
}

console.log(toCamelCase('hello_world')); // 'helloWorld'
console.log(shuffle([1, 2, 3])); // array embaralhado
```

## Módulos

### `types.utils`

Funções de inspeção de tipo baseadas no novo `typeOf`.

| Função                         | Descrição                                                                    |
| ------------------------------ | ---------------------------------------------------------------------------- |
| `typeOf(value)`                | Retorna o tipo como string (`'null'`, `'array'`, etc.)                       |
| `isTypeOf(value, ...types)`    | Type guard: verifica se o valor **PERTENCE** a um dos tipos                  |
| `isNotTypeOf(value, ...types)` | Type guard: verifica se o valor **NÃO PERTENCE** a um dos tipos              |
| `isUndefined(value)`           | Type guard: verifica se o valor **É** `undefined`                            |
| `isUndefinedList(array)`       | Type guard: verifica se um array **CONTÉM APENAS** `undefined`               |
| `isNotUndefined(value)`        | Type guard: verifica se o valor **NÃO É** `undefined`                        |
| `isNull(value)`                | Type guard: verifica se o valor **É** `null`                                 |
| `isNullList(array)`            | Type guard: verifica se um array **CONTÉM APENAS** `null`                    |
| `isNotNull(value)`             | Type guard: verifica se o valor **NÃO É** `null`                             |
| `isNullable(value)`            | Type guard: verifica se o valor **É** `undefined \| null`                    |
| `isNullableList(array)`        | Type guard: verifica se um array **CONTÉM APENAS** `undefined \| null`       |
| `isNotNullable(value)`         | Type guard: verifica se o valor **NÃO É** `undefined \| null`                |
| `isString(value)`              | Type guard: verifica se o valor **É** `string`                               |
| `isStringList(array)`          | Type guard: verifica se um array **CONTÉM APENAS** `string`                  |
| `isNotString(value)`           | Type guard: verifica se o valor **NÃO É** `string`                           |
| `isNumber(value)`              | Type guard: verifica se o valor **É** `number`                               |
| `isNumberList(array)`          | Type guard: verifica se um array **CONTÉM APENAS** `number`                  |
| `isNotNumber(value)`           | Type guard: verifica se o valor **NÃO É** `number`                           |
| `isBoolean(value)`             | Type guard: verifica se o valor **É** `boolean`                              |
| `isBooleanList(array)`         | Type guard: verifica se um array **CONTÉM APENAS** `boolean`                 |
| `isNotBoolean(value)`          | Type guard: verifica se o valor **NÃO É** `boolean`                          |
| `isSymbol(value)`              | Type guard: verifica se o valor **É** `symbol`                               |
| `isSymbolList(array)`          | Type guard: verifica se um array **CONTÉM APENAS** `symbol`                  |
| `isNotSymbol(value)`           | Type guard: verifica se o valor **NÃO É** `symbol`                           |
| `isBigInt(value)`              | Type guard: verifica se o valor **É** `bigint`                               |
| `isBigIntList(array)`          | Type guard: verifica se um array **CONTÉM APENAS** `bigint`                  |
| `isNotBigInt(value)`           | Type guard: verifica se o valor **NÃO É** `bigint`                           |
| `isFunction(value)`            | Type guard: verifica se o valor **É** `function`                             |
| `isFunctionList(array)`        | Type guard: verifica se um array **CONTÉM APENAS** `function`                |
| `isNotFunction(value)`         | Type guard: verifica se o valor **NÃO É** `function`                         |
| `isObject(value)`              | Type guard: verifica se o valor **É** `object`                               |
| `isObjectList(array)`          | Type guard: verifica se um array **CONTÉM APENAS** `object`                  |
| `isArray(value)`               | Type guard: verifica se o valor **É** `unknown[]`                            |
| `isArrayOf(array, ...types)`   | Type guard: verifica se todos os elementos do array pertencem a um dos tipos |

> Os Type Guards `isObject` e `isObjectList` verificam se o valor é um objeto ou array de objetos **NÃO NULOS** e **NÃO ARRAYS**. Diferentemente dos outros tipos, não existe um negativo `isNotObject` para `object`, pois não há como excluir `object` do tipo sem remover também `Array` e `null`.

#### Exemplos

```ts
const value: unknown = 'example';
if (isTypeOf(value, 'array', 'string')) {
  // value é refinado para `unknown[] | string`
  console.log(value.length); // chamada segura dentro do bloco
}
```

```ts
const array: unknown[] = [1, 2, 3, 'd', 5];
if (isArrayOf(array, 'number', 'string')) {
  // array é refinado para `(number | string)[]`
}
```

```ts
const value: number | string | undefined = 0;
if (isNotUndefined(value)) {
  // value é refinado para `number | string`
}
```

```ts
const ex_null: unknown = null;
const ex_undef: unknown = undefined;
if (isNullableList([ex_null, ex_undef])) {
  // ex_null e ex_undef são refinadas para `null | undefined`
}
```

### `empty.utils`

Utilitários para objetos planos e valores vazios.

| Função                 | Descrição                                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `isPlainObject(value)` | Verifica se é um objeto plano (`Object.getPrototypeOf(value)` precisa ser igual à `Object.prototype`) |
| `isEmpty(value)`       | Verifica se string, array ou objeto plano está vazio                                                  |
| `isNotEmpty(value)`    | Inverso de `isEmpty`                                                                                  |

#### Exemplos

```ts
const object: { prop?: number } = { prop: 1 };
if (isPlainObject(object)) {
  // object é refinado para `Record<string, unknown>`
  console.log(isEmpty(object)); // false
  console.log(isEmpty('')); // true
  console.log(isEmpty([undefined])); // true
}
```

> Um objeto `{}` está vazio pois não possui propriedades próprias enumeráveis. No entanto, `{ prop: undefined }` **NÃO É** considerado vazio, porque a propriedade foi explicitamente definida — mesmo que seu valor seja `undefined`.

### `array.utils`

Operações comuns e aleatoriedade.

| Função                               | Descrição                                     |
| ------------------------------------ | --------------------------------------------- |
| `clearDuplicates(array)`             | Remove duplicados                             |
| `clearUndefineds(array)`             | Remove `undefined`                            |
| `clearNulls(array)`                  | Remove `null`                                 |
| `clearNullables(array)`              | Remove `undefined \| null`                    |
| `chunk(value, size)`                 | Divide array/string em pedaços                |
| `shuffle(value, random?)`            | Embaralha array ou string (Fisher‑Yates)      |
| `randomIndex(value, random?)`        | Índice aleatório                              |
| `randomItem(value, random?)`         | Elemento/caractere aleatório                  |
| `randomItems(value, n, random?)`     | `n` elementos/caracteres distintos aleatórios |
| `takeRandomItem(array, random?)`     | Remove e retorna um item aleatório            |
| `takeRandomItems(array, n, random?)` | Remove e retorna `n` itens aleatórios         |

> **ALEATORIEDADE**: Todas as funções aceitam uma função `random` opcional que deve retornar um número no intervalo `[0,1)`. Isso permite usar geradores determinísticos para testes ou reprodutibilidade. Por padrão, é usado `Math.random`. **IMPORTANTE**: as funções confiam que o resultado de `random` esteja dentro de `[0,1)`. Utilize esse recurso com responsabilidade.

#### Exemplos

```ts
const array = [1, 1, 2, 3, 3, 4, 5, 6, 7, 7];
console.log(clearDuplicates(array)); // [1, 2, 3, 4, 5, 6, 7]
```

```ts
const array = [1, 2, 3, undefined, 5, 6, 7];
console.log(clearUndefineds(array)); // [1, 2, 3, 5, 6, 7]
```

```ts
const array = [1, 2, 3, 4, 5];
console.log(chunk(array, 2)); // [[1, 2], [3, 4], [5]]

const str = 'café sem açúcar';
console.log(chunk(str, 3)); // ['caf', 'é s', 'em ', 'açú', 'car']
```

```ts
import { Drawlots } from 'drawlots';

const draw = new Drawlots({ seed: 1234 });

shuffle([1, 2, 3], draw.random); // embaralha deterministicamente
```

> A biblioteca [Drawlots](https://npmjs.com/package/drawlots) oferece um gerador determinístico de números aleatórios no intervalo `[0,1)`. Fornece uma classe `Drawlots` configurável com _semente (`seed`)_ e _probabilidade (`prob`)_ para testes e reprodutibilidade, além de controle de estado completo.

### `object.utils`

Manipulação segura de objetos planos.

| Função                  | Descrição                                               |
| ----------------------- | ------------------------------------------------------- |
| `pick(obj, ...keys)`    | Cria objeto apenas com as chaves escolhidas             |
| `omit(obj, ...keys)`    | Cria objeto sem as chaves escolhidas                    |
| `isKeyOf(obj, key)`     | Type guard: `key is keyof T`                            |
| `isValueOf(obj, val)`   | Type guard: `val is T[keyof T]`                         |
| `isEntryOf(obj, entry)` | Verifica se a tupla `[chave, valor]` pertence ao objeto |

#### Exemplos

```ts
const user = { id: 1, name: 'John Doe', age: 21, password: '123456' };

const public_user = omit(user, 'password');
// { id: 1, name: 'John Doe', age: 21 }

const credentials = pick(user, 'id', 'password');
// { id: 1, password: '123456' }
```

```ts
const key = 'prop';
const obj = { prop: 1 }; // O TS infere `{ prop: number }`
if (isKeyOf(obj, key)) {
  // `key` é refinado para `keyof { prop: number }`
  console.log(obj[key]); // chamada segura
}
```

### `string.utils`

Conversão de cases, normalização e geração de strings aleatórias.

#### Validação de literais

| Função                            | Descrição                  |
| --------------------------------- | -------------------------- |
| `isLiteral(str, ...literals)`     | `str is L`                 |
| `literalIsIn(literal, ...set)`    | Refina para um subconjunto |
| `literalIsNotIn(literal, ...set)` | Exclui um subconjunto      |

#### Conversão de case

| Função                       | Entrada                                         | Exemplo                                                                |
| ---------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------- |
| `toCapitalizedCase(str)`     | `'café quentinho'`                              | `'Café Quentinho'`                                                     |
| `normalize(str)`             | `'ㅤㅤCaféㅤㅤquentinhoㅤㅤ'`                   | `'Cafe quentinho'` (remove acentos, espaços duplos e aplica `.trim()`) |
| `toCamelCase(str)`           | `'helo_world'`, `'hello-world'`, `'HelloWorld'` | `'helloWorld'`                                                         |
| `toSnakeCase(str, toConst?)` | `'heloWorld'`, `'hello-world'`, `'HelloWorld'`  | `'hello_world'` / `'HELLO_WORLD'`                                      |
| `toKebabCase(str, toConst?)` | `'heloWorld'`, `'hello_world'`, `'HelloWorld'`  | `'hello-world'` / `'HELLO-WORLD'`                                      |
| `toPascalCase(str)`          | `'heloWorld'`, `'hello_world'`, `'hello-world'` | `'HelloWorld'`                                                         |

> Todas as conversões (exceto `toCapitalizedCase`) normalizam a string automaticamente.

#### Geração de strings aleatórias

```ts
import { randomString, CHARS_MAP } from 'ts-guard-utils';

// Comprimento fixo (padrão 9)
randomString(); // ex: 'aB3xY7zW1'
randomString({ length: 5 }); // ex: 'cD4eF'

// Quantidades por conjunto
randomString({ LOWER_ALPHABET: 3, DIGITS: 2 }); // ex: 'ab12c'

// Mapa personalizado
randomString({
  chars_map: { hex: '0123456789ABCDEF' },
  length: 6,
}); // ex: 'A03F2B'
```

> Consulte `RandomStringOptions` para todas as possibilidades.

## Estrutura do projeto

```
src/
├── utils/
│   ├── types.utils.ts      ← typeOf e type guards
│   ├── empty.utils.ts      ← PlainObject, isEmpty
│   ├── array.utils.ts      ← arrays e aleatoriedade
│   ├── object.utils.ts     ← pick, omit, isKeyOf...
│   └── string.utils.ts     ← cases e random strings
└── index.ts                ← barrel export
```

Todas as funções públicas estão disponíveis a partir de `'ts-guard-utils'`.

## Documentação interna

Os comentários no código fonte estão em **português (Brasil)** e contêm explicações detalhadas, exemplos e notas sobre comportamento.

## Licença

MIT © [Bianca Maxine](https://github.com/biamaxine)

## Links

- **GitHub**: [https://github.com/biamaxine/ts-guard-utils](https://github.com/biamaxine/ts-guard-utils)
- **npm**: [https://www.npmjs.com/package/ts-guard-utils](https://www.npmjs.com/package/ts-guard-utils)
- **Autora**: [Bianca Maxine](https://github.com/biamaxine) – [LinkedIn](https://linkedin.com/in/biamaxine)
