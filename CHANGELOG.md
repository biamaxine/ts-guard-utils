# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [2.0.0] - 2026-07-09

### Adicionado

- **Módulo central de tipos (`types.ts`):**
  - Interface `TypeMap` mapeando categorias de tipo (`'null'`, `'array'`, `'string'`, etc.) para seus tipos TypeScript.
  - Função `typeOf` (reescrita) que estende o `typeof` nativo, retornando `'null'` para `null` e `'array'` para arrays.
  - Type guards genéricos `isTypeOf` e `isNotTypeOf` baseados no `TypeMap`.
  - Conjunto completo de guards específicos para todos os tipos primitivos e seus derivados:
    - `isUndefined`, `isNotUndefined`, `isUndefinedList`
    - `isNull`, `isNotNull`, `isNullList`
    - `isNullable`, `isNotNullable`, `isNullableList`
    - `isString`, `isNotString`, `isStringList`
    - `isNumber`, `isNotNumber`, `isNumberList`
    - `isBoolean`, `isNotBoolean`, `isBooleanList`
    - `isSymbol`, `isNotSymbol`, `isSymbolList`
    - `isBigInt`, `isNotBigInt`, `isBigIntList`
    - `isFunction`, `isNotFunction`, `isFunctionList`
    - `isObject`, `isNotObject`, `isObjectList`
    - `isArray`, `isNotArray`
  - Type guard `isArrayOf` para verificar se todos os elementos de um array pertencem a determinados tipos.

- **Módulo de objetos (`object.ts`):**
  - Novo type guard `isEntryOf` para validação de pares `[chave, valor]`.
  - Funções `pick` e `omit` imutáveis, agora com inferência de tipos aprimorada (dependendo da correção de `PlainObject`).

- **Módulo de arrays (`array.ts`):**
  - `clearUndefineds`: remove valores `undefined` de arrays.
  - `clearNulls`: remove valores `null` de arrays.
  - `takeRandomItem`: remove e retorna um elemento aleatório (modifica o array original).
  - `randomItems`: seleciona `n` elementos aleatórios distintos sem modificar o original.
  - `takeRandomItems`: remove e retorna `n` elementos aleatórios (modifica o array original).
  - Todas as funções aleatórias aceitam um gerador `random` customizável (padrão `Math.random`).

- **Módulo de strings (`string.ts`):**
  - Constante `CHARS_MAP` com conjuntos de caracteres pré-definidos (alfabeto minúsculo, maiúsculo, dígitos).
  - Nova função `normalize` (substitui `clearText`) que remove diacríticos e normaliza espaços.
  - Nova função `randomString` (substitui `strRandom`) com dois modos de geração:
    - Comprimento fixo (alterna entre conjuntos de caracteres).
    - Quantidade por conjunto (gera número exato de caracteres de cada tipo, embaralhados ao final).
  - Suporte a conjuntos de caracteres customizados via `RandomStringOptions`.
  - Detecção automática de constantes (ex.: `HELLO_WORLD`) nas conversões de case, evitando perda de informação.
  - Parâmetro opcional `toConstant` em `toSnakeCase` e `toKebabCase` para gerar versões maiúsculas (ex.: `SNAKE_CASE`, `KEBAB-CASE`).

### Modificado

- **Reescrita completa da arquitetura:** código organizado em módulos separados (`types`, `empty`, `array`, `object`, `string`) com reexportação centralizada em `index.ts`.
- **`typeOf`** agora reside em `types.ts` e retorna `'null'` e `'array'` como categorias distintas (antes retornava `'object'` para ambos e estava em `object.ts`).
- **`isEmpty` e `isNotEmpty`** movidos para `empty.ts`, juntamente com `isPlainObject`.
- **`PlainObject`** alterado para `Record<string, unknown>` (antes `Record<string, any>`), mas **suscetível a problemas de compatibilidade** (ver notas de atualização).
- **`clearText`** renomeado para **`normalize`**.
- **`strRandom`** renomeado para **`randomString`**, com API expandida e tipagem mais segura.
- **`randomIndex` e `randomItem`** agora aceitam gerador `random` opcional.
- **Conversões de case** (`toCamelCase`, `toSnakeCase`, etc.) aplicam automaticamente `normalize` na entrada, removendo acentos e espaços extras, e tratam padrões de constantes.

### Removido

- `typeOfArray`: sua funcionalidade é suprida por `isArrayOf` e pelo próprio `typeOf` que distingue arrays.
- `clearText` (substituído por `normalize`).
- Antiga implementação de `strRandom` (substituída por `randomString` com novas opções).

### Notas de atualização da v1.0.0 para v2.0.0

- A definição de `PlainObject` como `Record<string, unknown>` pode causar erros de tipo ao usar `pick`, `omit`, `isKeyOf`, `isValueOf` e `isEntryOf` com objetos tipados. Para restaurar a compatibilidade, recomenda-se alterar para `Record<string, any>` ou adotar um tipo opaco com brand.
- Todas as funções aleatórias agora permitem injeção de um gerador determinístico, facilitando testes.
- As funções de case realizam normalização Unicode automaticamente; se o comportamento antigo (sem remoção de acentos) for desejado, use as funções da v1 ou aplique uma etapa de pré-limpeza.
