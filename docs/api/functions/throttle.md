[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / throttle

# Function: throttle()

> **throttle**(`timeMs`): [`LimitUrlUpdates`](../type-aliases/LimitUrlUpdates.md)

Defined in: [src/options.ts:56](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/options.ts#L56)

Emits URL updates at most once every `timeMs` milliseconds.
State updates stay instant; only URL writes are rate-limited.

## Parameters

### timeMs

`number`

## Returns

[`LimitUrlUpdates`](../type-aliases/LimitUrlUpdates.md)

## Example

```ts
const q = useQueryState('q', parseAsString.withOptions({ limitUrlUpdates: throttle(300) }))
```
