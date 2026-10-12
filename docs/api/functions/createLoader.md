[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / createLoader

# Function: createLoader()

> **createLoader**\<`Parsers`\>(`parsers`, `options`): [`Loader`](../type-aliases/Loader.md)\<`Parsers`\>

Defined in: [src/loader.ts:69](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/loader.ts#L69)

Creates a function that parses search params into typed state,
outside of components: in Nuxt server routes, route middleware,
`useAsyncData`, or any server code.

## Type Parameters

### Parsers

`Parsers` *extends* [`ParserMap`](../type-aliases/ParserMap.md)

## Parameters

### parsers

`Parsers`

### options

[`CreateLoaderOptions`](../type-aliases/CreateLoaderOptions.md)\<`Parsers`\> = `{}`

## Returns

[`Loader`](../type-aliases/Loader.md)\<`Parsers`\>

## Example

```ts
const loadSearchParams = createLoader({
  q: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
})

// Nuxt server route
export default defineEventHandler((event) => {
  const { q, page } = loadSearchParams(getQuery(event))
})
```
