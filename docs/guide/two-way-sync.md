# Two-way Sync

Enable URL -> state syncing so back/forward and router navigations update your state.

```ts
const page = useQueryRef('page', { default: 1, codec: serializers.number, twoWay: true });
```

Under the hood, vue-qs either listens to `popstate` (History API adapter) or `router.afterEach` (Vue Router adapter) to rehydrate values.

Use it with `useQueryReactive` as well:

```ts
const { state } = useQueryReactive(schema, { twoWay: true });
```
