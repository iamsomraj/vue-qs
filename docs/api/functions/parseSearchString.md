[**vue-qs v0.1.18-beta.7**](../README.md)

***

[vue-qs](../README.md) / parseSearchString

# Function: parseSearchString()

> **parseSearchString**(`searchString`): `Record`\<`string`, `string`\>

Defined in: [utils/core-helpers.ts:56](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/utils/core-helpers.ts#L56)

Safely converts a URL search string to a plain object

## Parameters

### searchString

`string`

The URL search string (with or without leading '?')

## Returns

`Record`\<`string`, `string`\>

Object with key-value pairs from the search string

## Example

```ts
parseSearchString('?page=1&search=test')
// Returns: { page: '1', search: 'test' }

parseSearchString('page=1&search=test')
// Returns: { page: '1', search: 'test' }
```
