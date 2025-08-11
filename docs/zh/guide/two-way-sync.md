# 双向同步

开启 URL -> 状态 的同步，这样浏览器前进/后退或路由跳转会同步到状态。

```ts
const page = useQueryRef('page', { default: 1, codec: serializers.number, twoWay: true });
```

其原理：在 History API 适配器下监听 `popstate`，在 Vue Router 适配器下监听 `router.afterEach` 来回填状态。

对于多个参数：

```ts
const { state } = useQueryReactive(schema, { twoWay: true });
```
