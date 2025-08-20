[**vue-qs v0.1.18**](../README.md)

***

[vue-qs](../README.md) / buildSearchString

# Function: buildSearchString()

> **buildSearchString**(`queryObject`): `string`

Defined in: [utils/core-helpers.ts:92](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/utils/core-helpers.ts#L92)

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
