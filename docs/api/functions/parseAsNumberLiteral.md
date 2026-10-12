[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / parseAsNumberLiteral

# Function: parseAsNumberLiteral()

> **parseAsNumberLiteral**\<`Literal`\>(`validValues`): [`ParserBuilder`](../type-aliases/ParserBuilder.md)\<`Literal`\>

Defined in: src/parsers.ts:297

Number literal union. Values outside the list are treated as invalid.

## Type Parameters

### Literal

`Literal` *extends* `number`

## Parameters

### validValues

readonly `Literal`[]

## Returns

[`ParserBuilder`](../type-aliases/ParserBuilder.md)\<`Literal`\>

## Example

```ts
const dice = useQueryState('dice', parseAsNumberLiteral([1, 2, 3, 4, 5, 6] as const))
```
