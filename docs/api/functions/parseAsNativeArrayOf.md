[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / parseAsNativeArrayOf

# Function: parseAsNativeArrayOf()

> **parseAsNativeArrayOf**\<`T`\>(`itemParser`): [`ParserBuilderWithDefault`](../type-aliases/ParserBuilderWithDefault.md)\<`T`[], `"multi"`\>

Defined in: [src/parsers.ts:385](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/parsers.ts#L385)

Array of items stored as repeated keys (`?tag=vue&tag=nuxt`).
Defaults to an empty array.

## Type Parameters

### T

`T`

## Parameters

### itemParser

[`Parser`](../type-aliases/Parser.md)\<`T`\>

Parser for each item

## Returns

[`ParserBuilderWithDefault`](../type-aliases/ParserBuilderWithDefault.md)\<`T`[], `"multi"`\>
