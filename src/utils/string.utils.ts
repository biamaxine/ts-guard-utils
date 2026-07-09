import { randomItem, shuffle } from './array.utils';
import { isEmpty } from './empty.utils';

const REGEX_MAP = {
  F_WORD: /\b\p{L}+/gu,
  F_DIACRITC: /\p{Diacritic}/gu,
  F_SPACE_PLUS: /\s+/g,
  H_LOWER: /\p{Ll}/u,
  F_DASHE: /[-_]/g,
  F_DASHE_UPPER: /(\p{Lu})|[-_]/gu,
  F_SPACE_FOLLOW_LETTER: /\s(\b\p{L})/gu,
} as const;

/**
 * Verifica se uma string está entre os literais fornecidos.
 *
 * @typeguard `str is L`
 * @template L - Tipo dos literais, estende `string`.
 * @param str - `string` - String a ser verificada.
 * @param literals - `L[]` - Lista de literais válidos.
 * @return `str is L` - `true` se a string pertencer à lista.
 *
 * @example
 *  if (isLiteral(val, 'a', 'b')) {
 *    // val é 'a' | 'b'
 *  }
 */
export function isLiteral<L extends string>(
  str: string,
  ...literals: L[]
): str is L {
  return literals.includes(str as L);
}

/**
 * Verifica se um literal está contido em um conjunto de valores.
 *
 * @typeguard `literal is In`
 * @template L - Tipo do literal, estende `string`.
 * @template In - Tipo do subconjunto, estende `L`.
 * @param literal - `L` - Literal a ser testado.
 * @param isIn - `In[]` - Conjunto de literais aceitos.
 * @return `literal is In` - `true` se o literal pertencer ao conjunto.
 *
 * @example
 *  const myLiteral: 'x' | 'y' | 'z' = 'x';
 *  if (literalIsIn(myLiteral, 'x', 'y')) {
 *    // myLiteral é 'x' | 'y'
 *  }
 */
export function literalIsIn<L extends string, In extends L>(
  literal: L,
  ...isIn: In[]
): literal is In {
  return isIn.includes(literal as In);
}

/**
 * Verifica se um literal não está contido em um conjunto de valores.
 *
 * @typeguard `literal is Exclude<L, In>`
 * @template L - Tipo do literal, estende `string`.
 * @template In - Tipo do subconjunto a excluir, estende `L`.
 * @param literal - `L` - Literal a ser testado.
 * @param isNotIn - `In[]` - Conjunto de literais a serem excluídos.
 * @return `literal is Exclude<L, In>` - `true` se o literal não pertencer.
 *
 * @example
 *  const myLiteral: 'x' | 'y' | 'z' = 'z'
 *  if (literalIsNotIn(myLiteral, 'x')) {
 *    // myLiteral é Exclude<L, 'x'> que se traduz em 'y' | 'z'
 *  }
 */
export function literalIsNotIn<L extends string, In extends L>(
  literal: L,
  ...isNotIn: In[]
): literal is Exclude<L, In> {
  return !literalIsIn(literal, ...isNotIn);
}

/** @internal Capitaliza a primeira letra de uma palavra. */
function capitalizeWord(word: string): string {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.substring(1);
}

/**
 * Converte uma string para Capitalized Case (primeira letra maiúscula de cada
 * palavra).
 *
 * @remarks
 *  - A função apenas ajusta a capitalização, sem remover acentos ou normalizar
 *  espaços.
 *  - Para uma limpeza completa, combine com {@link normalize}.
 *
 * @param str - `string` - String a ser convertida.
 * @return `string` - A string convertida para Capitalized Case.
 *
 * @example
 *  toCapitalizedCase('café fresquinho'); // 'Café Fresquinho'
 */
export function toCapitalizedCase(str: string): string {
  if (!str) return '';
  return str.toLowerCase().replace(REGEX_MAP.F_WORD, capitalizeWord);
}

/**
 * Remove acentos e normaliza espaços em uma string.
 *
 * @remarks
 *  Utiliza decomposição Unicode (NFD) para remover diacríticos e compacta
 *  múltiplos espaços em um único.
 *
 * @param str - `string` - String a ser limpa.
 * @return `string` - String normalizada sem acentos e espaços extras.
 *
 * @example
 *  normalize('  café   fresquinho '); // 'cafe fresquinho'
 */
export function normalize(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(REGEX_MAP.F_DIACRITC, '')
    .normalize('NFC')
    .replace(REGEX_MAP.F_SPACE_PLUS, ' ')
    .trim();
}

