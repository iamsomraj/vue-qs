[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / parseAsStringEnum

# Function: parseAsStringEnum()

> **parseAsStringEnum**\<`Enum`\>(`validValues`): [`ParserBuilder`](../type-aliases/ParserBuilder.md)\<`Enum`\>

Defined in: src/parsers.ts:263

String enum. Values outside the enum are treated as invalid.

## Type Parameters

### Enum

`Enum` *extends* `string`

## Parameters

### validValues

readonly `Enum`[]

## Returns

[`ParserBuilder`](../type-aliases/ParserBuilder.md)\<`Enum`\>

## Example

```ts
enum Direction { up = 'UP', down = 'DOWN' }
const direction = useQueryState('dir', parseAsStringEnum<Direction>(Object.values(Direction)))
```
