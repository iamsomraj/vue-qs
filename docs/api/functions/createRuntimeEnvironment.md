[**vue-qs v0.1.18-beta.7**](../README.md)

***

[vue-qs](../README.md) / createRuntimeEnvironment

# Function: createRuntimeEnvironment()

> **createRuntimeEnvironment**(): [`RuntimeEnvironment`](../type-aliases/RuntimeEnvironment.md)

Defined in: [utils/core-helpers.ts:34](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/utils/core-helpers.ts#L34)

Creates a runtime environment object with safe property access

## Returns

[`RuntimeEnvironment`](../type-aliases/RuntimeEnvironment.md)

Runtime environment information

## Example

```ts
const env = createRuntimeEnvironment();
if (env.isBrowser && env.windowObject) {
  // Safe to use window
  console.log(env.windowObject.location.href);
}
```
