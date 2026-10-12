[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / Loader

# Type Alias: Loader()\<Parsers\>

> **Loader**\<`Parsers`\> = \{(`input`, `options?`): [`Values`](Values.md)\<`Parsers`\>; (`input`, `options?`): `Promise`\<[`Values`](Values.md)\<`Parsers`\>\>; \}

Defined in: src/loader.ts:24

Function returned by [createLoader](../functions/createLoader.md).

## Type Parameters

### Parsers

`Parsers` *extends* [`ParserMap`](ParserMap.md)

## Call Signature

> (`input`, `options?`): [`Values`](Values.md)\<`Parsers`\>

### Parameters

#### input

[`LoaderInput`](LoaderInput.md)

#### options?

[`LoaderOptions`](LoaderOptions.md)

### Returns

[`Values`](Values.md)\<`Parsers`\>

## Call Signature

> (`input`, `options?`): `Promise`\<[`Values`](Values.md)\<`Parsers`\>\>

### Parameters

#### input

`Promise`\<[`LoaderInput`](LoaderInput.md)\>

#### options?

[`LoaderOptions`](LoaderOptions.md)

### Returns

`Promise`\<[`Values`](Values.md)\<`Parsers`\>\>
