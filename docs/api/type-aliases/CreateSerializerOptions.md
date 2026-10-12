[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / CreateSerializerOptions

# Type Alias: CreateSerializerOptions\<Parsers\>

> **CreateSerializerOptions**\<`Parsers`\> = `object`

Defined in: [src/serializer.ts:6](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/serializer.ts#L6)

Options for [createSerializer](../functions/createSerializer.md).

## Type Parameters

### Parsers

`Parsers` *extends* [`ParserMap`](ParserMap.md)

## Properties

### clearOnDefault?

> `optional` **clearOnDefault**: `boolean`

Defined in: [src/serializer.ts:8](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/serializer.ts#L8)

Remove keys whose value equals their default (default: `true`)

***

### urlKeys?

> `optional` **urlKeys**: [`UrlKeys`](UrlKeys.md)\<`Parsers`\>

Defined in: [src/serializer.ts:10](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/serializer.ts#L10)

Map state keys to different URL keys
