[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / ParserBuilder

# Type Alias: ParserBuilder\<T, K\>

> **ParserBuilder**\<`T`, `K`\> = [`Parser`](Parser.md)\<`T`, `K`\> & [`Options`](Options.md) & `object`

Defined in: src/parsers.ts:35

A parser with chainable builder methods.
Created by [createParser](../functions/createParser.md) or one of the built-in `parseAs*` parsers.

## Type declaration

### withOptions()

> **withOptions**\<`This`\>(`this`, `options`): `This`

Returns a copy of the parser with the given URL update options

#### Type Parameters

##### This

`This`

#### Parameters

##### this

`This`

##### options

[`Options`](Options.md)

#### Returns

`This`

### withDefault()

> **withDefault**(`this`, `defaultValue`): [`ParserBuilderWithDefault`](ParserBuilderWithDefault.md)\<`T`, `K`\>

Returns a copy of the parser that falls back to `defaultValue` when the key is missing or invalid

#### Parameters

##### this

`ParserBuilder`\<`T`, `K`\>

##### defaultValue

`NonNullable`\<`T`\>

#### Returns

[`ParserBuilderWithDefault`](ParserBuilderWithDefault.md)\<`T`, `K`\>

### parseServerSide()

> **parseServerSide**(`value`): `null` \| `T`

Parses a raw value outside of Vue, e.g. on the server

#### Parameters

##### value

`undefined` | `null` | `string` | readonly `string`[]

#### Returns

`null` \| `T`

## Type Parameters

### T

`T`

### K

`K` *extends* [`ParserType`](ParserType.md) = `"single"`
