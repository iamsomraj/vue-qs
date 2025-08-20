[**vue-qs v0.1.18-beta.7**](../README.md)

***

[vue-qs](../README.md) / queryRef

# Function: queryRef()

> **queryRef**\<`T`\>(`parameterName`, `options`): [`QueryRefReturn`](../type-aliases/QueryRefReturn.md)\<`T`\>

Defined in: [composables/use-query-ref.ts:90](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/composables/use-query-ref.ts#L90)

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
