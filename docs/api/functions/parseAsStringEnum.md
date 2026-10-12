[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / parseAsStringEnum

# Function: parseAsStringEnum()

> **parseAsStringEnum**\<`Enum`\>(`validValues`): [`ParserBuilder`](../type-aliases/ParserBuilder.md)\<`Enum`\>

Defined in: [src/parsers.ts:263](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/parsers.ts#L263)

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
