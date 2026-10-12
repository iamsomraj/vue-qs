[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / parseAsJson

# Function: parseAsJson()

> **parseAsJson**\<`T`\>(`validator`): [`ParserBuilder`](../type-aliases/ParserBuilder.md)\<`T`\>

Defined in: src/parsers.ts:338

JSON-encoded object, validated at runtime.

## Type Parameters

### T

`T`

## Parameters

### validator

[`JsonValidator`](../type-aliases/JsonValidator.md)\<`T`\>

A validation function or a Standard Schema

## Returns

[`ParserBuilder`](../type-aliases/ParserBuilder.md)\<`T`\>

## Example

```ts
import { z } from 'zod'
const schema = z.object({ lat: z.number(), lng: z.number() })
const coords = useQueryState('coords', parseAsJson(schema))
```
