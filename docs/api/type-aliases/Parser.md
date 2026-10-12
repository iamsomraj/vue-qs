[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / Parser

# Type Alias: Parser\<T, K\>

> **Parser**\<`T`, `K`\> = `object`

Defined in: [src/parsers.ts:21](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/parsers.ts#L21)

Converts between URL query values and typed state.

## Type Parameters

### T

`T`

The state type

### K

`K` *extends* [`ParserType`](ParserType.md) = `"single"`

Whether the parser reads a single value or repeated keys

## Properties

### type

> `readonly` **type**: `K`

Defined in: [src/parsers.ts:22](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/parsers.ts#L22)

## Methods

### parse()

> **parse**(`value`): `null` \| `T`

Defined in: [src/parsers.ts:24](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/parsers.ts#L24)

Converts a query value into state, returning `null` for invalid input

#### Parameters

##### value

[`ParserInput`](ParserInput.md)\<`K`\>

#### Returns

`null` \| `T`

***

### serialize()

> **serialize**(`value`): [`ParserOutput`](ParserOutput.md)\<`K`\>

Defined in: [src/parsers.ts:26](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/parsers.ts#L26)

Converts state into a query value

#### Parameters

##### value

`T`

#### Returns

[`ParserOutput`](ParserOutput.md)\<`K`\>

***

### eq()

> **eq**(`valueA`, `valueB`): `boolean`

Defined in: [src/parsers.ts:28](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/parsers.ts#L28)

Compares two state values (used for `clearOnDefault` and change detection)

#### Parameters

##### valueA

`T`

##### valueB

`T`

#### Returns

`boolean`
