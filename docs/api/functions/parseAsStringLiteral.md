[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / parseAsStringLiteral

# Function: parseAsStringLiteral()

> **parseAsStringLiteral**\<`Literal`\>(`validValues`): [`ParserBuilder`](../type-aliases/ParserBuilder.md)\<`Literal`\>

Defined in: src/parsers.ts:280

String literal union. Values outside the list are treated as invalid.

## Type Parameters

### Literal

`Literal` *extends* `string`

## Parameters

### validValues

readonly `Literal`[]

## Returns

[`ParserBuilder`](../type-aliases/ParserBuilder.md)\<`Literal`\>

## Example

```ts
const sort = useQueryState('sort', parseAsStringLiteral(['asc', 'desc'] as const).withDefault('asc'))
```
