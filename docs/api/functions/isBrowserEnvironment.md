[**vue-qs v0.1.18-beta.7**](../README.md)

***

[vue-qs](../README.md) / isBrowserEnvironment

# Function: isBrowserEnvironment()

> **isBrowserEnvironment**(): `boolean`

Defined in: [utils/core-helpers.ts:14](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/utils/core-helpers.ts#L14)

Safely checks if we're running in a browser environment

## Returns

`boolean`

true if running in a browser, false otherwise

## Example

```ts
if (isBrowserEnvironment()) {
  // Safe to use window, document, etc.
  console.log(window.location.href);
}
```
