[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / QueryAdapter

# Type Alias: QueryAdapter

> **QueryAdapter** = `object`

Defined in: [src/adapters/types.ts:23](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/adapters/types.ts#L23)

Connects vue-qs to a source of truth for the URL (browser History API,
Vue Router, an in-memory store for tests…).

## Example

```ts
const adapter = createAdapter({
  getSearchParams: () => new URLSearchParams(location.search),
  updateUrl: (search, { history }) => { ... },
  subscribe: (onChange) => { ...; return () => {} },
})
```

## Properties

### rateLimitFactor?

> `optional` **rateLimitFactor**: `number`

Defined in: [src/adapters/types.ts:31](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/adapters/types.ts#L31)

Multiplier applied to throttle delays (`0` disables throttling, e.g. in tests).

## Methods

### getSearchParams()

> **getSearchParams**(): `URLSearchParams`

Defined in: [src/adapters/types.ts:25](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/adapters/types.ts#L25)

Returns the current search params. Callers must not mutate the result.

#### Returns

`URLSearchParams`

***

### updateUrl()

> **updateUrl**(`search`, `options`): `void` \| `Promise`\<`void`\>

Defined in: [src/adapters/types.ts:27](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/adapters/types.ts#L27)

Writes new search params to the URL. May return a promise for async navigation.

#### Parameters

##### search

`URLSearchParams`

##### options

[`UpdateUrlOptions`](UpdateUrlOptions.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### subscribe()

> **subscribe**(`onChange`): () => `void`

Defined in: [src/adapters/types.ts:29](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/adapters/types.ts#L29)

Calls `onChange` when the URL changes from outside vue-qs. Returns an unsubscribe function.

#### Parameters

##### onChange

() => `void`

#### Returns

> (): `void`

##### Returns

`void`
