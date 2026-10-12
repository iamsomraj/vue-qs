[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / inferParserType

# Type Alias: inferParserType\<Input\>

> **inferParserType**\<`Input`\> = `Input` *extends* `object` ? `D` : `Input` *extends* `object` ? `R` : `Input` *extends* `Record`\<`string`, `unknown`\> ? `{ [K in keyof Input]: inferParserType<Input[K]> }` : `never`

Defined in: [src/parsers.ts:71](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/parsers.ts#L71)

Infers the state type of a parser, or of an object of parsers.

## Type Parameters

### Input

`Input`

## Example

```ts
const parsers = { page: parseAsInteger.withDefault(1), q: parseAsString }
type State = inferParserType<typeof parsers> // { page: number; q: string | null }
```
