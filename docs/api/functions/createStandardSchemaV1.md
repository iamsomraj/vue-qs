[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / createStandardSchemaV1

# Function: createStandardSchemaV1()

> **createStandardSchemaV1**\<`Parsers`\>(`parsers`, `options`): [`StandardSchemaV1`](../interfaces/StandardSchemaV1.md)\<`Record`\<`string`, `undefined` \| `string` \| `string`[]\>, [`inferParserType`](../type-aliases/inferParserType.md)\<`Parsers`\>\>

Defined in: [src/standard-schema.ts:48](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/standard-schema.ts#L48)

Creates a Standard Schema validating search params with the given parsers.
Use it with libraries that accept Standard Schemas for search params.

## Type Parameters

### Parsers

`Parsers` *extends* `Record`\<`string`, [`AnyParserBuilder`](../type-aliases/AnyParserBuilder.md)\>

## Parameters

### parsers

`Parsers`

### options

[`CreateStandardSchemaV1Options`](../type-aliases/CreateStandardSchemaV1Options.md)\<`Parsers`\> = `{}`

## Returns

[`StandardSchemaV1`](../interfaces/StandardSchemaV1.md)\<`Record`\<`string`, `undefined` \| `string` \| `string`[]\>, [`inferParserType`](../type-aliases/inferParserType.md)\<`Parsers`\>\>

## Example

```ts
const schema = createStandardSchemaV1({ page: parseAsInteger.withDefault(1) })
schema['~standard'].validate({ page: '2' }) // { value: { page: 2 } }
```
