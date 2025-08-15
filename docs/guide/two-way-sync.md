# Two‑Way Sync

Add `enableTwoWaySync: true` so state also updates when the URL changes (browser back/forward, router navigation).

```ts
const page = queryRef('page', {
  defaultValue: 1,
  codec: serializers.numberCodec,
  enableTwoWaySync: true,
});
```

Reactive group:

```ts
const { queryState } = queryReactive(schema, { enableTwoWaySync: true });
```

How it works:

- History API adapter listens to `popstate`.
- Router adapter listens to `router.afterEach`.

When a navigation happens we re-parse affected params and update your ref / state object.
