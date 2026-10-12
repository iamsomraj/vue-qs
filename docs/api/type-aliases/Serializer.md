[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / Serializer

# Type Alias: Serializer()\<Parsers\>

> **Serializer**\<`Parsers`\> = \{(`values`): `string`; (`base`, `values`): `string`; \}

Defined in: [src/serializer.ts:17](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/serializer.ts#L17)

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
