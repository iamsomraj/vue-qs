[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / createMultiParser

# Function: createMultiParser()

> **createMultiParser**\<`T`\>(`definition`): [`ParserBuilder`](../type-aliases/ParserBuilder.md)\<`T`, `"multi"`\>

Defined in: [src/parsers.ts:159](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/parsers.ts#L159)

Creates a custom parser reading every value of a repeated key (`?id=1&id=2`).

## Type Parameters

### T

`T`

## Parameters

### definition

[`ParserDefinition`](../type-aliases/ParserDefinition.md)\<`T`, `"multi"`\>

## Returns

[`ParserBuilder`](../type-aliases/ParserBuilder.md)\<`T`, `"multi"`\>