/**
 * =============================================================================
 * As funções de conversão de case abaixo, assumem que o valor recebido existe
 * em um contexto de desenvolvimento (e.g. variáveis, propriedades, argumentos,
 * etc.). Nesse sentido, todas, com exceção de `toCapitalizedCase`, normalizam a
 * string de entrada, removendo acentos e espaçamentos.
 * =============================================================================
 */

/**
 * @internal Função interna de formatação usada pelas conversões de case.
 *
 * @param str - String de entrada.
 * @param replacer - Função que transforma a primeira letra de cada palavra.
 * @returns String formatada (minúscula, com replacer aplicado às primeiras letras).
 */
function format(str: string, replacer: (s: string) => string): string {
  if (!str) return '';

  const isConstant = !REGEX_MAP.H_LOWER.test(str);
  const unformatted = normalize(
    str.replace(
      isConstant ? REGEX_MAP.F_DASHE : REGEX_MAP.F_DASHE_UPPER,
      (_, upper) => (isConstant || !upper ? ' ' : ` ${upper}`),
    ),
  ).toLowerCase();

  return unformatted.replace(REGEX_MAP.F_SPACE_FOLLOW_LETTER, (_, letter) =>
    replacer(letter),
  );
}

/**
 * Converte uma string em qualquer case (e.g. snake_case, kebab-case,
 * PascalCase) para camelCase.
 *
 * @param str - `string` - String a ser convertida.
 * @return `string` - A string em camelCase.
 *
 * @example
 *  toCamelCase('hello_world'); // 'helloWorld'
 *  toCamelCase('hello-world'); // 'helloWorld'
 *  toCamelCase('HelloWorld');  // 'helloWorld'
 *
 *  // tratamento automático de constantes snake_case e kebab-case
 *  toCamelCase('HELLO_WORLD'); // 'helloWorld'
 *  toCamelCase('HELLO-WORLD'); // 'helloWorld'
 *
 *  // entrada é normalizada
 *  toCamelCase('café fresquinho'); // 'cafeFresquinho'
 */
export function toCamelCase(str: string): string {
  if (!str) return '';
  return format(str, l => l.toUpperCase());
}

/**
 * Converte uma string em qualquer case (e.g. camelCase, kebab-case, PascalCase)
 * para snake_case.
 *
 * @param str - `string` - String a ser convertida.
 * @param toConstant - `boolean` - Se `true`, retorna em maiúsculas (SNAKE_CASE).
 * @return `string` - A string em snake_case.
 *
 * @example
 *  toSnakeCase('helloWorld');  // 'hello_world'
 *  toSnakeCase('hello-world'); // 'hello_world'
 *  toSnakeCase('HelloWorld');  // 'hello_world'
 *
 *  // tratamento automático de constantes kebab-case
 *  toSnakeCase('HELLO-WORLD'); // 'hello_world'
 *
 *  // conversão para constantes snake_case
 *  toSnakeCase('helloWorld', true);  // 'HELLO_WORLD'
 *
 *  // entrada é normalizada
 *  toSnakeCase('café fresquinho'); // 'cafe_fresquinho'
 */
export function toSnakeCase(str: string, toConstant = false): string {
  if (!str) return '';
  const snakeCase = format(str, letter => `_${letter}`);
  return toConstant ? snakeCase.toUpperCase() : snakeCase;
}

/**
 * Converte uma string em qualquer case (e.g. camelCase, snake_case, PascalCase)
 * para kebab-case.
 *
 * @param str - `string` - String a ser convertida.
 * @param toConstant - `boolean` - Se `true`, retorna em maiúsculas (KEBAB-CASE).
 * @return `string` - A string em kebab-case.
 *
 * @example
 *  toKebabCase('helloWorld');  // 'hello-world'
 *  toKebabCase('hello_world'); // 'hello-world'
 *  toKebabCase('HelloWorld');  // 'hello-world'
 *
 *  // tratamento automático de constantes snake_case
 *  toKebabCase('HELLO_WOLRD'); // 'hello-world'
 *
 *  // conversão para constantes kebab-case
 *  toKebabCase('heloWorld', true); // 'HELLO-WORLD'
 *
 *  // entrada é normalizada
 *  toKebabCase('café fresquinho'); // 'cafe-fresquinho'
 */
export function toKebabCase(str: string, toConstant = false): string {
  if (!str) return '';
  const kebabCase = format(str, letter => `-${letter}`);
  return toConstant ? kebabCase.toUpperCase() : kebabCase;
}

