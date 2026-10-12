[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / createSerializer

# Function: createSerializer()

> **createSerializer**\<`Parsers`\>(`parsers`, `options`): [`Serializer`](../type-aliases/Serializer.md)\<`Parsers`\>

Defined in: [src/serializer.ts:55](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/serializer.ts#L55)

Creates a type-safe function that renders state into a query string,
e.g. to build links.

## Type Parameters

### Parsers

`Parsers` *extends* [`ParserMap`](../type-aliases/ParserMap.md)

## Parameters

### parsers

`Parsers`

### options

[`CreateSerializerOptions`](../type-aliases/CreateSerializerOptions.md)\<`Parsers`\> = `{}`

## Returns

[`Serializer`](../type-aliases/Serializer.md)\<`Parsers`\>

## Example

```ts
const serialize = createSerializer({ q: parseAsString, page: parseAsInteger.withDefault(1) })
serialize({ q: 'vue', page: 2 })             // '?q=vue&page=2'
serialize('/search?lang=en', { q: 'vue' })   // '/search?lang=en&q=vue'
serialize('/search?q=vue', null)            // '/search' (clears known keys)
```
