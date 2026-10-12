[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / StandardSchemaV1Result

# Type Alias: StandardSchemaV1Result\<Output\>

> **StandardSchemaV1Result**\<`Output`\> = \{ `value`: `Output`; `issues?`: `undefined`; \} \| \{ `issues`: `ReadonlyArray`\<\{ `message`: `string`; `path?`: `ReadonlyArray`\<`PropertyKey` \| \{ `key`: `PropertyKey`; \}\>; \}\>; \}

Defined in: [src/standard-schema.ts:21](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/standard-schema.ts#L21)

Result of a Standard Schema validation.

## Type Parameters

### Output

`Output`
