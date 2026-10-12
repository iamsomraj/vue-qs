[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / StandardSchemaV1

# Interface: StandardSchemaV1\<Input, Output\>

Defined in: src/standard-schema.ts:9

The Standard Schema interface (https://standardschema.dev), implemented
by Zod, Valibot, ArkType and others.

## Type Parameters

### Input

`Input` = `unknown`

### Output

`Output` = `Input`

## Properties

### ~standard

> `readonly` **~standard**: `object`

Defined in: src/standard-schema.ts:10

#### version

> `readonly` **version**: `1`

#### vendor

> `readonly` **vendor**: `string`

#### validate()

> `readonly` **validate**: (`value`) => [`StandardSchemaV1Result`](../type-aliases/StandardSchemaV1Result.md)\<`Output`\> \| `Promise`\<[`StandardSchemaV1Result`](../type-aliases/StandardSchemaV1Result.md)\<`Output`\>\>

##### Parameters

###### value

`unknown`

##### Returns

[`StandardSchemaV1Result`](../type-aliases/StandardSchemaV1Result.md)\<`Output`\> \| `Promise`\<[`StandardSchemaV1Result`](../type-aliases/StandardSchemaV1Result.md)\<`Output`\>\>

#### types?

> `readonly` `optional` **types**: `object`

##### types.input

> `readonly` **input**: `Input`

##### types.output

> `readonly` **output**: `Output`
