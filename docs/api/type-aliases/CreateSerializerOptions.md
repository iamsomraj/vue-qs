[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / CreateSerializerOptions

# Type Alias: CreateSerializerOptions\<Parsers\>

> **CreateSerializerOptions**\<`Parsers`\> = `object`

Defined in: src/serializer.ts:6

Options for [createSerializer](../functions/createSerializer.md).

## Type Parameters

### Parsers

`Parsers` *extends* [`ParserMap`](ParserMap.md)

## Properties

### clearOnDefault?

> `optional` **clearOnDefault**: `boolean`

Defined in: src/serializer.ts:8

Remove keys whose value equals their default (default: `true`)

***

### urlKeys?

> `optional` **urlKeys**: [`UrlKeys`](UrlKeys.md)\<`Parsers`\>

Defined in: src/serializer.ts:10

Map state keys to different URL keys
