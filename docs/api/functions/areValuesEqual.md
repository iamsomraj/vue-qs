[**vue-qs v0.1.18-beta.7**](../README.md)

***

[vue-qs](../README.md) / areValuesEqual

# Function: areValuesEqual()

> **areValuesEqual**\<`T`\>(`valueA`, `valueB`, `customEquals?`): `boolean`

Defined in: [utils/core-helpers.ts:126](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/utils/core-helpers.ts#L126)

Safely compares two values for equality

## Type Parameters

### T

`T`

## Parameters

### valueA

`T`

First value to compare

### valueB

`T`

Second value to compare

### customEquals?

(`a`, `b`) => `boolean`

Optional custom equality function

## Returns

`boolean`

true if values are equal

## Example

```ts
// Default comparison
areValuesEqual(1, 1) // true
areValuesEqual({}, {}) // false (different objects)

// Custom comparison
areValuesEqual({ id: 1 }, { id: 1 }, (a, b) => a.id === b.id) // true
```
