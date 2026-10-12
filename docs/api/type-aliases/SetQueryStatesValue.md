[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / SetQueryStatesValue

# Type Alias: SetQueryStatesValue\<Parsers\>

> **SetQueryStatesValue**\<`Parsers`\> = `Partial`\<[`Nullable`](Nullable.md)\<[`Values`](Values.md)\<`Parsers`\>\>\> \| `null` \| (`current`) => `Partial`\<[`Nullable`](Nullable.md)\<[`Values`](Values.md)\<`Parsers`\>\>\> \| `null`

Defined in: src/composables/use-query-states.ts:15

New values for [QueryStates.$set](QueryStates.md): a partial object, `null` to clear all keys, or an updater.

## Type Parameters

### Parsers

`Parsers` *extends* [`ParserMap`](ParserMap.md)
