[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / ParserBuilderWithDefault

# Type Alias: ParserBuilderWithDefault\<T, K\>

> **ParserBuilderWithDefault**\<`T`, `K`\> = `Omit`\<[`ParserBuilder`](ParserBuilder.md)\<`T`, `K`\>, `"parseServerSide"`\> & `object`

Defined in: src/parsers.ts:49

A [ParserBuilder](ParserBuilder.md) with a default value.

## Type declaration

### defaultValue

> `readonly` **defaultValue**: `NonNullable`\<`T`\>

### parseServerSide()

> **parseServerSide**(`value`): `NonNullable`\<`T`\>

Parses a raw value outside of Vue, falling back to the default value

#### Parameters

##### value

`undefined` | `null` | `string` | readonly `string`[]

#### Returns

`NonNullable`\<`T`\>

## Type Parameters

### T

`T`

### K

`K` *extends* [`ParserType`](ParserType.md) = `"single"`
