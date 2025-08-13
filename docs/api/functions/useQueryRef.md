[**vue-qs v0.1.12**](../README.md)

***

[vue-qs](../README.md) / useQueryRef

# Function: useQueryRef()

> **useQueryRef**\<`T`\>(`parameterName`, `options`): [`QueryRefReturn`](../type-aliases/QueryRefReturn.md)\<`T`\>

Defined in: [composables/use-query-ref.ts:94](https://github.com/iamsomraj/vue-qs/blob/d83859c8f33bf2e18a7dd57e3cf216fcc2100466/src/composables/use-query-ref.ts#L94)

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

[`UseQueryRefOptions`](../type-aliases/UseQueryRefOptions.md)\<`T`\> = `{}`

Configuration options for the parameter

## Returns

[`QueryRefReturn`](../type-aliases/QueryRefReturn.md)\<`T`\>

Reactive ref that stays in sync with the URL parameter

## Example

```typescript
import { useQueryRef, numberCodec } from 'vue-qs';

// Simple string parameter with default
const searchQuery = useQueryRef('q', {
  defaultValue: '',
  enableTwoWaySync: true
});

// Number parameter with custom codec
const currentPage = useQueryRef('page', {
  defaultValue: 1,
  codec: numberCodec,
  shouldOmitDefault: true
});

// Update the URL by changing the ref value
searchQuery.value = 'hello world';
currentPage.value = 2;

// Manually sync to URL
searchQuery.syncToUrl();
```
