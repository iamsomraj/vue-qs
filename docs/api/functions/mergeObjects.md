[**vue-qs v0.1.18-beta.7**](../README.md)

***

[vue-qs](../README.md) / mergeObjects

# Function: mergeObjects()

> **mergeObjects**\<`T`\>(`baseObject`, `updateObject`): `T`

Defined in: [utils/core-helpers.ts:155](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/utils/core-helpers.ts#L155)

Safely merges two objects

## Type Parameters

### T

`T` *extends* `Record`\<`string`, `unknown`\>

## Parameters

### baseObject

`T`

Base object to merge into

### updateObject

`Partial`\<`T`\>

Object with updates to apply

## Returns

`T`

New merged object

## Example

```ts
const base = { page: 1, search: 'old' };
const updates = { search: 'new', filter: 'active' };
mergeObjects(base, updates)
// Returns: { page: 1, search: 'new', filter: 'active' }
```
