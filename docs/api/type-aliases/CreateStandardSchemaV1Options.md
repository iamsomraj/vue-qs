[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / CreateStandardSchemaV1Options

# Type Alias: CreateStandardSchemaV1Options\<Parsers\>

> **CreateStandardSchemaV1Options**\<`Parsers`\> = `object`

Defined in: [src/standard-schema.ts:31](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/standard-schema.ts#L31)

Options for [createStandardSchemaV1](../functions/createStandardSchemaV1.md).

## Type Parameters

### Parsers

`Parsers` *extends* `Record`\<`string`, [`AnyParserBuilder`](AnyParserBuilder.md)\>

## Properties

### urlKeys?

> `optional` **urlKeys**: [`UrlKeys`](UrlKeys.md)\<`Parsers`\>

Defined in: [src/standard-schema.ts:33](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/standard-schema.ts#L33)

Map state keys to different URL keys

***

### partialOutput?

> `optional` **partialOutput**: `boolean`

Defined in: [src/standard-schema.ts:35](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/standard-schema.ts#L35)

Only include keys present in the input
