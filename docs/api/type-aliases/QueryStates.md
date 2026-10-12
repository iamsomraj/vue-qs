[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / QueryStates

# Type Alias: QueryStates\<Parsers\>

> **QueryStates**\<`Parsers`\> = [`Values`](Values.md)\<`Parsers`\> & `object`

Defined in: [src/composables/use-query-states.ts:24](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/composables/use-query-states.ts#L24)

A reactive object bound to several URL query keys.
Assign properties (or `v-model` them through `toRefs`) to update the URL.

## Type declaration

### $set()

> `readonly` **$set**: (`values`, `options?`) => `Promise`\<`URLSearchParams`\>

Updates several keys in a single URL update.
Keys set to `null` are removed; passing `null` removes every key.

#### Parameters

##### values

[`SetQueryStatesValue`](SetQueryStatesValue.md)\<`Parsers`\>

##### options?

[`Options`](Options.md)

#### Returns

`Promise`\<`URLSearchParams`\>

The search params once written to the URL

## Type Parameters

### Parsers

`Parsers` *extends* [`ParserMap`](ParserMap.md)
