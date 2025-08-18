[**vue-qs v0.1.18-beta.7**](../README.md)

***

[vue-qs](../README.md) / removeUndefinedValues

# Function: removeUndefinedValues()

> **removeUndefinedValues**\<`T`\>(`sourceObject`): `Partial`\<`T`\>

Defined in: [utils/core-helpers.ts:177](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/utils/core-helpers.ts#L177)

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
