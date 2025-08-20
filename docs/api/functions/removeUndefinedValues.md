[**vue-qs v0.1.18**](../README.md)

***

[vue-qs](../README.md) / removeUndefinedValues

# Function: removeUndefinedValues()

> **removeUndefinedValues**\<`T`\>(`sourceObject`): `Partial`\<`T`\>

Defined in: [utils/core-helpers.ts:177](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/utils/core-helpers.ts#L177)

Safely removes undefined values from an object

## Type Parameters

### T

`T` *extends* `Record`\<`string`, `unknown`\>

## Parameters

### sourceObject

`T`

Object to clean

## Returns

`Partial`\<`T`\>

New object without undefined values

## Example

```ts
removeUndefinedValues({ a: 1, b: undefined, c: 'test' })
// Returns: { a: 1, c: 'test' }
```
