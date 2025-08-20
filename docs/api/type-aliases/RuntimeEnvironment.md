[**vue-qs v0.1.18-beta.7**](../README.md)

***

[vue-qs](../README.md) / RuntimeEnvironment

# Type Alias: RuntimeEnvironment

> **RuntimeEnvironment** = `object`

Defined in: [types.ts:196](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/types.ts#L196)

Runtime environment information
Used to determine if we're running in a browser or server environment

## Example

```ts
const env: RuntimeEnvironment = {
  isBrowser: true,
  windowObject: window
};
```

## Properties

### isBrowser

> **isBrowser**: `boolean`

Defined in: [types.ts:198](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/types.ts#L198)

Whether we're running in a browser environment

***

### windowObject

> **windowObject**: `Window` \| `null`

Defined in: [types.ts:200](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/types.ts#L200)

Window object if available
