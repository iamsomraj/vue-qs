[**vue-qs v0.1.18**](../README.md)

***

[vue-qs](../README.md) / createRuntimeEnvironment

# Function: createRuntimeEnvironment()

> **createRuntimeEnvironment**(): [`RuntimeEnvironment`](../type-aliases/RuntimeEnvironment.md)

Defined in: [utils/core-helpers.ts:34](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/utils/core-helpers.ts#L34)

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
