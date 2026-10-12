[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / JsonValidator

# Type Alias: JsonValidator\<T\>

> **JsonValidator**\<`T`\> = (`value`) => `T` \| `null` \| [`StandardSchemaV1`](../interfaces/StandardSchemaV1.md)\<`unknown`, `T`\>

Defined in: src/parsers.ts:313

Validates a parsed JSON value: either a function returning the value
(or `null` / throwing when invalid), or a Standard Schema (Zod, Valibot, ArkType…).

## Type Parameters

### T

`T`
