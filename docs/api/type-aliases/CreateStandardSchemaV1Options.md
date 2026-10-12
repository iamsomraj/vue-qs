[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / CreateStandardSchemaV1Options

# Type Alias: CreateStandardSchemaV1Options\<Parsers\>

> **CreateStandardSchemaV1Options**\<`Parsers`\> = `object`

Defined in: src/standard-schema.ts:31

Options for [createStandardSchemaV1](../functions/createStandardSchemaV1.md).

## Type Parameters

### Parsers

`Parsers` *extends* `Record`\<`string`, [`AnyParserBuilder`](AnyParserBuilder.md)\>

## Properties

### urlKeys?

> `optional` **urlKeys**: [`UrlKeys`](UrlKeys.md)\<`Parsers`\>

Defined in: src/standard-schema.ts:33

Map state keys to different URL keys

***

### partialOutput?

> `optional` **partialOutput**: `boolean`

Defined in: src/standard-schema.ts:35

Only include keys present in the input
