[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / ParserDefinition

# Type Alias: ParserDefinition\<T, K\>

> **ParserDefinition**\<`T`, `K`\> = `object`

Defined in: src/parsers.ts:83

Functions passed to [createParser](../functions/createParser.md) / [createMultiParser](../functions/createMultiParser.md).

## Type Parameters

### T

`T`

### K

`K` *extends* [`ParserType`](ParserType.md)

## Properties

### parse()

> **parse**: (`value`) => `T` \| `null`

Defined in: src/parsers.ts:84

#### Parameters

##### value

[`ParserInput`](ParserInput.md)\<`K`\>

#### Returns

`T` \| `null`

***

### serialize()

> **serialize**: (`value`) => [`ParserOutput`](ParserOutput.md)\<`K`\>

Defined in: src/parsers.ts:85

#### Parameters

##### value

`T`

#### Returns

[`ParserOutput`](ParserOutput.md)\<`K`\>

***

### eq()?

> `optional` **eq**: (`valueA`, `valueB`) => `boolean`

Defined in: src/parsers.ts:86

#### Parameters

##### valueA

`T`

##### valueB

`T`

#### Returns

`boolean`
