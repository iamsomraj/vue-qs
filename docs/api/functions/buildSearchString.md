[**vue-qs v0.1.18-beta.7**](../README.md)

***

[vue-qs](../README.md) / buildSearchString

# Function: buildSearchString()

> **buildSearchString**(`queryObject`): `string`

Defined in: [utils/core-helpers.ts:92](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/utils/core-helpers.ts#L92)

Safely converts a query object to a URL search string

## Parameters

### queryObject

`Record`\<`string`, `string` \| `undefined`\>

Object with key-value pairs

## Returns

`string`

URL search string with leading '?' or empty string

## Example

```ts
buildSearchString({ page: '1', search: 'test' })
// Returns: '?page=1&search=test'

buildSearchString({ page: undefined, search: 'test' })
// Returns: '?search=test'
```
