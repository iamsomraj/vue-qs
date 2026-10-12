[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / LoaderInput

# Type Alias: LoaderInput

> **LoaderInput** = `string` \| `URL` \| `URLSearchParams` \| `Request` \| [`QueryRecord`](QueryRecord.md)

Defined in: src/loader.ts:9

Anything search params can be read from: a URL (string or object),
a query string, `URLSearchParams`, a `Request`, or a record
such as Vue Router's `route.query` or H3's `getQuery(event)`.
