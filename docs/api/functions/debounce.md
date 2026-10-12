[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / debounce

# Function: debounce()

> **debounce**(`timeMs`): [`LimitUrlUpdates`](../type-aliases/LimitUrlUpdates.md)

Defined in: [src/options.ts:69](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/options.ts#L69)

Delays the URL update until no new update happened for `timeMs` milliseconds.
Useful for search inputs that drive server requests.

## Parameters

### timeMs

`number`

## Returns

[`LimitUrlUpdates`](../type-aliases/LimitUrlUpdates.md)

## Example

```ts
await q.set(value, { limitUrlUpdates: debounce(500) })
```
