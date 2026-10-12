[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / Serializer

# Type Alias: Serializer()\<Parsers\>

> **Serializer**\<`Parsers`\> = \{(`values`): `string`; (`base`, `values`): `string`; \}

Defined in: src/serializer.ts:17

Function returned by [createSerializer](../functions/createSerializer.md).

## Type Parameters

### Parsers

`Parsers` *extends* [`ParserMap`](ParserMap.md)

## Call Signature

> (`values`): `string`

### Parameters

#### values

`Partial`\<[`Nullable`](Nullable.md)\<[`Values`](Values.md)\<`Parsers`\>\>\>

### Returns

`string`

## Call Signature

> (`base`, `values`): `string`

### Parameters

#### base

[`SerializerBase`](SerializerBase.md)

#### values

`null` | `Partial`\<[`Nullable`](Nullable.md)\<[`Values`](Values.md)\<`Parsers`\>\>\>

### Returns

`string`
