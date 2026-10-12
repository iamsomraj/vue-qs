[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / useQueryStates

# Function: useQueryStates()

> **useQueryStates**\<`Parsers`\>(`parsers`, `options`): [`QueryStates`](../type-aliases/QueryStates.md)\<`Parsers`\>

Defined in: src/composables/use-query-states.ts:55

Binds several URL query keys to a reactive object. Updates made in the same
tick are batched into one URL update.

## Type Parameters

### Parsers

`Parsers` *extends* [`ParserMap`](../type-aliases/ParserMap.md)

## Parameters

### parsers

`Parsers`

An object of parsers, keyed by state key

### options

[`UseQueryStatesOptions`](../type-aliases/UseQueryStatesOptions.md)\<`Parsers`\> = `{}`

URL update options, and `urlKeys` to rename keys in the URL

## Returns

[`QueryStates`](../type-aliases/QueryStates.md)\<`Parsers`\>

## Example

```ts
const coords = useQueryStates(
  { lat: parseAsFloat.withDefault(0), lng: parseAsFloat.withDefault(0) },
  { urlKeys: { lat: 'y', lng: 'x' } }
)

coords.lat = 48.85                             // ?y=48.85
await coords.$set({ lat: 0, lng: 0 })          // one URL update for both keys
const { lat, lng } = toRefs(coords)            // v-model friendly refs
```