/**
 * Converte uma string em qualquer case (e.g. camelCase, snake_case, kebab-case)
 * para PascalCase.
 *
 * @param str - `string` - String a ser convertida.
 * @return `string` - A string em PascalCase.
 *
 * @example
 *  toPascalCase('helloWorld');   // 'HelloWorld'
 *  toPascalCase('hello_world');  // 'HelloWorld'
 *  toPascalCase('hello-world');  // 'HelloWorld'
 *
 *  // tratamento automático de constantes snake_case e kebab-case
 *  toPascalCase('HELLO_WORLD');  // 'HelloWorld'
 *  toPascalCase('HELLO-WORLD');  // 'HelloWorld'
 *
 *  // entrada é normalizada
 *  toPascalCase('café fresquinho');  // 'CafeFresquinho'
 */
export function toPascalCase(str: string): string {
  if (!str) return '';
  return capitalizeWord(toCamelCase(str));
}

export const CHARS_MAP = {
  LOWER_ALPHABET: 'abcdefghijklmnopqrstuvwxyz',
  UPPER_ALPHABET: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  DIGITS: '0123456789',
} as const;

/**
 * Opções para configuração de {@link randomString}.
 *
 * @template T - Mapa de caracteres (padrão: `typeof CHARS_MAP`).
 */
export type RandomStringOptions<
  T extends Record<string, string> = typeof CHARS_MAP,
> = { chars_map?: T } & ({ length?: number } | { [K in keyof T]?: number });

/**
 * Gera uma string aleatória usando conjuntos de caracteres.
 *
 * @remarks
 *  Dois modos de uso:
 *  - **Comprimento fixo**: `{ length: N }` gera uma string de tamanho `N`,
 *    alternando entre os conjuntos fornecidos em `chars_map`.
 *  - **Quantidade por conjunto**: `{ [conjunto]: quantidade }` gera uma string
 *    com exatamente a quantidade especificada de cada conjunto, embaralhada ao
 *    final.
 *
 * @remarks
 *  **opts** - Se nenhuma chave de configuração for fornecida (objeto vazio),
 *  será utilizado o modo de comprimento fixo com `length = 9`.
 *
 * @template T - Mapa de caracteres, estende `Record<string, string>`.
 * @param opts - `RandomStringOptions<T>` - Opções de geração.
 * @param random - `() => number` - Função que retorna um número em `[0,1)` (padrão: `Math.random`).
 * @return `string` - String aleatória gerada.
 *
 * @example
 *  randomString();                                 // ex: 'aB3xY7zW1'
 *  randomString({ length: 5 });                    // ex: 'cD4eF'
 *  randomString({ LOWER_ALPHABET: 3, DIGITS: 2 }); // ex: 'ab12c' (embaralhado)
 *
 *  // chars_map personalizado
 *  randomString({ chars_map: { chars: '0123456789' } }); // '047928765'
 *
 *  // Exemplo avançado - hexadecimal aleatório
 *  randomString({
 *    chars_map: { upper: 'ABCDEF', digits: CHARS_MAP.DIGITS },
 *    length: 6,
 *  }); // 'A035FB' - hexadeciamal aleatório
 *
 *  // Exemplo avançado - string aleatória de 10 dígitos com caracteres especiais
 *  randomString({
 *    chars_map: {
 *      ...CHARS_MAP,
 *      SPECIAL: '!@#$%&*+§?', // inserção de caracteres especiais
 *    },
 *    LOWER_ALPHABET: 4,
 *    UPPER_ALPHABET: 3,
 *    DIGITS: 3,
 *    SPECIAL: 3, // 'SPECIAL' torna-se uma configuração válida
 *  }); // ex: 'Cd1aAB!3bc2'
 *
 */
export function randomString<
  T extends Record<string, string> = typeof CHARS_MAP,
>(opts: RandomStringOptions<T> = {}, random = Math.random): string {
  const { chars_map = CHARS_MAP, ...rest } = opts;

  if (chars_map !== CHARS_MAP) {
    if (isEmpty(chars_map)) return '';
    if (isEmpty(Object.values(chars_map).join(''))) return '';
  }

  const config = isEmpty(rest) ? { length: 9 } : opts;

  if ('length' in config) {
    const { length = 9 } = config;
    const chars = Object.values(chars_map);
    return shuffle(
      Array.from({ length }, (_, i) =>
        randomItem(chars[i % chars.length]!, random),
      ),
    ).join('');
  } else {
    const result: string[] = [];
    const ref = opts as Record<string, number>;

    for (const k in ref) {
      const length = ref[k]!;
      if (length <= 0) continue;

      const chars = (chars_map as Record<string, string>)[k];
      if (!chars) continue;

      result.push(...Array.from({ length }, () => randomItem(chars, random)!));
    }

    return shuffle(result).join('');
  }
}
