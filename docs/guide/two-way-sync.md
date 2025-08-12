# Two‑Way Sync

Add `twoWay: true` so state also updates when the URL changes (browser back/forward, router navigation).

```ts
const page = useQueryRef('page', { default: 1, codec: serializers.number, twoWay: true });
```

Reactive group:

```ts
const { state } = useQueryReactive(schema, { twoWay: true });
```

How it works:

- History API adapter listens to `popstate`.
- Router adapter listens to `router.afterEach`.

When a navigation happens we re-parse affected params and update your ref / state object.
