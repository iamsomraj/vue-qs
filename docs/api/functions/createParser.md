[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / createParser

# Function: createParser()

> **createParser**\<`T`\>(`definition`): [`ParserBuilder`](../type-aliases/ParserBuilder.md)\<`T`\>

Defined in: [src/parsers.ts:152](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/parsers.ts#L152)

Creates a custom parser for a single query value.

## Type Parameters

### T

`T`

## Parameters

### definition

[`ParserDefinition`](../type-aliases/ParserDefinition.md)\<`T`, `"single"`\>

## Returns

[`ParserBuilder`](../type-aliases/ParserBuilder.md)\<`T`\>

## Example

```ts
const parseAsStarRating = createParser({
  parse: (value) => (value.match(/★/g)?.length ?? null),
  serialize: (value) => '★'.repeat(value),
})
```
