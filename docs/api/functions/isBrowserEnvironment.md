[**vue-qs v0.1.18**](../README.md)

***

[vue-qs](../README.md) / isBrowserEnvironment

# Function: isBrowserEnvironment()

> **isBrowserEnvironment**(): `boolean`

Defined in: [utils/core-helpers.ts:14](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/utils/core-helpers.ts#L14)

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
