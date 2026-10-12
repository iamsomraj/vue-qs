[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / throttle

# Function: throttle()

> **throttle**(`timeMs`): [`LimitUrlUpdates`](../type-aliases/LimitUrlUpdates.md)

Defined in: src/options.ts:56

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
