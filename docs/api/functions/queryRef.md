[**vue-qs v0.1.18**](../README.md)

***

[vue-qs](../README.md) / queryRef

# Function: queryRef()

> **queryRef**\<`T`\>(`parameterName`, `options`): [`QueryRefReturn`](../type-aliases/QueryRefReturn.md)\<`T`\>

Defined in: [composables/use-query-ref.ts:90](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/composables/use-query-ref.ts#L90)

Manages a single query parameter as a Vue Ref with URL synchronization

## Type Parameters

### T

`T`

The type of the parameter value

## Parameters

### parameterName

`string`

The name of the URL query parameter

### options

[`QueryRefOptions`](../type-aliases/QueryRefOptions.md)\<`T`\> = `{}`

Configuration options for the parameter

## Returns

[`QueryRefReturn`](../type-aliases/QueryRefReturn.md)\<`T`\>

Reactive ref that stays in sync with the URL parameter

## Example

```typescript
import { queryRef, numberCodec } from 'vue-qs';

// Simple string parameter with default
const searchQuery = queryRef('q', {
  defaultValue: ''
});

// Number parameter with custom codec
const currentPage = queryRef('page', {
  defaultValue: 1,
  codec: numberCodec,
  shouldOmitDefault: true
});

// Update the URL by changing the ref value
searchQuery.value = 'hello world';
currentPage.value = 2;
```
