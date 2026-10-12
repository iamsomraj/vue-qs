[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / parseAsArrayOf

# Function: parseAsArrayOf()

> **parseAsArrayOf**\<`T`\>(`itemParser`, `separator`): [`ParserBuilder`](../type-aliases/ParserBuilder.md)\<`T`[]\>

Defined in: [src/parsers.ts:359](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/parsers.ts#L359)

Array of items in a single key, joined with a separator (`?tags=vue,nuxt`).
Separators inside items are percent-encoded.

## Type Parameters

### T

`T`

## Parameters

### itemParser

[`Parser`](../type-aliases/Parser.md)\<`T`\>

Parser for each item

### separator

`string` = `','`

Item separator (default: `,`)

## Returns

[`ParserBuilder`](../type-aliases/ParserBuilder.md)\<`T`[]\>
