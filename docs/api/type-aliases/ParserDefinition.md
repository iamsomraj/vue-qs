[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / ParserDefinition

# Type Alias: ParserDefinition\<T, K\>

> **ParserDefinition**\<`T`, `K`\> = `object`

Defined in: [src/parsers.ts:83](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/parsers.ts#L83)

Functions passed to [createParser](../functions/createParser.md) / [createMultiParser](../functions/createMultiParser.md).

## Type Parameters

### T

`T`

### K

`K` *extends* [`ParserType`](ParserType.md)

## Properties

### parse()

> **parse**: (`value`) => `T` \| `null`

Defined in: [src/parsers.ts:84](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/parsers.ts#L84)

#### Parameters

##### value

[`ParserInput`](ParserInput.md)\<`K`\>

#### Returns

`T` \| `null`

***

### serialize()

> **serialize**: (`value`) => [`ParserOutput`](ParserOutput.md)\<`K`\>

Defined in: [src/parsers.ts:85](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/parsers.ts#L85)

#### Parameters

##### value

`T`

#### Returns

[`ParserOutput`](ParserOutput.md)\<`K`\>

***

### eq()?

> `optional` **eq**: (`valueA`, `valueB`) => `boolean`

Defined in: [src/parsers.ts:86](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/parsers.ts#L86)

#### Parameters

##### valueA

`T`

##### valueB

`T`

#### Returns

`boolean`
