# 双向同步

默认：只把本地状态写入 URL（单向）。

开启 `twoWay: true` 后：浏览器前进/后退、手动修改地址栏、路由跳转都会更新你的 ref/reactive。

```ts
const page = useQueryRef('page', { default: 1, parse: Number, twoWay: true });
```

多个：

```ts
const { state } = useQueryReactive({ page: { default: 1 } }, { twoWay: true });
```

内部做的事（简化描述）：

1. 监听 `popstate` 或 `router.afterEach`。
2. 解析 URL 查询并与现有值比较。
3. 只对变化的键更新，避免循环写入。
4. 写入时设置“正在同步”标记，防止 watcher 反向触发再次写 URL。
